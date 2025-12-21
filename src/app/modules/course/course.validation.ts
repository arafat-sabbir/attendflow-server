import { z } from 'zod';

// Course validation schemas
export const createCourseValidationSchema = z.object({
    title: z.string().min(1, 'Course title is required').max(200, 'Course title must be less than 200 characters'),
    code: z.string().min(1, 'Course code is required').max(20, 'Course code must be less than 20 characters'),
    description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
    credits: z.number().int().min(0, 'Credits must be at least 0').max(10, 'Credits must be at most 10').optional(),
    batchId: z.string().cuid('Invalid batch ID'),
    departmentId: z.string().cuid('Invalid department ID'),
    teacherId: z.string().cuid('Invalid teacher ID'),
    subjectId: z.string().cuid('Invalid subject ID').optional(),
    semesterId: z.string().cuid('Invalid semester ID').optional(),
    semester: z.number().int().min(1, 'Semester must be at least 1').max(10, 'Semester must be at most 10').optional(),
});

export const updateCourseValidationSchema = z.object({
    title: z.string().min(1, 'Course title is required').max(200, 'Course title must be less than 200 characters').optional(),
    code: z.string().min(1, 'Course code is required').max(20, 'Course code must be less than 20 characters').optional(),
    description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
    credits: z.number().int().min(0, 'Credits must be at least 0').max(10, 'Credits must be at most 10').optional(),
    batchId: z.string().cuid('Invalid batch ID').optional(),
    departmentId: z.string().cuid('Invalid department ID').optional(),
    teacherId: z.string().cuid('Invalid teacher ID').optional(),
    subjectId: z.string().cuid('Invalid subject ID').optional(),
    semesterId: z.string().cuid('Invalid semester ID').optional(),
    semester: z.number().int().min(1, 'Semester must be at least 1').max(10, 'Semester must be at most 10').optional(),
    isActive: z.boolean().optional(),
});

// Course filters validation
export const courseFiltersValidationSchema = z.object({
    departmentId: z.string().cuid('Invalid department ID').optional(),
    batchId: z.string().cuid('Invalid batch ID').optional(),
    teacherId: z.string().cuid('Invalid teacher ID').optional(),
    subjectId: z.string().cuid('Invalid subject ID').optional(),
    semesterId: z.string().cuid('Invalid semester ID').optional(),
    isActive: z.boolean().optional(),
    search: z.string().max(100, 'Search term must be less than 100 characters').optional(),
});

// Course enrollment validation schemas
export const createCourseEnrollmentValidationSchema = z.object({
    studentId: z.string().cuid('Invalid student ID'),
    courseId: z.string().cuid('Invalid course ID'),
});

export const courseEnrollmentFiltersValidationSchema = z.object({
    studentId: z.string().cuid('Invalid student ID').optional(),
    courseId: z.string().cuid('Invalid course ID').optional(),
});

// Class schedule validation schemas
export const createClassScheduleValidationSchema = z.object({
    teacherId: z.string().cuid('Invalid teacher ID'),
    courseId: z.string().cuid('Invalid course ID'),
    batchId: z.string().cuid('Invalid batch ID'),
    dayOfWeek: z.number().int().min(1, 'Day of week must be between 1 and 7').max(7, 'Day of week must be between 1 and 7'),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid start time format (HH:MM)'),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid end time format (HH:MM)'),
    room: z.string().max(50, 'Room must be less than 50 characters').optional(),
    semester: z.number().int().min(1, 'Semester must be at least 1').max(10, 'Semester must be at most 10').optional(),
}).refine((data) => {
    const [startHour, startMin] = data.startTime.split(':').map(Number);
    const [endHour, endMin] = data.endTime.split(':').map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    return endMinutes > startMinutes;
}, {
    message: 'End time must be after start time',
    path: ['endTime'],
});

export const updateClassScheduleValidationSchema = z.object({
    teacherId: z.string().cuid('Invalid teacher ID').optional(),
    courseId: z.string().cuid('Invalid course ID').optional(),
    batchId: z.string().cuid('Invalid batch ID').optional(),
    dayOfWeek: z.number().int().min(1, 'Day of week must be between 1 and 7').max(7, 'Day of week must be between 1 and 7').optional(),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid start time format (HH:MM)').optional(),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid end time format (HH:MM)').optional(),
    room: z.string().max(50, 'Room must be less than 50 characters').optional(),
    semester: z.number().int().min(1, 'Semester must be at least 1').max(10, 'Semester must be at most 10').optional(),
    isActive: z.boolean().optional(),
}).refine((data) => {
    if (data.startTime && data.endTime) {
        const [startHour, startMin] = data.startTime.split(':').map(Number);
        const [endHour, endMin] = data.endTime.split(':').map(Number);

        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;

        return endMinutes > startMinutes;
    }
    return true;
}, {
    message: 'End time must be after start time',
    path: ['endTime'],
});

// Class schedule filters validation
export const classScheduleFiltersValidationSchema = z.object({
    teacherId: z.string().cuid('Invalid teacher ID').optional(),
    courseId: z.string().cuid('Invalid course ID').optional(),
    batchId: z.string().cuid('Invalid batch ID').optional(),
    dayOfWeek: z.number().int().min(1, 'Day of week must be between 1 and 7').max(7, 'Day of week must be between 1 and 7').optional(),
    semester: z.number().int().min(1, 'Semester must be at least 1').max(10, 'Semester must be at most 10').optional(),
    isActive: z.boolean().optional(),
});

// Query parameter validation
export const paginationQueryValidationSchema = z.object({
    page: z.number().int().min(1, 'Page must be at least 1').optional(),
    limit: z.number().int().min(1, 'Limit must be at least 1').max(100, 'Limit must be at most 100').optional(),
});

// Parameter validation schemas
export const courseIdParamSchema = z.object({
    params: z.object({
        courseId: z.string().cuid('Invalid course ID'),
    }),
});

export const enrollmentIdParamSchema = z.object({
    params: z.object({
        enrollmentId: z.string().cuid('Invalid enrollment ID'),
    }),
});

export const scheduleIdParamSchema = z.object({
    params: z.object({
        scheduleId: z.string().cuid('Invalid schedule ID'),
    }),
});

// Export all validation schemas
export const CourseValidation = {
    // Course validations
    createCourse: createCourseValidationSchema,
    updateCourse: updateCourseValidationSchema,
    courseFilters: courseFiltersValidationSchema,
    courseIdParam: courseIdParamSchema,

    // Course enrollment validations
    createCourseEnrollment: createCourseEnrollmentValidationSchema,
    courseEnrollmentFilters: courseEnrollmentFiltersValidationSchema,
    enrollmentIdParam: enrollmentIdParamSchema,

    // Class schedule validations
    createClassSchedule: createClassScheduleValidationSchema,
    updateClassSchedule: updateClassScheduleValidationSchema,
    classScheduleFilters: classScheduleFiltersValidationSchema,
    scheduleIdParam: scheduleIdParamSchema,

    // Query validations
    paginationQuery: paginationQueryValidationSchema,
};