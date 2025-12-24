import { Router } from 'express';
import { AttendanceSessionController } from './attendanceSession.controller';
import { AuthMiddleware } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { attendanceValidation } from './attendance.validation';

const router = Router();

// Apply authentication middleware to all routes
router.use(AuthMiddleware.authenticate);

// POST /api/v1/attendance/sessions - Create attendance session
router.post('/sessions', validateRequest(attendanceValidation.createAttendanceSessionSchema), AttendanceSessionController.createAttendanceSession);

// GET /api/v1/attendance/sessions/active - Get active session
router.get('/sessions/active', AttendanceSessionController.getActiveSession);

// GET /api/v1/attendance/sessions/:sessionId/stats - Get session statistics for polling
router.get('/sessions/:sessionId/stats', AttendanceSessionController.getSessionStats);

// POST /api/v1/attendance/sessions/:id/end - End attendance session
router.post('/sessions/:id/end', AttendanceSessionController.endSession);

// GET /api/v1/attendance/sessions - Get attendance sessions with filters
router.get('/sessions', AttendanceSessionController.getAttendanceSessions);

// GET /api/v1/attendance/sessions/:id - Get attendance session by ID
router.get('/sessions/:id', AttendanceSessionController.getAttendanceSessionById);

export default router;
