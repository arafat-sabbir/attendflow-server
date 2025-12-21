import { Router } from 'express';
import DashboardController from './dashboard.controller';

const router = Router();

/**
 * @description get dashboard overview data
 * @param {string} path - /api/dashboard/overview
 * @param {function} middleware - []
 * @param {function} controller - ['getDashboardOverview']
 * @returns {object} - router
 * @access private
 * @method GET
 */
router.get('/overview', ...DashboardController.getDashboardOverview);
/**
 * @description get class level statistics
 * @param {string} path - /api/dashboard/stats/class-level
 * @param {function} middleware - []
 * @param {function} controller - ['getClassLevelStats']
 * @returns {object} - router
 * @access private
 * @method GET
 */
router.get('/stats/class-level', ...DashboardController.getClassLevelStats);
/**
 * @description get subject level statistics
 * @param {string} path - /api/dashboard/stats/subject-level
 * @param {function} middleware - []
 * @param {function} controller - ['getSubjectLevelStats']
 * @returns {object} - router
 * @access private
 * @method GET
 */
router.get('/stats/subject-level', ...DashboardController.getSubjectLevelStats);
/**
 * @description get teacher performance data
 * @param {string} path - /api/dashboard/stats/teacher-performance
 * @param {function} middleware - []
 * @param {function} controller - ['getTeacherPerformanceData']
 * @returns {object} - router
 * @access private
 * @method GET
 */
router.get('/stats/teacher-performance', ...DashboardController.getTeacherPerformanceData);
/**
 * @description get low attendance alerts
 * @param {string} path - /api/dashboard/alerts
 * @param {function} middleware - []
 * @param {function} controller - ['getLowAttendanceAlerts']
 * @returns {object} - router
 * @access private
 * @method GET
 */
router.get('/alerts', ...DashboardController.getLowAttendanceAlerts);
/**
 * @description get attendance report
 * @param {string} path - /api/dashboard/attendance-report
 * @param {function} middleware - []
 * @param {function} controller - ['getAttendanceReport']
 * @returns {object} - router
 * @access private
 * @method GET
 */
router.get('/attendance-report', ...DashboardController.getAttendanceReport);

export const DashboardRoutes = router;
export default DashboardRoutes;
