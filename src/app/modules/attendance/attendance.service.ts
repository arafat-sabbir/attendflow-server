import { AttendanceModel, QRCodeModel, AttendanceSessionModel } from './attendance.model';
import {
    IAttendance,
    IAttendanceCreate,
    IAttendanceUpdate,
    IBulkAttendanceCreate,
    IQRCode,
    IQRCodeCreate,
    IQRCodeCheckIn,
    IAttendanceSession,
    IAttendanceSessionCreate,
    IAttendanceFilters,
    IAttendanceSummary,
    ICourseAttendanceStats,
    IStudentAttendanceStats,
    IAttendanceDashboard,
} from './attendance.interface';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import prisma from '../../config/prisma';

/**
 * Record attendance for a student
 */
const recordAttendance = async (data: IAttendanceCreate): Promise<IAttendance> => {
    // Check if user exists
    const user = await prisma.user.findUnique({
        where: { id: data.userId },
    });

    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
        where: { id: data.courseId },
    });

    if (!course) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Course not found');
    }

    // Check if attendance already exists for this user, course, and date
    const existingAttendance = await AttendanceModel.findByUserCourseDate(
        data.userId,
        data.courseId,
        data.date
    );

    if (existingAttendance) {
        throw new AppError(StatusCodes.CONFLICT, 'Attendance already recorded for this date');
    }

    const attendance = await AttendanceModel.create(data);
    return attendance as IAttendance;
};

/**
 * Update attendance record
 */
const updateAttendance = async (id: string, data: IAttendanceUpdate): Promise<IAttendance> => {
    // Check if attendance exists
    const existingAttendance = await AttendanceModel.findById(id);

    if (!existingAttendance) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Attendance record not found');
    }

    const updatedAttendance = await AttendanceModel.update(id, data);
    return updatedAttendance as IAttendance;
};

/**
 * Get attendance by ID
 */
const getAttendanceById = async (id: string): Promise<IAttendance | null> => {
    const attendance = await AttendanceModel.findById(id);

    if (!attendance) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Attendance record not found');
    }

    return attendance as IAttendance;
};

/**
 * Get attendance records with filters
 */
const getAttendances = async (filters: IAttendanceFilters) => {
    const result = await AttendanceModel.findMany(filters);
    return result;
};

/**
 * Bulk mark attendance for multiple students
 */
const bulkMarkAttendance = async (data: IBulkAttendanceCreate) => {
    // Check if course exists
    const course = await prisma.course.findUnique({
        where: { id: data.courseId },
    });

    if (!course) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Course not found');
    }

    const results = await AttendanceModel.bulkMark(data);
    return results;
};

/**
 * Get attendance summary for a course
 */
const getCourseAttendanceSummary = async (
    courseId: string,
    startDate?: Date,
    endDate?: Date
): Promise<IAttendanceSummary> => {
    // Check if course exists
    const course = await prisma.course.findUnique({
        where: { id: courseId },
    });

    if (!course) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Course not found');
    }

    const summary = await AttendanceModel.getCourseSummary(courseId, startDate, endDate);
    return summary;
};

/**
 * Get attendance summary for a student
 */
const getStudentAttendanceSummary = async (
    userId: string,
    startDate?: Date,
    endDate?: Date
): Promise<IAttendanceSummary> => {
    // Check if user exists
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
    }

    const summary = await AttendanceModel.getStudentSummary(userId, startDate, endDate);
    return summary;
};

/**
 * Create QR code for attendance check-in
 */
const createQRCode = async (data: IQRCodeCreate): Promise<IQRCode> => {
    // Check if attendance session exists
    const session = await prisma.attendanceSession.findUnique({
        where: { id: data.attendanceSessionId },
    });

    if (!session) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Attendance session not found');
    }

    const qrCode = await QRCodeModel.create(data);
    return qrCode;
};

/**
 * Process QR code check-in
 */
const processQRCodeCheckIn = async (data: IQRCodeCheckIn) => {
    // Check if user exists
    const user = await prisma.user.findUnique({
        where: { id: data.userId },
    });

    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
    }

    const attendance = await QRCodeModel.processCheckIn(data);
    return attendance;
};

