import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { AuthService } from './auth.service';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { AuthValidation } from './auth.validation';
import validateRequest from '../../middlewares/validateRequest';
import { AuthMiddleware } from './auth.middleware';

// Register a new user
const registerUser = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.registerUser(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        message: 'User registered successfully',
        data: result,
    });
});

// User login
const loginUser = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.loginUser(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: 'User logged in successfully',
        data: result,
    });
});

// Refresh access token
const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const result = await AuthService.refreshToken(refreshToken);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: 'Access token refreshed successfully',
        data: result,
    });
});

// User logout
const logoutUser = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    await AuthService.logoutUser(refreshToken);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: 'User logged out successfully',
        data: null,
    });
});

// Change password
const changePassword = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    await AuthService.changePassword(userId, currentPassword, newPassword);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: 'Password changed successfully',
        data: null,
    });
});

// Forgot password
const forgotPassword = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;

    await AuthService.forgotPassword(email);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: 'Password reset email sent',
        data: null,
    });
});

// Reset password
const resetPassword = catchAsync(async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;

    await AuthService.resetPassword(token, newPassword);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: 'Password reset successfully',
        data: null,
    });
});

// Verify email
const verifyEmail = catchAsync(async (req: Request, res: Response) => {
    const { token } = req.body;

    await AuthService.verifyEmail(token);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: 'Email verified successfully',
        data: null,
    });
});

// Get current user profile
const getProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id;

    // This would typically be implemented in the user service
    // For now, we'll return the user information from the token
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: 'User profile retrieved successfully',
        data: {
            id: req.user.id,
            role: req.user.role,
        },
    });
});

// Update user profile
const updateProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const updateData = req.body;

    // This would typically be implemented in the user service
    // For now, we'll just return a success message
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: 'Profile updated successfully',
        data: null,
    });
});

export const AuthController = {
    registerUser: [
        validateRequest(AuthValidation.userRegistrationValidationSchema),
        registerUser,
    ],
    loginUser: [
        validateRequest(AuthValidation.userLoginValidationSchema),
        loginUser,
    ],
    refreshToken: [
        AuthMiddleware.verifyRefreshToken,
        refreshToken,
    ],
    logoutUser: [
        AuthMiddleware.verifyRefreshToken,
        logoutUser,
    ],
    changePassword: [
        AuthMiddleware.authenticate,
        validateRequest(AuthValidation.changePasswordValidationSchema),
        changePassword,
    ],
    forgotPassword: [
        validateRequest(AuthValidation.forgotPasswordValidationSchema),
        forgotPassword,
    ],
    resetPassword: [
        validateRequest(AuthValidation.resetPasswordValidationSchema),
        resetPassword,
    ],
    verifyEmail: [
        validateRequest(AuthValidation.emailVerificationValidationSchema),
        verifyEmail,
    ],
    getProfile: [
        AuthMiddleware.authenticate,
        getProfile,
    ],
    updateProfile: [
        AuthMiddleware.authenticate,
        validateRequest(AuthValidation.updateProfileValidationSchema),
        updateProfile,
    ],
};