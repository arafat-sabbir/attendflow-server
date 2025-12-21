import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { AuthService } from '../auth/auth.service';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import UserModel from '../user/user.model';
import AppError from '../../errors/AppError';
import bcrypt from 'bcrypt';
import config from '../../config';
import generateToken from '../../utils/generateToken';

const loginAdmin = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Find user by email
    const user = await UserModel.findUnique({
        where: { email },
    });

    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Admin not found');
    }

    // Verify role
    if ((user.role as any) !== 'ADMIN' && (user.role as any) !== 'SUPER_ADMIN') {
        throw new AppError(StatusCodes.FORBIDDEN, 'Access denied: Not an administrator');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid password');
    }

    // Generate tokens
    const jwtPayload = {
        id: user.id,
        role: user.role,
    };

    const accessToken = await generateToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires as string
    );

    const refreshToken = await generateToken(
        jwtPayload,
        config.jwt_refresh_secret as string || config.jwt_access_secret as string,
        config.jwt_refresh_expires as string || '30d'
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: 'Admin logged in successfully',
        data: {
            user: userWithoutPassword,
            accessToken,
            refreshToken,
        },
    });
});

export const AdminController = {
    loginAdmin,
};
