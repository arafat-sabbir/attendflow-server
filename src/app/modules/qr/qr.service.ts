import QRTokenModel, { QRCheckInModel, checkRateLimit } from './qr.model';
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
import { CourseModel } from '../course';
import { TeacherModel } from '../teacher/teacher.model';
import { StudentModel } from '../student/student.model';
import prisma from '../../config/prisma';

// Generate QR token for attendance
const generateQRToken = async (payload: IQRTokenCreate): Promise<IQRToken> => {
    // Validate course exists
    const courseExists = await CourseModel.findUnique({
        where: { id: payload.courseId },
    });
    if (!courseExists) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Course not found');
    }

    // Validate teacher exists and get user ID
    const teacherExists = await TeacherModel.findById(payload.teacherId);
    if (!teacherExists) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Teacher not found');
    }

    // Validate date/time inputs
    const now = new Date();
    let validFrom = payload.validFrom ? new Date(payload.validFrom) : now;
    let validUntil = payload.validUntil ? new Date(payload.validUntil) : new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes default

    // Ensure validFrom is not in the past (allow 5 minutes buffer for clock sync)
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    if (validFrom < fiveMinutesAgo) {
        validFrom = now;
    }

    // Ensure validUntil is after validFrom
    if (validUntil <= validFrom) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'validUntil must be after validFrom');
    }

    // Ensure validUntil is not more than 24 hours from now (security measure)
    const maxValidUntil = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    if (validUntil > maxValidUntil) {
        validUntil = maxValidUntil;
    }

    // Validate maxUses
    const maxUses = Math.min(Math.max(payload.maxUses || 1, 1), 1000); // Between 1 and 1000

    // Create QR token data with validated values
    const qrTokenData = {
        courseId: payload.courseId,
        teacherId: teacherExists.userId, // Use User.id, not Teacher.id
        validFrom,
        validUntil,
        maxUses,
        location: payload.location?.trim() || null,
        description: payload.description?.trim() || null,
    };

    // Create QR token in database
    const result = await QRTokenModel.create(qrTokenData);

    return result;
};

// Validate QR token for check-in
const validateQRToken = async (payload: IQRValidationRequest): Promise<{ checkIn: IQRCheckIn; attendance?: any }> => {
    const token = payload.token || payload.code;
    const userId = payload.userId;
    const location = payload.location;
    const ipAddress = payload.ipAddress;
    const userAgent = payload.userAgent;

    if (!token) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Token or code is required');
    }

    // Rate limiting check - use IP address as primary identifier, fallback to userId
    const rateLimitIdentifier = ipAddress || userId;
    
    if (!checkRateLimit(rateLimitIdentifier, 5, 60000)) { // 5 attempts per minute
        throw new AppError(StatusCodes.TOO_MANY_REQUESTS, 'Too many validation attempts. Please try again later.');
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

    // Validate student exists and is active
    const student = await StudentModel.findUnique({
        where: { userId: userId },
    });
    if (!student) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Student not found');
    }

    // Validate student enrollment in the course
    const studentEnrollment = await prisma.courseEnrollment.findFirst({
        where: {
            studentId: userId,
            courseId: qrToken.courseId,
        },
    });

    if (!studentEnrollment) {
        throw new AppError(StatusCodes.FORBIDDEN, 'Student is not enrolled in this course');
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

    // Create check-in record with server timestamp
    const checkInData: IQRCheckInCreate = {
        tokenId: qrToken.id,
        userId,
        checkInTime: new Date(), // Server timestamp - never trust client
        location: location || qrToken.location,
        ipAddress,
        userAgent,
        isValid: true,
    };

    const checkIn = await QRCheckInModel.create(checkInData);

    // Increment used count for the token
    await QRTokenModel.incrementUsedCount(qrToken.id);

    // Check if token has reached max uses and update status if needed
    if ((qrToken.usedCount + 1) >= qrToken.maxUses) {
        await QRTokenModel.expireToken(qrToken.id);
    }

    // Create attendance record
    let attendance;
    try {
        const { AttendanceModel } = await import('../attendance/attendance.model');
        
        // Check if attendance already exists for this user, course, and date
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const existingAttendance = await (AttendanceModel as any).findFirst({
            where: {
                userId,
                courseId: qrToken.courseId,
                date: {
                    gte: today,
                    lt: tomorrow,
                },
            },
        });

        if (!existingAttendance) {
            // Create new attendance record
            attendance = await (AttendanceModel as any).create({
                data: {
                    userId,
                    courseId: qrToken.courseId,
                    date: new Date(),
                    status: 'PRESENT',
                    checkIn: new Date(),
                    qRCodeId: qrToken.id,
                    markedBy: qrToken.teacherId,
                },
            });
        } else {
            // Update existing attendance record
            attendance = await (AttendanceModel as any).update({
                where: { id: existingAttendance.id },
                data: {
                    status: 'PRESENT',
                    checkIn: new Date(),
                    qRCodeId: qrToken.id,
                    markedBy: qrToken.teacherId,
                },
            });
        }
    } catch (error) {
        // Log error but don't fail the check-in process
        console.error('Error creating attendance record:', error);
    }

    return { checkIn, attendance };
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
