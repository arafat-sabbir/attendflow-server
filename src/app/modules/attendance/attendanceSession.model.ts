import prisma from '../../config/prisma';
import {
    IAttendanceSession,
    IAttendanceSessionCreate,
    IAttendanceSessionUpdate,
    IAttendanceSessionFilters,
} from './attendance.interface';

// Attendance Session model operations
export const AttendanceSessionModel = {
    // Create a new attendance session
    create: async (data: IAttendanceSessionCreate): Promise<IAttendanceSession> => {
        const result = await prisma.attendanceSession.create({
            data: {
                courseId: data.courseId,
                teacherId: data.teacherId,
                date: data.date || data.startTime,
                startTime: data.startTime,
                location: data.location,
                notes: data.notes,
                isActive: true,
            },
            include: {
                course: {
                    select: { id: true, title: true, code: true },
                },
                teacher: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        return result as unknown as IAttendanceSession;
    },

    // Find attendance session by ID
    findById: async (id: string): Promise<IAttendanceSession | null> => {
        const result = await prisma.attendanceSession.findUnique({
            where: { id },
            include: {
                course: {
                    select: { id: true, title: true, code: true },
                },
                teacher: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        return result as unknown as IAttendanceSession | null;
    },

    // Get attendance sessions with filters
    findMany: async (filters: IAttendanceSessionFilters) => {
        const {
            courseId,
            teacherId,
            isActive,
            startDate,
            endDate,
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = filters;

        const where: any = {};

        if (courseId) where.courseId = courseId;
        if (teacherId) where.teacherId = teacherId;
        if (isActive !== undefined) where.isActive = isActive;
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt.gte = new Date(startDate);
            if (endDate) where.createdAt.lte = new Date(endDate);
        }

        const skip = (page - 1) * limit;

        const [sessions, total] = await Promise.all([
            prisma.attendanceSession.findMany({
                where,
                include: {
                    course: {
                        select: { id: true, title: true, code: true },
                    },
                    teacher: {
                        select: { id: true, name: true, email: true },
                    },
                },
                orderBy: { [sortBy]: sortOrder },
                skip,
                take: limit,
            }),
            prisma.attendanceSession.count({ where }),
        ]);

        return {
            data: sessions as unknown as IAttendanceSession[],
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    },

    // Update attendance session
    update: async (id: string, data: Partial<IAttendanceSessionUpdate>): Promise<IAttendanceSession> => {
        const result = await prisma.attendanceSession.update({
            where: { id },
            data: data as any,
            include: {
                course: {
                    select: { id: true, title: true, code: true },
                },
                teacher: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        return result as unknown as IAttendanceSession;
    },

    // Delete attendance session
    delete: async (id: string): Promise<IAttendanceSession> => {
        const result = await prisma.attendanceSession.delete({
            where: { id },
            include: {
                course: {
                    select: { id: true, title: true, code: true },
                },
                teacher: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        return result as unknown as IAttendanceSession;
    },

    // Get active sessions for a teacher and course
    findActiveSessions: async (courseId: string, teacherId: string): Promise<IAttendanceSession[]> => {
        const result = await prisma.attendanceSession.findMany({
            where: {
                courseId,
                teacherId,
                isActive: true,
            },
            include: {
                course: {
                    select: { id: true, title: true, code: true },
                },
                teacher: {
                    select: { id: true, name: true, email: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return result as unknown as IAttendanceSession[];
    },
};

export default AttendanceSessionModel;
