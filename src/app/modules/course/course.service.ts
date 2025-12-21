import {
    Course,
    CourseEnrollment,
    ClassSchedule,
    ICourseCreate,
    ICourseUpdate,
    ICourseFilters,
    ICourseWithRelations,
    ICourseStats,
    ICourseEnrollmentCreate,
    ICourseEnrollmentWithRelations,
    ICourseEnrollmentFilters,
    ICourseEnrollmentStats,
    IClassScheduleCreate,
    IClassScheduleUpdate,
    IClassScheduleWithRelations,
    IClassScheduleFilters,
    IClassScheduleStats,
} from './course.interface';
import { CourseModel, CourseEnrollmentModel, ClassScheduleModel } from './course.model';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';

// Course services
export const createCourse = async (data: ICourseCreate): Promise<Course> => {
    try {
        // Check if course code already exists
        const existingCourseByCode = await CourseModel.findFirst({
            where: { code: data.code },
        });

        if (existingCourseByCode) {
            throw new AppError(StatusCodes.CONFLICT, 'Course with this code already exists');
        }

        return await CourseModel.create({
            data,
            include: {
                teacher: {
                    select: { id: true, name: true, email: true },
                },
                batch: true,
                department: true,
                subject: true,
            },
        }) as unknown as Course;
    } catch (error) {
        throw error;
    }
};

export const getCourseById = async (id: string): Promise<ICourseWithRelations | null> => {
    try {
        const course = await CourseModel.findUnique({
            where: { id },
            include: {
                teacher: {
                    select: { id: true, name: true, email: true },
                },
                teacherProfile: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true },
                        },
                        department: true,
                    },
                },
                batch: true,
                department: true,
                subject: true,
                semesterInfo: true,
                enrollments: {
                    include: {
                        student: {
                            select: { id: true, name: true, email: true },
                        },
                    },
                },
                attendanceRecords: {
                    select: { id: true, status: true, date: true },
                    take: 10,
                    orderBy: { date: 'desc' },
                },
                schedules: true,
                _count: {
                    select: {
                        enrollments: true,
                        attendanceRecords: true,
                        schedules: true,
                    },
                },
            },
        });

        if (!course) {
            throw new AppError(StatusCodes.NOT_FOUND, 'Course not found');
        }

        return course as unknown as ICourseWithRelations;
    } catch (error) {
        throw error;
    }
};

export const updateCourse = async (id: string, data: ICourseUpdate): Promise<Course> => {
    try {
        // Check if course exists
        const existingCourse = await CourseModel.findUnique({
            where: { id },
        });

        if (!existingCourse) {
            throw new AppError(StatusCodes.NOT_FOUND, 'Course not found');
        }

        // If updating code, check if it's already taken by another course
        if (data.code) {
            const existingCourseByCode = await CourseModel.findFirst({
                where: {
                    code: data.code,
                    id: { not: id },
                },
            });

            if (existingCourseByCode) {
                throw new AppError(StatusCodes.CONFLICT, 'Course with this code already exists');
            }
        }

        return await CourseModel.update({
            where: { id },
            data,
            include: {
                teacher: {
                    select: { id: true, name: true, email: true },
                },
                batch: true,
                department: true,
                subject: true,
            },
        }) as unknown as Course;
    } catch (error) {
        throw error;
    }
};

export const deleteCourse = async (id: string): Promise<void> => {
    try {
        // Check if course exists
        const existingCourse = await CourseModel.findUnique({
            where: { id },
        });

        if (!existingCourse) {
            throw new AppError(StatusCodes.NOT_FOUND, 'Course not found');
        }

        // Check if course has enrollments, attendance records, or schedules
        const courseWithRelations = await CourseModel.findUnique({
            where: { id },
            include: {
                enrollments: { take: 1 },
                attendanceRecords: { take: 1 },
                schedules: { take: 1 },
            },
        });

        if (courseWithRelations?.enrollments && courseWithRelations.enrollments.length > 0) {
            throw new AppError(StatusCodes.CONFLICT, 'Cannot delete course with enrolled students');
        }

        if (courseWithRelations?.attendanceRecords && courseWithRelations.attendanceRecords.length > 0) {
            throw new AppError(StatusCodes.CONFLICT, 'Cannot delete course with attendance records');
        }

        if (courseWithRelations?.schedules && courseWithRelations.schedules.length > 0) {
            throw new AppError(StatusCodes.CONFLICT, 'Cannot delete course with class schedules');
        }

        await CourseModel.delete({
            where: { id },
        });
    } catch (error) {
        throw error;
    }
};

