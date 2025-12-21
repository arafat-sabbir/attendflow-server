import { Request, Response } from 'express';
import { QRService } from './qr.service';
import {
    createQRTokenValidationSchema,
    validateQRTokenValidationSchema,
    updateQRTokenStatusValidationSchema,
    getQRTokensQueryValidationSchema,
    getQRCheckInsQueryValidationSchema,
    getQRStatisticsQueryValidationSchema,
    paramsWithIdSchema,
} from './qr.validation';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';

// Generate QR token
const generateQRToken = catchAsync(async (req: Request, res: Response) => {
    const { courseId, teacherId, validFrom, validUntil, maxUses, location, description } = req.body;

    const qrToken = await QRService.generateQRToken({
        courseId,
        teacherId,
        validFrom,
        validUntil,
        maxUses,
        location,
        description,
    });

    sendResponse(res, {
        statusCode: 201,
        message: 'QR token generated successfully',
        data: qrToken,
    });
});

// Validate QR token for check-in
const validateQRToken = catchAsync(async (req: Request, res: Response) => {
    const { token, userId, location } = req.body;

    const checkIn = await QRService.validateQRToken({
        token,
        userId,
        location,
    });

    sendResponse(res, {
        statusCode: 200,
        message: 'QR token validated and check-in recorded successfully',
        data: checkIn,
    });
});

// Get QR tokens
const getQRTokens = catchAsync(async (req: Request, res: Response) => {
    const {
        courseId,
        teacherId,
        status,
        page,
        limit,
        sortBy,
        sortOrder,
    } = req.query;

    const filters = {
        courseId: courseId as string,
        teacherId: teacherId as string,
        status: status as any,
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc',
    };

    const { tokens, total } = await QRService.getQRTokens(filters);

    sendResponse(res, {
        statusCode: 200,
        message: 'QR tokens retrieved successfully',
        data: {
            meta: {
                page: filters.page || 1,
                limit: filters.limit || 10,
                total,
                totalPages: Math.ceil(total / (filters.limit || 10)),
            },
            data: tokens,
        },
    });
});

// Get QR check-ins
const getQRCheckIns = catchAsync(async (req: Request, res: Response) => {
    const {
        tokenId,
        userId,
        courseId,
        date,
        page,
        limit,
        sortBy,
        sortOrder,
    } = req.query;

    const filters = {
        tokenId: tokenId as string,
        userId: userId as string,
        courseId: courseId as string,
        date: date as string,
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc',
    };

    const { checkIns, total } = await QRService.getQRCheckIns(filters);

    sendResponse(res, {
        statusCode: 200,
        message: 'QR check-ins retrieved successfully',
        data: {
            meta: {
                page: filters.page || 1,
                limit: filters.limit || 10,
                total,
                totalPages: Math.ceil(total / (filters.limit || 10)),
            },
            data: checkIns,
        },
    });
});

// Update QR token status
const updateQRTokenStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const qrToken = await QRService.updateQRTokenStatus(id, status);

    sendResponse(res, {
        statusCode: 200,
        message: 'QR token status updated successfully',
        data: qrToken,
    });
});

// Expire QR tokens
const expireQRTokens = catchAsync(async (req: Request, res: Response) => {
    const {
        courseId,
        teacherId,
    } = req.query;

    const filters = {
        courseId: courseId as string,
        teacherId: teacherId as string,
    };

    const result = await QRService.expireQRTokens(filters);

    sendResponse(res, {
        statusCode: 200,
        message: `${result.count} QR tokens expired successfully`,
        data: { count: result.count },
    });
});

// Get QR statistics
const getQRStatistics = catchAsync(async (req: Request, res: Response) => {
    const {
        courseId,
        teacherId,
        startDate,
        endDate,
    } = req.query;

    const filters = {
        courseId: courseId as string,
        teacherId: teacherId as string,
        startDate: startDate as string,
        endDate: endDate as string,
    };

    const statistics = await QRService.getQRStatistics(filters);

    sendResponse(res, {
        statusCode: 200,
        message: 'QR statistics retrieved successfully',
        data: statistics,
    });
});

// Get QR token by ID
const getQRTokenById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const qrToken = await QRService.getQRTokenById(id);

    if (!qrToken) {
        return sendResponse(res, {
            statusCode: 404,
            message: 'QR token not found',
            data: null,
        });
    }

    sendResponse(res, {
        statusCode: 200,
        message: 'QR token retrieved successfully',
        data: qrToken,
    });
});

// Get QR check-in by ID
const getQRCheckInById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const checkIn = await QRService.getQRCheckInById(id);

    if (!checkIn) {
        return sendResponse(res, {
            statusCode: 404,
            message: 'QR check-in not found',
            data: null,
        });
    }

    sendResponse(res, {
        statusCode: 200,
        message: 'QR check-in retrieved successfully',
        data: checkIn,
    });
});

// Delete QR token
const deleteQRToken = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const qrToken = await QRService.deleteQRToken(id);

    sendResponse(res, {
        statusCode: 200,
        message: 'QR token deleted successfully',
        data: qrToken,
    });
});

// Delete QR check-in
const deleteQRCheckIn = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const checkIn = await QRService.deleteQRCheckIn(id);

    sendResponse(res, {
        statusCode: 200,
        message: 'QR check-in deleted successfully',
        data: checkIn,
    });
});

export const QRController = {
    generateQRToken,
    validateQRToken,
    getQRTokens,
    getQRCheckIns,
    updateQRTokenStatus,
    expireQRTokens,
    getQRStatistics,
    getQRTokenById,
    getQRCheckInById,
    deleteQRToken,
    deleteQRCheckIn,
};