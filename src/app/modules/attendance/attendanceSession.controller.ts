import { Request, Response } from 'express';
import { AttendanceSessionService } from './attendanceSession.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';

// Create attendance session
const createAttendanceSession = catchAsync(async (req: Request, res: Response) => {
    const { courseId, teacherId, startTime, location, notes } = req.body;

    const session = await AttendanceSessionService.createAttendanceSession({
        courseId,
        teacherId,
        startTime: startTime ? new Date(startTime) : new Date(),
        location,
        notes,
    });

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        message: 'Attendance session created successfully',
        data: session,
    });
});

// Get active session for a course and teacher
const getActiveSession = catchAsync(async (req: Request, res: Response) => {
    const { courseId, teacherId } = req.query;

    if (!courseId || !teacherId) {
        return sendResponse(res, {
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'Course ID and Teacher ID are required',
            data: null,
        });
    }

    const session = await AttendanceSessionService.getActiveSession(
        courseId as string,
        teacherId as string
    );

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: 'Active session retrieved successfully',
        data: session,
    });
});

// Get session statistics for polling
const getSessionStats = catchAsync(async (req: Request, res: Response) => {
    const { sessionId } = req.params;

    const stats = await AttendanceSessionService.getSessionStats(sessionId);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: 'Session statistics retrieved successfully',
        data: stats,
    });
});

// End attendance session
const endSession = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { teacherId } = req.body;

    const session = await AttendanceSessionService.endSession(id, teacherId);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: 'Session ended successfully',
        data: session,
    });
});

// Get attendance sessions with filters
const getAttendanceSessions = catchAsync(async (req: Request, res: Response) => {
    const {
        courseId,
        teacherId,
        isActive,
        startDate,
        endDate,
        page,
        limit,
        sortBy,
        sortOrder,
    } = req.query;

    const filters = {
        courseId: courseId as string,
        teacherId: teacherId as string,
        isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc',
    };

    const { sessions, total } = await AttendanceSessionService.getAttendanceSessions(filters);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: 'Attendance sessions retrieved successfully',
        data: {
            sessions,
            meta: {
                page: filters.page || 1,
                limit: filters.limit || 10,
                total,
                totalPages: Math.ceil(total / (filters.limit || 10)),
            },
        },
    });
});

// Get attendance session by ID
const getAttendanceSessionById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const session = await AttendanceSessionService.getAttendanceSessionById(id);

    if (!session) {
        return sendResponse(res, {
            statusCode: StatusCodes.NOT_FOUND,
            message: 'Session not found',
            data: null,
        });
    }

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: 'Session retrieved successfully',
        data: session,
    });
});

export const AttendanceSessionController = {
    createAttendanceSession,
    getActiveSession,
    getSessionStats,
    endSession,
    getAttendanceSessions,
    getAttendanceSessionById,
};