export const getAllCourses = async (filters: ICourseFilters = {}): Promise<Course[]> => {
    try {
        const { departmentId, batchId, teacherId, subjectId, semesterId, isActive, search } = filters;

        const where: any = {};

        if (departmentId) where.departmentId = departmentId;
        if (batchId) where.batchId = batchId;
        if (teacherId) where.teacherId = teacherId;
        if (subjectId) where.subjectId = subjectId;
        if (semesterId) where.semesterId = semesterId;
        if (isActive !== undefined) where.isActive = isActive;
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { code: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        return await CourseModel.findMany({
            where,
            include: {
                teacher: {
                    select: { id: true, name: true, email: true },
                },
                batch: true,
                department: true,
                subject: true,
                _count: {
                    select: {
                        enrollments: true,
                        attendanceRecords: true,
                        schedules: true,
                    },
                },
            },
            orderBy: { title: 'asc' },
        }) as unknown as Course[];
    } catch (error) {
        throw error;
    }
};

export const getCourseStats = async (): Promise<ICourseStats> => {
    try {
        const totalCourses = await CourseModel.count();
        const activeCourses = await CourseModel.count({ where: { isActive: true } });
        const inactiveCourses = await CourseModel.count({ where: { isActive: false } });

        const coursesByDepartment = await CourseModel.groupBy({
            by: ['departmentId'],
            _count: true,
        });

        const coursesByBatch = await CourseModel.groupBy({
            by: ['batchId'],
            _count: true,
        });

        const coursesByTeacher = await CourseModel.groupBy({
            by: ['teacherId'],
            _count: true,
        });

        return {
            totalCourses,
            activeCourses,
            inactiveCourses,
            coursesByDepartment: coursesByDepartment.reduce((acc: Record<string, number>, item: any) => {
                acc[item.departmentId] = item._count;
                return acc;
            }, {}),
            coursesByBatch: coursesByBatch.reduce((acc: Record<string, number>, item: any) => {
                acc[item.batchId] = item._count;
                return acc;
            }, {}),
            coursesByTeacher: coursesByTeacher.reduce((acc: Record<string, number>, item: any) => {
                acc[item.teacherId] = item._count;
                return acc;
            }, {}),
        };
    } catch (error) {
        throw error;
    }
};

// Course Enrollment services
export const enrollStudentInCourse = async (data: ICourseEnrollmentCreate): Promise<CourseEnrollment> => {
    try {
        // Check if student is already enrolled in the course
        const existingEnrollment = await CourseEnrollmentModel.findFirst({
            where: {
                studentId: data.studentId,
                courseId: data.courseId,
            },
        });

        if (existingEnrollment) {
            throw new AppError(StatusCodes.CONFLICT, 'Student is already enrolled in this course');
        }

        return await CourseEnrollmentModel.create({
            data,
            include: {
                student: {
                    select: { id: true, name: true, email: true },
                },
                course: true,
            },
        }) as unknown as CourseEnrollment;
    } catch (error) {
        throw error;
    }
};

export const getCourseEnrollmentById = async (id: string): Promise<ICourseEnrollmentWithRelations | null> => {
    try {
        const enrollment = await CourseEnrollmentModel.findUnique({
            where: { id },
            include: {
                student: {
                    include: {
                        studentProfile: true,
                    },
                },
                course: {
                    include: {
                        teacher: {
                            select: { id: true, name: true, email: true },
                        },
                        batch: true,
                        department: true,
                        subject: true,
                    },
                },
            },
        });

        if (!enrollment) {
            throw new AppError(StatusCodes.NOT_FOUND, 'Course enrollment not found');
        }

        return enrollment as unknown as ICourseEnrollmentWithRelations;
    } catch (error) {
        throw error;
    }
};

export const removeStudentFromCourse = async (id: string): Promise<void> => {
    try {
        // Check if enrollment exists
        const existingEnrollment = await CourseEnrollmentModel.findUnique({
            where: { id },
        });

        if (!existingEnrollment) {
            throw new AppError(StatusCodes.NOT_FOUND, 'Course enrollment not found');
        }

        await CourseEnrollmentModel.delete({
            where: { id },
        });
    } catch (error) {
        throw error;
    }
};

export const getAllCourseEnrollments = async (filters: ICourseEnrollmentFilters = {}): Promise<CourseEnrollment[]> => {
    try {
        const { studentId, courseId } = filters;

        const where: any = {};

        if (studentId) where.studentId = studentId;
        if (courseId) where.courseId = courseId;

        return await CourseEnrollmentModel.findMany({
            where,
            include: {
                student: {
                    select: { id: true, name: true, email: true },
                },
                course: {
                    select: { id: true, title: true, code: true },
                },
            },
            orderBy: { enrolledAt: 'desc' },
        }) as unknown as CourseEnrollment[];
    } catch (error) {
        throw error;
    }
};

export const getCourseEnrollmentStats = async (): Promise<ICourseEnrollmentStats> => {
    try {
        const totalEnrollments = await CourseEnrollmentModel.count();

        const enrollmentsByCourse = await CourseEnrollmentModel.groupBy({
            by: ['courseId'],
            _count: true,
        });

        const enrollmentsByStudent = await CourseEnrollmentModel.groupBy({
            by: ['studentId'],
            _count: true,
        });

        return {
            totalEnrollments,
            enrollmentsByCourse: enrollmentsByCourse.reduce((acc: Record<string, number>, item: any) => {
                acc[item.courseId] = item._count;
                return acc;
            }, {}),
            enrollmentsByStudent: enrollmentsByStudent.reduce((acc: Record<string, number>, item: any) => {
                acc[item.studentId] = item._count;
                return acc;
            }, {}),
        };
    } catch (error) {
        throw error;
    }
};

// Class Schedule services
export const createClassSchedule = async (data: IClassScheduleCreate): Promise<ClassSchedule> => {
    try {
        return await ClassScheduleModel.create({
            data,
            include: {
                teacher: {
                    select: { id: true, name: true, email: true },
                },
                course: true,
                batch: true,
            },
        }) as unknown as ClassSchedule;
    } catch (error) {
        throw error;
    }
};

export const getClassScheduleById = async (id: string): Promise<IClassScheduleWithRelations | null> => {
    try {
        const schedule = await ClassScheduleModel.findUnique({
            where: { id },
            include: {
                teacher: {
                    select: { id: true, name: true, email: true },
                },
                course: {
                    include: {
                        batch: true,
                        department: true,
                        subject: true,
                    },
                },
                batch: true,
            },
        });

        if (!schedule) {
            throw new AppError(StatusCodes.NOT_FOUND, 'Class schedule not found');
        }

        return schedule as unknown as IClassScheduleWithRelations;
    } catch (error) {
        throw error;
    }
};

export const updateClassSchedule = async (id: string, data: IClassScheduleUpdate): Promise<ClassSchedule> => {
    try {
        // Check if schedule exists
        const existingSchedule = await ClassScheduleModel.findUnique({
            where: { id },
        });

        if (!existingSchedule) {
            throw new AppError(StatusCodes.NOT_FOUND, 'Class schedule not found');
        }

        return await ClassScheduleModel.update({
            where: { id },
            data,
            include: {
                teacher: {
                    select: { id: true, name: true, email: true },
                },
                course: true,
                batch: true,
            },
        }) as unknown as ClassSchedule;
    } catch (error) {
        throw error;
    }
};

export const deleteClassSchedule = async (id: string): Promise<void> => {
    try {
        // Check if schedule exists
        const existingSchedule = await ClassScheduleModel.findUnique({
            where: { id },
        });

        if (!existingSchedule) {
            throw new AppError(StatusCodes.NOT_FOUND, 'Class schedule not found');
        }

        await ClassScheduleModel.delete({
            where: { id },
        });
    } catch (error) {
        throw error;
    }
};

export const getAllClassSchedules = async (filters: IClassScheduleFilters = {}): Promise<ClassSchedule[]> => {
    try {
        const { teacherId, courseId, batchId, dayOfWeek, semester, isActive } = filters;

        const where: any = {};

        if (teacherId) where.teacherId = teacherId;
        if (courseId) where.courseId = courseId;
        if (batchId) where.batchId = batchId;
        if (dayOfWeek) where.dayOfWeek = dayOfWeek;
        if (semester) where.semester = semester;
        if (isActive !== undefined) where.isActive = isActive;

        return await ClassScheduleModel.findMany({
            where,
            include: {
                teacher: {
                    select: { id: true, name: true, email: true },
                },
                course: {
                    select: { id: true, title: true, code: true },
                },
                batch: {
                    select: { id: true, name: true },
                },
            },
            orderBy: [
                { dayOfWeek: 'asc' },
                { startTime: 'asc' },
            ],
        }) as unknown as ClassSchedule[];
    } catch (error) {
        throw error;
    }
};

export const getClassScheduleStats = async (): Promise<IClassScheduleStats> => {
    try {
        const totalSchedules = await ClassScheduleModel.count();
        const activeSchedules = await ClassScheduleModel.count({ where: { isActive: true } });
        const inactiveSchedules = await ClassScheduleModel.count({ where: { isActive: false } });

        const schedulesByDay = await ClassScheduleModel.groupBy({
            by: ['dayOfWeek'],
            _count: true,
        });

        const schedulesByTeacher = await ClassScheduleModel.groupBy({
            by: ['teacherId'],
            _count: true,
        });

        return {
            totalSchedules,
            activeSchedules,
            inactiveSchedules,
            schedulesByDay: schedulesByDay.reduce((acc: Record<number, number>, item: any) => {
                acc[item.dayOfWeek] = item._count;
                return acc;
            }, {}),
            schedulesByTeacher: schedulesByTeacher.reduce((acc: Record<string, number>, item: any) => {
                acc[item.teacherId] = item._count;
                return acc;
            }, {}),
        };
    } catch (error) {
        throw error;
    }
};

// Export all services
export const CourseService = {
    // Course services
    createCourse,
    getCourseById,
    updateCourse,
    deleteCourse,
    getAllCourses,
    getCourseStats,

    // Course enrollment services
    enrollStudentInCourse,
    getCourseEnrollmentById,
    removeStudentFromCourse,
    getAllCourseEnrollments,
    getCourseEnrollmentStats,

    // Class schedule services
    createClassSchedule,
    getClassScheduleById,
    updateClassSchedule,
    deleteClassSchedule,
    getAllClassSchedules,
    getClassScheduleStats,
};