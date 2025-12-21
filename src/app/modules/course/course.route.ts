import { Router } from 'express';
import { CourseController } from './course.controller';
import { CourseValidation } from './course.validation';
import validateRequest from '../../middlewares/validateRequest';
import { AuthMiddleware } from '../../middlewares/auth';

const router = Router();

/**
 * @description create a new course
 * @param {string} path - /api/course/courses
 * @param {function} middleware - ['AuthMiddleware.isAdmin', 'validateRequest(CourseValidation.createCourse)']
 * @param {function} controller - ['createCourse']
 * @returns {object} - router
 * @access private - ['ADMIN']
 * @method POST
 */
router.post(
    '/courses',
    AuthMiddleware.isAdmin,
    validateRequest(CourseValidation.createCourse),
    CourseController.createCourse
);

/**
 * @description get all courses
 * @param {string} path - /api/course/courses
 * @param {function} middleware - ['AuthMiddleware.isTeacherOrAdmin', 'validateRequest(CourseValidation.courseFilters)']
 * @param {function} controller - ['getAllCourses']
 * @returns {object} - router
 * @access private - ['TEACHER', 'ADMIN']
 * @method GET
 */
router.get(
    '/courses',
    AuthMiddleware.isTeacherOrAdmin,
    validateRequest(CourseValidation.courseFilters),
    CourseController.getAllCourses
);

/**
 * @description get course statistics
 * @param {string} path - /api/course/courses/stats
 * @param {function} middleware - ['AuthMiddleware.isAdmin']
 * @param {function} controller - ['getCourseStats']
 * @returns {object} - router
 * @access private - ['ADMIN']
 * @method GET
 */
router.get(
    '/courses/stats',
    AuthMiddleware.isAdmin,
    CourseController.getCourseStats
);

/**
 * @description get course by ID
 * @param {string} path - /api/course/courses/:courseId
 * @param {function} middleware - ['AuthMiddleware.isTeacherOrAdmin', 'validateRequest(CourseValidation.courseIdParam)']
 * @param {function} controller - ['getCourseById']
 * @returns {object} - router
 * @access private - ['TEACHER', 'ADMIN']
 * @method GET
 */
router.get(
    '/courses/:courseId',
    AuthMiddleware.isTeacherOrAdmin,
    validateRequest(CourseValidation.courseIdParam),
    CourseController.getCourseById
);

/**
 * @description update course
 * @param {string} path - /api/course/courses/:courseId
 * @param {function} middleware - ['AuthMiddleware.isAdmin', 'validateRequest(CourseValidation.courseIdParam)', 'validateRequest(CourseValidation.updateCourse)']
 * @param {function} controller - ['updateCourse']
 * @returns {object} - router
 * @access private - ['ADMIN']
 * @method PATCH
 */
router.patch(
    '/courses/:courseId',
    AuthMiddleware.isAdmin,
    validateRequest(CourseValidation.courseIdParam),
    validateRequest(CourseValidation.updateCourse),
    CourseController.updateCourse
);

/**
 * @description delete course
 * @param {string} path - /api/course/courses/:courseId
 * @param {function} middleware - ['AuthMiddleware.isAdmin', 'validateRequest(CourseValidation.courseIdParam)']
 * @param {function} controller - ['deleteCourse']
 * @returns {object} - router
 * @access private - ['ADMIN']
 * @method DELETE
 */
router.delete(
    '/courses/:courseId',
    AuthMiddleware.isAdmin,
    validateRequest(CourseValidation.courseIdParam),
    CourseController.deleteCourse
);

/**
 * @description enroll student in course
 * @param {string} path - /api/course/enrollments
 * @param {function} middleware - ['AuthMiddleware.isAdmin', 'validateRequest(CourseValidation.createCourseEnrollment)']
 * @param {function} controller - ['enrollStudentInCourse']
 * @returns {object} - router
 * @access private - ['ADMIN']
 * @method POST
 */
router.post(
    '/enrollments',
    AuthMiddleware.isAdmin,
    validateRequest(CourseValidation.createCourseEnrollment),
    CourseController.enrollStudentInCourse
);

/**
 * @description get all course enrollments
 * @param {string} path - /api/course/enrollments
 * @param {function} middleware - ['AuthMiddleware.isTeacherOrAdmin', 'validateRequest(CourseValidation.courseEnrollmentFilters)']
 * @param {function} controller - ['getAllCourseEnrollments']
 * @returns {object} - router
 * @access private - ['TEACHER', 'ADMIN']
 * @method GET
 */
router.get(
    '/enrollments',
    AuthMiddleware.isTeacherOrAdmin,
    validateRequest(CourseValidation.courseEnrollmentFilters),
    CourseController.getAllCourseEnrollments
);

/**
 * @description get course enrollment stats
 * @param {string} path - /api/course/enrollments/stats
 * @param {function} middleware - ['AuthMiddleware.isAdmin']
 * @param {function} controller - ['getCourseEnrollmentStats']
 * @returns {object} - router
 * @access private - ['ADMIN']
 * @method GET
 */
