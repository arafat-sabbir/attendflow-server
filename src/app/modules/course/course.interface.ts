import { User, Student, Teacher, Department, Subject, Batch, Semester } from '@prisma/client';

// Export Prisma-generated types
export type Course = any; // Will be replaced with actual Prisma type after client generation
export type CourseEnrollment = any;
export type ClassSchedule = any;

// Course with related information
export interface ICourseWithRelations extends Course {
    teacher?: User;
    teacherProfile?: Teacher;
    batch?: Batch;
    department?: Department;
    subject?: Subject;
    semesterInfo?: Semester;
    enrollments?: CourseEnrollment[];
    attendanceRecords?: any[];
    schedules?: ClassSchedule[];
    _count?: {
        enrollments?: number;
        attendanceRecords?: number;
        schedules?: number;
    };
}

// Course enrollment with related information
export interface ICourseEnrollmentWithRelations extends CourseEnrollment {
    student?: User & { studentProfile?: Student };
    course?: Course;
}

// Class schedule with related information
export interface IClassScheduleWithRelations extends ClassSchedule {
    teacher?: User;
    course?: Course;
    batch?: Batch;
}

// For creating a new course
export interface ICourseCreate {
    title: string;
    code: string;
    description?: string;
    credits?: number;
    batchId: string;
    departmentId: string;
    teacherId: string;
    subjectId?: string;
    semesterId?: string;
    semester?: number;
}

// For updating a course
export interface ICourseUpdate extends Partial<ICourseCreate> {
    isActive?: boolean;
}

// For creating a new course enrollment
export interface ICourseEnrollmentCreate {
    studentId: string;
    courseId: string;
}

// For creating a new class schedule
export interface IClassScheduleCreate {
    teacherId: string;
    courseId: string;
    batchId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    room?: string;
    semester?: number;
}

// For updating a class schedule
export interface IClassScheduleUpdate extends Partial<IClassScheduleCreate> {
    isActive?: boolean;
}

// Filters for queries
export interface ICourseFilters {
    departmentId?: string;
    batchId?: string;
    teacherId?: string;
    subjectId?: string;
    semesterId?: string;
    isActive?: boolean;
    search?: string;
}

export interface ICourseEnrollmentFilters {
    studentId?: string;
    courseId?: string;
}

export interface IClassScheduleFilters {
    teacherId?: string;
    courseId?: string;
    batchId?: string;
    dayOfWeek?: number;
    semester?: number;
    isActive?: boolean;
}

// Statistics
export interface ICourseStats {
    totalCourses: number;
    activeCourses: number;
    inactiveCourses: number;
    coursesByDepartment: Record<string, number>;
    coursesByBatch: Record<string, number>;
    coursesByTeacher: Record<string, number>;
}

export interface ICourseEnrollmentStats {
    totalEnrollments: number;
    enrollmentsByCourse: Record<string, number>;
    enrollmentsByStudent: Record<string, number>;
}

export interface IClassScheduleStats {
    totalSchedules: number;
    activeSchedules: number;
    inactiveSchedules: number;
    schedulesByDay: Record<number, number>;
    schedulesByTeacher: Record<string, number>;
}

// API Response types
export interface ICourseResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
    };
}