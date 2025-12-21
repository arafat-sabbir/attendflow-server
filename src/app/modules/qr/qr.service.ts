import QRTokenModel, { QRCheckInModel } from './qr.model';
import {
    IQRToken,
    IQRTokenFilters,
    IQRCheckIn,
    IQRCheckInFilters,
    IQRStatistics,
    IQRTokenCreate,
    IQRCheckInCreate,
    IQRValidationRequest,
    QRCodeStatus,
    QRCodeStatusType,
} from './qr.interface';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';

// Generate QR token for attendance
const generateQRToken = async (payload: IQRTokenCreate): Promise<IQRToken> => {
    // Create QR token data with default values
    const qrTokenData = {
        courseId: payload.courseId,
        teacherId: payload.teacherId,
        validFrom: payload.validFrom || new Date(),
        validUntil: payload.validUntil || new Date(Date.now() + 30 * 60 * 1000), // 30 minutes default
        maxUses: payload.maxUses || 1, // Default to 1 use
        location: payload.location,
        description: payload.description,
    };

    // Create QR token in database
    const result = await QRTokenModel.create(qrTokenData);

    return result;
};

// Validate QR token for check-in
const validateQRToken = async (payload: IQRValidationRequest): Promise<IQRCheckIn> => {
    const token = payload.token || payload.code;
    const userId = payload.userId;
    const location = payload.location;

    if (!token) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Token or code is required');
    }

    // Find QR token
    const qrToken = await QRTokenModel.findByToken(token);

    if (!qrToken) {
        throw new AppError(StatusCodes.NOT_FOUND, 'QR token not found');
    }

    // Check if token is valid
    const validation = await QRTokenModel.isValidToken(token);
    if (!validation.isValid) {
        throw new AppError(StatusCodes.GONE, validation.reason || 'QR token is not valid');
    }

    // Check if user has already checked in with this token
    const existingCheckIns = await QRCheckInModel.findMany({
        tokenId: qrToken.id,
        userId,
        page: 1,
        limit: 1,
    });

    if (existingCheckIns.data.length > 0) {
        throw new AppError(StatusCodes.CONFLICT, 'User has already checked in with this QR token');
    }

    // Create check-in record
    const checkInData: IQRCheckInCreate = {
        tokenId: qrToken.id,
        userId,
        checkInTime: new Date(),
        location: location || qrToken.location,
        isValid: true,
    };

    const result = await QRCheckInModel.create(checkInData);

    // Increment used count for the token
    await QRTokenModel.incrementUsedCount(qrToken.id);

    return result;
};

// Get QR tokens with filtering
const getQRTokens = async (filters: IQRTokenFilters): Promise<{ tokens: IQRToken[]; total: number }> => {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = filters;

    const result = await QRTokenModel.findMany({
        ...filters,
        page,
        limit,
        sortBy,
        sortOrder,
    });

    return { tokens: result.data, total: result.meta.total };
};

// Get QR check-ins with filtering
const getQRCheckIns = async (filters: IQRCheckInFilters): Promise<{ checkIns: IQRCheckIn[]; total: number }> => {
    const { page = 1, limit = 10, sortBy = 'checkInTime', sortOrder = 'desc' } = filters;

    const result = await QRCheckInModel.findMany({
        ...filters,
        page,
        limit,
        sortBy,
        sortOrder,
    });

    return { checkIns: result.data as unknown as IQRCheckIn[], total: result.meta.total };
};

// Update QR token status
const updateQRTokenStatus = async (id: string, status: QRCodeStatusType): Promise<IQRToken> => {
    // Check if token exists
    const token = await QRTokenModel.findById(id);
    if (!token) {
        throw new AppError(StatusCodes.NOT_FOUND, 'QR token not found');
    }

    // Update token status
    const result = await QRTokenModel.update(id, { status: status as any });

    return result;
};

// Expire QR tokens manually
const expireQRTokens = async (filters: Partial<IQRTokenFilters>): Promise<{ count: number }> => {
    // Find all active tokens matching filters
    const { data: activeTokens } = await QRTokenModel.findMany({
        ...filters,
        status: QRCodeStatus.ACTIVE,
        page: 1,
        limit: 1000, // Get all active tokens
    });

    if (activeTokens.length === 0) {
        return { count: 0 };
    }

    // Update all found tokens to expired status
    let count = 0;
    for (const token of activeTokens) {
        await QRTokenModel.expireToken(token.id);
        count++;
    }

    return { count };
};

// Get QR statistics
const getQRStatistics = async (filters: Partial<IQRTokenFilters>): Promise<IQRStatistics> => {
    const statistics = await QRCheckInModel.getStatistics();

    return statistics;
};

// Get QR token by ID
const getQRTokenById = async (id: string): Promise<IQRToken | null> => {
    const result = await QRTokenModel.findById(id);

    return result;
};

// Get QR check-in by ID
const getQRCheckInById = async (id: string): Promise<IQRCheckIn | null> => {
    const result = await QRCheckInModel.findById(id);

    return result;
};

// Delete QR token
const deleteQRToken = async (id: string): Promise<IQRToken> => {
    // Check if token exists
    const token = await QRTokenModel.findById(id);
    if (!token) {
        throw new AppError(StatusCodes.NOT_FOUND, 'QR token not found');
    }

    // Check if token has any check-ins
    const existingCheckIns = await QRCheckInModel.findMany({
        tokenId: id,
        page: 1,
        limit: 1,
    });

    if (existingCheckIns.data.length > 0) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Cannot delete QR token with existing check-ins');
    }

    // Delete token
    const result = await QRTokenModel.delete(id);

    return result;
};

// Delete QR check-in
const deleteQRCheckIn = async (id: string): Promise<IQRCheckIn> => {
    // Check if check-in exists
    const checkIn = await QRCheckInModel.findById(id);
    if (!checkIn) {
        throw new AppError(StatusCodes.NOT_FOUND, 'QR check-in not found');
    }

    // Delete check-in
    const result = await QRCheckInModel.remove(id);

    return result;
};

export const QRService = {
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