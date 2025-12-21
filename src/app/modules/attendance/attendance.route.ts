import { Router } from "express";
import { attendanceControllers } from "./attendance.controller";
import validateRequest from "../../middlewares/validateRequest";
import { attendanceValidation } from "./attendance.validation";
import AuthorizeRequest from "../../middlewares/auth";

const router = Router();

/**
 * @description record attendance for a student
 * @param {string} path - /api/attendance
 * @param {function} middleware - ['AuthorizeRequest(TEACHER, ADMIN, SUPER_ADMIN)', 'validateRequest(attendanceValidation.createAttendanceSchema)']
 * @param {function} controller - ['recordAttendance']
 * @returns {object} - router
 * @access private - ['TEACHER', 'ADMIN', 'SUPER_ADMIN']
 * @method POST
 */
router.post(
    "/",
    AuthorizeRequest('TEACHER', 'ADMIN', 'SUPER_ADMIN'),
    validateRequest(attendanceValidation.createAttendanceSchema),
    attendanceControllers.recordAttendance
);

/**
 * @description update attendance record
 * @param {string} path - /api/attendance/:id
 * @param {function} middleware - ['AuthorizeRequest(TEACHER, ADMIN, SUPER_ADMIN)', 'validateRequest(attendanceValidation.idParamSchema)', 'validateRequest(attendanceValidation.updateAttendanceSchema)']
 * @param {function} controller - ['updateAttendance']
 * @returns {object} - router
 * @access private - ['TEACHER', 'ADMIN', 'SUPER_ADMIN']
 * @method PATCH
 */
router.patch(
    "/:id",
    AuthorizeRequest('TEACHER', 'ADMIN', 'SUPER_ADMIN'),
    validateRequest(attendanceValidation.idParamSchema),
    validateRequest(attendanceValidation.updateAttendanceSchema),
    attendanceControllers.updateAttendance
);

/**
 * @description get attendance by ID
 * @param {string} path - /api/attendance/:id
 * @param {function} middleware - ['validateRequest(attendanceValidation.idParamSchema)']
 * @param {function} controller - ['getAttendanceById']
 * @returns {object} - router
 * @access private
 * @method GET
 */
router.get(
    "/:id",
    validateRequest(attendanceValidation.idParamSchema),
    attendanceControllers.getAttendanceById
);

/**
 * @description get attendance records with filters
 * @param {string} path - /api/attendance
 * @param {function} middleware - ['validateRequest(attendanceValidation.attendanceFiltersSchema)']
 * @param {function} controller - ['getAttendances']
 * @returns {object} - router
 * @access private
 * @method GET
 */
router.get(
    "/",
    validateRequest(attendanceValidation.attendanceFiltersSchema),
    attendanceControllers.getAttendances
);

/**
 * @description bulk mark attendance for multiple students
 * @param {string} path - /api/attendance/bulk-mark
 * @param {function} middleware - ['AuthorizeRequest(TEACHER, ADMIN, SUPER_ADMIN)', 'validateRequest(attendanceValidation.bulkAttendanceSchema)']
 * @param {function} controller - ['bulkMarkAttendance']
 * @returns {object} - router
 * @access private - ['TEACHER', 'ADMIN', 'SUPER_ADMIN']
 * @method POST
 */
router.post(
    "/bulk-mark",
    AuthorizeRequest('TEACHER', 'ADMIN', 'SUPER_ADMIN'),
    validateRequest(attendanceValidation.bulkAttendanceSchema),
    attendanceControllers.bulkMarkAttendance
);

/**
 * @description get attendance summary for a course
 * @param {string} path - /api/attendance/course/:id/summary
 * @param {function} middleware - ['validateRequest(attendanceValidation.idParamSchema)']
 * @param {function} controller - ['getCourseAttendanceSummary']
 * @returns {object} - router
 * @access private
 * @method GET
 */
router.get(
    "/course/:id/summary",
    validateRequest(attendanceValidation.idParamSchema),
    attendanceControllers.getCourseAttendanceSummary
);

/**
 * @description get attendance summary for a student
 * @param {string} path - /api/attendance/student/:userId/summary
 * @param {function} middleware - ['validateRequest(attendanceValidation.idParamSchema)']
 * @param {function} controller - ['getStudentAttendanceSummary']
 * @returns {object} - router
 * @access private
 * @method GET
 */
router.get(
    "/student/:userId/summary",
    validateRequest(attendanceValidation.idParamSchema),
    attendanceControllers.getStudentAttendanceSummary
);

/**
 * @description create QR code for attendance check-in
 * @param {string} path - /api/attendance/qr-code
 * @param {function} middleware - ['AuthorizeRequest(TEACHER, ADMIN, SUPER_ADMIN)', 'validateRequest(attendanceValidation.createQRCodeSchema)']
 * @param {function} controller - ['createQRCode']
 * @returns {object} - router
 * @access private - ['TEACHER', 'ADMIN', 'SUPER_ADMIN']
 * @method POST
 */
router.post(
    "/qr-code",
    AuthorizeRequest('TEACHER', 'ADMIN', 'SUPER_ADMIN'),
    validateRequest(attendanceValidation.createQRCodeSchema),
    attendanceControllers.createQRCode
);

/**
 * @description process QR code check-in
 * @param {string} path - /api/attendance/qr-checkin
 * @param {function} middleware - ['validateRequest(attendanceValidation.qrCodeCheckInSchema)']
 * @param {function} controller - ['processQRCodeCheckIn']
 * @returns {object} - router
 * @access private
 * @method POST
 */
router.post(
    "/qr-checkin",
    validateRequest(attendanceValidation.qrCodeCheckInSchema),
    attendanceControllers.processQRCodeCheckIn
);

/**
 * @description create attendance session
 * @param {string} path - /api/attendance/session
 * @param {function} middleware - ['AuthorizeRequest(TEACHER, ADMIN, SUPER_ADMIN)', 'validateRequest(attendanceValidation.createAttendanceSessionSchema)']
 * @param {function} controller - ['createAttendanceSession']
 * @returns {object} - router
 * @access private - ['TEACHER', 'ADMIN', 'SUPER_ADMIN']
 * @method POST
 */
router.post(
    "/session",
    AuthorizeRequest('TEACHER', 'ADMIN', 'SUPER_ADMIN'),
    validateRequest(attendanceValidation.createAttendanceSessionSchema),
    attendanceControllers.createAttendanceSession
);

/**
 * @description get attendance dashboard data
 * @param {string} path - /api/attendance/dashboard
 * @param {function} middleware - ['AuthorizeRequest(TEACHER, ADMIN, SUPER_ADMIN)']
 * @param {function} controller - ['getAttendanceDashboard']
 * @returns {object} - router
 * @access private - ['TEACHER', 'ADMIN', 'SUPER_ADMIN']
 * @method GET
 */
router.get(
    "/dashboard",
    AuthorizeRequest('TEACHER', 'ADMIN', 'SUPER_ADMIN'),
    attendanceControllers.getAttendanceDashboard
);

export const attendanceRoutes = router;