router.get(
    '/enrollments/stats',
    AuthMiddleware.isAdmin,
    CourseController.getCourseEnrollmentStats
);

/**
 * @description get course enrollment by ID
 * @param {string} path - /api/course/enrollments/:enrollmentId
 * @param {function} middleware - ['AuthMiddleware.isTeacherOrAdmin', 'validateRequest(CourseValidation.enrollmentIdParam)']
 * @param {function} controller - ['getCourseEnrollmentById']
 * @returns {object} - router
 * @access private - ['TEACHER', 'ADMIN']
 * @method GET
 */
router.get(
    '/enrollments/:enrollmentId',
    AuthMiddleware.isTeacherOrAdmin,
    validateRequest(CourseValidation.enrollmentIdParam),
    CourseController.getCourseEnrollmentById
);

/**
 * @description remove student from course
 * @param {string} path - /api/course/enrollments/:enrollmentId
 * @param {function} middleware - ['AuthMiddleware.isAdmin', 'validateRequest(CourseValidation.enrollmentIdParam)']
 * @param {function} controller - ['removeStudentFromCourse']
 * @returns {object} - router
 * @access private - ['ADMIN']
 * @method DELETE
 */
router.delete(
    '/enrollments/:enrollmentId',
    AuthMiddleware.isAdmin,
    validateRequest(CourseValidation.enrollmentIdParam),
    CourseController.removeStudentFromCourse
);

/**
 * @description create class schedule
 * @param {string} path - /api/course/schedules
 * @param {function} middleware - ['AuthMiddleware.isAdmin', 'validateRequest(CourseValidation.createClassSchedule)']
 * @param {function} controller - ['createClassSchedule']
 * @returns {object} - router
 * @access private - ['ADMIN']
 * @method POST
 */
router.post(
    '/schedules',
    AuthMiddleware.isAdmin,
    validateRequest(CourseValidation.createClassSchedule),
    CourseController.createClassSchedule
);

/**
 * @description get all class schedules
 * @param {string} path - /api/course/schedules
 * @param {function} middleware - ['AuthMiddleware.isTeacherOrAdmin', 'validateRequest(CourseValidation.classScheduleFilters)']
 * @param {function} controller - ['getAllClassSchedules']
 * @returns {object} - router
 * @access private - ['TEACHER', 'ADMIN']
 * @method GET
 */
router.get(
    '/schedules',
    AuthMiddleware.isTeacherOrAdmin,
    validateRequest(CourseValidation.classScheduleFilters),
    CourseController.getAllClassSchedules
);

/**
 * @description get class schedule stats
 * @param {string} path - /api/course/schedules/stats
 * @param {function} middleware - ['AuthMiddleware.isAdmin']
 * @param {function} controller - ['getClassScheduleStats']
 * @returns {object} - router
 * @access private - ['ADMIN']
 * @method GET
 */
router.get(
    '/schedules/stats',
    AuthMiddleware.isAdmin,
    CourseController.getClassScheduleStats
);

/**
 * @description get class schedule by ID
 * @param {string} path - /api/course/schedules/:scheduleId
 * @param {function} middleware - ['AuthMiddleware.isTeacherOrAdmin', 'validateRequest(CourseValidation.scheduleIdParam)']
 * @param {function} controller - ['getClassScheduleById']
 * @returns {object} - router
 * @access private - ['TEACHER', 'ADMIN']
 * @method GET
 */
router.get(
    '/schedules/:scheduleId',
    AuthMiddleware.isTeacherOrAdmin,
    validateRequest(CourseValidation.scheduleIdParam),
    CourseController.getClassScheduleById
);

/**
 * @description update class schedule
 * @param {string} path - /api/course/schedules/:scheduleId
 * @param {function} middleware - ['AuthMiddleware.isAdmin', 'validateRequest(CourseValidation.scheduleIdParam)', 'validateRequest(CourseValidation.updateClassSchedule)']
 * @param {function} controller - ['updateClassSchedule']
 * @returns {object} - router
 * @access private - ['ADMIN']
 * @method PATCH
 */
router.patch(
    '/schedules/:scheduleId',
    AuthMiddleware.isAdmin,
    validateRequest(CourseValidation.scheduleIdParam),
    validateRequest(CourseValidation.updateClassSchedule),
    CourseController.updateClassSchedule
);

/**
 * @description delete class schedule
 * @param {string} path - /api/course/schedules/:scheduleId
 * @param {function} middleware - ['AuthMiddleware.isAdmin', 'validateRequest(CourseValidation.scheduleIdParam)']
 * @param {function} controller - ['deleteClassSchedule']
 * @returns {object} - router
 * @access private - ['ADMIN']
 * @method DELETE
 */
router.delete(
    '/schedules/:scheduleId',
    AuthMiddleware.isAdmin,
    validateRequest(CourseValidation.scheduleIdParam),
    CourseController.deleteClassSchedule
);

export const courseRoutes = router;