/**
 * Create attendance session
 */
const createAttendanceSession = async (data: IAttendanceSessionCreate): Promise<IAttendanceSession> => {
    // Check if course exists
    const course = await prisma.course.findUnique({
        where: { id: data.courseId },
    });

    if (!course) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Course not found');
    }

    // Check if teacher exists
    const teacher = await prisma.user.findUnique({
        where: { id: data.teacherId },
    });

    if (!teacher) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Teacher not found');
    }

    const session = await AttendanceSessionModel.create(data);
    return session;
};

/**
 * Get attendance dashboard data
 */
const getAttendanceDashboard = async (): Promise<IAttendanceDashboard> => {
    // Get today's attendance statistics
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
        totalToday,
        presentToday,
        absentToday,
        lateToday,
        excusedToday,
    ] = await Promise.all([
        prisma.attendance.count({
            where: {
                date: {
                    gte: today,
                    lt: tomorrow,
                },
            },
        }),
        prisma.attendance.count({
            where: {
                date: {
                    gte: today,
                    lt: tomorrow,
                },
                status: 'PRESENT',
            },
        }),
        prisma.attendance.count({
            where: {
                date: {
                    gte: today,
                    lt: tomorrow,
                },
                status: 'ABSENT',
            },
        }),
        prisma.attendance.count({
            where: {
                date: {
                    gte: today,
                    lt: tomorrow,
                },
                status: 'LATE',
            },
        }),
        prisma.attendance.count({
            where: {
                date: {
                    gte: today,
                    lt: tomorrow,
                },
                status: 'EXCUSED',
            },
        }),
    ]);

    // Get weekly trend (last 7 days)
    const weeklyTrend = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const [total, present] = await Promise.all([
            prisma.attendance.count({
                where: {
                    date: {
                        gte: date,
                        lt: nextDate,
                    },
                },
            }),
            prisma.attendance.count({
                where: {
                    date: {
                        gte: date,
                        lt: nextDate,
                    },
                    status: 'PRESENT',
                },
            }),
        ]);

        const attendance = total > 0 ? Math.round((present / total) * 100) : 0;
        weeklyTrend.push({
            day: date.toLocaleDateString('en', { weekday: 'short' }),
            attendance,
        });
    }

    // Get top and low performers (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const studentStats = await prisma.$queryRaw`
        SELECT 
            u.id as userId,
            u.name,
            COUNT(*) as totalClasses,
            SUM(CASE WHEN a.status = 'PRESENT' THEN 1 ELSE 0 END) as presentCount
        FROM attendances a
        JOIN users u ON a.userId = u.id
        WHERE a.date >= ${thirtyDaysAgo}
        GROUP BY u.id, u.name
        HAVING COUNT(*) >= 5
        ORDER BY (SUM(CASE WHEN a.status = 'PRESENT' THEN 1 ELSE 0 END) / COUNT(*)) DESC
        LIMIT 10
    ` as { userId: string; name: string; totalClasses: number; presentCount: number }[];

    const topPerformers = studentStats.slice(0, 5).map(student => ({
        userId: student.userId,
        name: student.name,
        attendance: Math.round((student.presentCount / student.totalClasses) * 100),
    }));

    const lowPerformers = studentStats.slice(-5).reverse().map(student => ({
        userId: student.userId,
        name: student.name,
        attendance: Math.round((student.presentCount / student.totalClasses) * 100),
    }));

    return {
        totalSessions: 0, // Would be calculated from attendance sessions
        activeSessions: 0, // Would be calculated from active attendance sessions
        todayAttendance: {
            total: totalToday,
            present: presentToday,
            absent: absentToday,
            late: lateToday,
            excused: excusedToday,
        },
        weeklyTrend,
        topPerformers,
        lowPerformers,
    };
};

export const attendanceServices = {
    recordAttendance,
    updateAttendance,
    getAttendanceById,
    getAttendances,
    bulkMarkAttendance,
    getCourseAttendanceSummary,
    getStudentAttendanceSummary,
    createQRCode,
    processQRCodeCheckIn,
    createAttendanceSession,
    getAttendanceDashboard,
};