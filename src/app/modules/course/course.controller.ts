import { Request, Response } from 'express';
import { CourseService } from './course.service';
import { CourseValidation } from './course.validation';
import { ICourseResponse } from './course.interface';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { StatusCodes } from 'http-status-codes';

// Course controllers
export const createCourse = catchAsync(async (req: Request, res: Response) => {
    const validatedData = CourseValidation.createCourse.parse(req.body);
    const result = await CourseService.createCourse(validatedData);

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        message: 'Course created successfully',
        data: result,
    });
});

export const getCourseById = catchAsync(async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const result = await CourseService.getCourseById(courseId);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: 'Course retrieved successfully',
        data: result,
    });
});

export const updateCourse = catchAsync(async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const validatedData = CourseValidation.updateCourse.parse(req.body);
    const result = await CourseService.updateCourse(courseId, validatedData);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: 'Course updated successfully',
        data: result,
    });
});

export const deleteCourse = catchAsync(async (req: Request, res: Response) => {
    const { courseId } = req.params;
    await CourseService.deleteCourse(courseId);

    sendResponse(res, {
        statusCode: StatusCodes.NO_CONTENT,
        message: 'Course deleted successfully',
        data: null,
    });
});

export const getAllCourses = catchAsync(async (req: Request, res: Response) => {
    const filters = CourseValidation.courseFilters.parse(req.query);
    const result = await CourseService.getAllCourses(filters);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: 'Courses retrieved successfully',
        data: result,
    });
});

export const getCourseStats = catchAsync(async (req: Request, res: Response) => {
    const result = await CourseService.getCourseStats();

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: 'Course statistics retrieved successfully',
        data: result,
    });
});

// Course Enrollment controllers
export const enrollStudentInCourse = catchAsync(async (req: Request, res: Response) => {
    const validatedData = CourseValidation.createCourseEnrollment.parse(req.body);
    const result = await CourseService.enrollStudentInCourse(validatedData);

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        message: 'Student enrolled in course successfully',
        data: result,
    });
});

export const getCourseEnrollmentById = catchAsync(async (req: Request, res: Response) => {
    const { enrollmentId } = req.params;
    const result = await CourseService.getCourseEnrollmentById(enrollmentId);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: 'Course enrollment retrieved successfully',
        data: result,
    });
});

export const removeStudentFromCourse = catchAsync(async (req: Request, res: Response) => {
    const { enrollmentId } = req.params;
    await CourseService.removeStudentFromCourse(enrollmentId);

    sendResponse(res, {
        statusCode: StatusCodes.NO_CONTENT,
        message: 'Student removed from course successfully',
        data: null,
    });
});

export const getAllCourseEnrollments = catchAsync(async (req: Request, res: Response) => {
    const filters = CourseValidation.courseEnrollmentFilters.parse(req.query);
    const result = await CourseService.getAllCourseEnrollments(filters);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: 'Course enrollments retrieved successfully',
        data: result,
    });
});

export const getCourseEnrollmentStats = catchAsync(async (req: Request, res: Response) => {
    const result = await CourseService.getCourseEnrollmentStats();

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: 'Course enrollment statistics retrieved successfully',
        data: result,
    });
});

// Class Schedule controllers
export const createClassSchedule = catchAsync(async (req: Request, res: Response) => {
    const validatedData = CourseValidation.createClassSchedule.parse(req.body);
    const result = await CourseService.createClassSchedule(validatedData);

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        message: 'Class schedule created successfully',
        data: result,
    });
});

export const getClassScheduleById = catchAsync(async (req: Request, res: Response) => {
    const { scheduleId } = req.params;
    const result = await CourseService.getClassScheduleById(scheduleId);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: 'Class schedule retrieved successfully',
        data: result,
    });
});

export const updateClassSchedule = catchAsync(async (req: Request, res: Response) => {
    const { scheduleId } = req.params;
    const validatedData = CourseValidation.updateClassSchedule.parse(req.body);
    const result = await CourseService.updateClassSchedule(scheduleId, validatedData);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: 'Class schedule updated successfully',
        data: result,
    });
});

export const deleteClassSchedule = catchAsync(async (req: Request, res: Response) => {
    const { scheduleId } = req.params;
    await CourseService.deleteClassSchedule(scheduleId);

    sendResponse(res, {
        statusCode: StatusCodes.NO_CONTENT,
        message: 'Class schedule deleted successfully',
        data: null,
    });
});

export const getAllClassSchedules = catchAsync(async (req: Request, res: Response) => {
    const filters = CourseValidation.classScheduleFilters.parse(req.query);
    const result = await CourseService.getAllClassSchedules(filters);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: 'Class schedules retrieved successfully',
        data: result,
    });
});

export const getClassScheduleStats = catchAsync(async (req: Request, res: Response) => {
    const result = await CourseService.getClassScheduleStats();

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: 'Class schedule statistics retrieved successfully',
        data: result,
    });
});

// Export all controllers
export const CourseController = {
    // Course controllers
    createCourse,
    getCourseById,
    updateCourse,
    deleteCourse,
    getAllCourses,
    getCourseStats,

    // Course enrollment controllers
    enrollStudentInCourse,
    getCourseEnrollmentById,
    removeStudentFromCourse,
    getAllCourseEnrollments,
    getCourseEnrollmentStats,

    // Class schedule controllers
    createClassSchedule,
    getClassScheduleById,
    updateClassSchedule,
    deleteClassSchedule,
    getAllClassSchedules,
    getClassScheduleStats,
};