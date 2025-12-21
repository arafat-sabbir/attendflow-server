import { z } from 'zod';

const dashboardQuerySchema = z.object({
    query: z.object({
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional(),
        departmentId: z.string().optional(),
        batchId: z.string().optional(),
    }),
});

const classLevelStatsQuerySchema = z.object({
    query: z.object({
        courseId: z.string().optional(),
        batchId: z.string().optional(),
        departmentId: z.string().optional(),
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional(),
        page: z.coerce.number().int().positive().optional(),
        limit: z.coerce.number().int().positive().optional(),
        sortBy: z.string().optional(),
        sortOrder: z.enum(['asc', 'desc']).optional(),
    }),
});

const subjectLevelStatsQuerySchema = z.object({
    query: z.object({
        subjectId: z.string().optional(),
        batchId: z.string().optional(),
        departmentId: z.string().optional(),
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional(),
        page: z.coerce.number().int().positive().optional(),
        limit: z.coerce.number().int().positive().optional(),
        sortBy: z.string().optional(),
        sortOrder: z.enum(['asc', 'desc']).optional(),
    }),
});

const teacherPerformanceQuerySchema = z.object({
    query: z.object({
        teacherId: z.string().optional(),
        courseId: z.string().optional(),
        batchId: z.string().optional(),
        departmentId: z.string().optional(),
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional(),
        page: z.coerce.number().int().positive().optional(),
        limit: z.coerce.number().int().positive().optional(),
        sortBy: z.string().optional(),
        sortOrder: z.enum(['asc', 'desc']).optional(),
    }),
});

const lowAttendanceAlertsQuerySchema = z.object({
    query: z.object({
        threshold: z.coerce.number().int().min(0).max(100).optional(),
        page: z.coerce.number().int().positive().optional(),
        limit: z.coerce.number().int().positive().optional(),
    }),
});

const attendanceReportQuerySchema = z.object({
    query: z.object({
        reportType: z.enum(['overall', 'department', 'batch', 'course', 'student', 'teacher']).optional(),
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional(),
        departmentIds: z.string().optional(),
        batchIds: z.string().optional(),
        courseIds: z.string().optional(),
    }),
});

export const DashboardValidation = {
    dashboardQuery: dashboardQuerySchema,
    classLevelStatsQuery: classLevelStatsQuerySchema,
    subjectLevelStatsQuery: subjectLevelStatsQuerySchema,
    teacherPerformanceQuery: teacherPerformanceQuerySchema,
    lowAttendanceAlertsQuery: lowAttendanceAlertsQuerySchema,
    attendanceReportQuery: attendanceReportQuerySchema,
};