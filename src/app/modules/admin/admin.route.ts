import { Router } from 'express';
import { AdminController } from './admin.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from '../auth/auth.validation';

const router = Router();

/**
 * @description administrative user login
 * @param {string} path - /api/admin/auth/login
 * @param {function} middleware - ['validateRequest(AuthValidation.userLoginValidationSchema)']
 * @param {function} controller - ['loginAdmin']
 * @returns {object} - router
 * @access public
 * @method POST
 */
router.post(
    '/auth/login',
    validateRequest(AuthValidation.userLoginValidationSchema),
    AdminController.loginAdmin
);

export const AdminRoutes = router;
