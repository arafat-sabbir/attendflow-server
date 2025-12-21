import { Router } from 'express';
import { AuthController } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';

const router = Router();

/**
 * @description register a new user
 * @param {string} path - /api/auth/register
 * @param {function} middleware - ['validateRequest(AuthValidation.userRegistrationValidationSchema)']
 * @param {function} controller - ['registerUser']
 * @returns {object} - router
 * @access public
 * @method POST
 */
router.post('/register', validateRequest(AuthValidation.userRegistrationValidationSchema), ...AuthController.registerUser);

/**
 * @description user login
 * @param {string} path - /api/auth/login
 * @param {function} middleware - ['validateRequest(AuthValidation.userLoginValidationSchema)']
 * @param {function} controller - ['loginUser']
 * @returns {object} - router
 * @access public
 * @method POST
 */
router.post('/login', validateRequest(AuthValidation.userLoginValidationSchema), ...AuthController.loginUser);

/**
 * @description forgot password
 * @param {string} path - /api/auth/forgot-password
 * @param {function} middleware - ['validateRequest(AuthValidation.forgotPasswordValidationSchema)']
 * @param {function} controller - ['forgotPassword']
 * @returns {object} - router
 * @access public
 * @method POST
 */
router.post('/forgot-password', validateRequest(AuthValidation.forgotPasswordValidationSchema), ...AuthController.forgotPassword);

/**
 * @description reset password
 * @param {string} path - /api/auth/reset-password
 * @param {function} middleware - ['validateRequest(AuthValidation.resetPasswordValidationSchema)']
 * @param {function} controller - ['resetPassword']
 * @returns {object} - router
 * @access public
 * @method POST
 */
router.post('/reset-password', validateRequest(AuthValidation.resetPasswordValidationSchema), ...AuthController.resetPassword);

/**
 * @description verify email
 * @param {string} path - /api/auth/verify-email
 * @param {function} middleware - ['validateRequest(AuthValidation.emailVerificationValidationSchema)']
 * @param {function} controller - ['verifyEmail']
 * @returns {object} - router
 * @access public
 * @method POST
 */
router.post('/verify-email', validateRequest(AuthValidation.emailVerificationValidationSchema), ...AuthController.verifyEmail);

/**
 * @description refresh access token
 * @param {string} path - /api/auth/refresh-token
 * @param {function} middleware - ['validateRequest(AuthValidation.refreshTokenValidationSchema)']
 * @param {function} controller - ['refreshToken']
 * @returns {object} - router
 * @access private
 * @method POST
 */
router.post('/refresh-token', validateRequest(AuthValidation.refreshTokenValidationSchema), ...AuthController.refreshToken);

/**
 * @description user logout
 * @param {string} path - /api/auth/logout
 * @param {function} middleware - ['validateRequest(AuthValidation.refreshTokenValidationSchema)']
 * @param {function} controller - ['logoutUser']
 * @returns {object} - router
 * @access private
 * @method POST
 */
router.post('/logout', validateRequest(AuthValidation.refreshTokenValidationSchema), ...AuthController.logoutUser);

/**
 * @description change password
 * @param {string} path - /api/auth/change-password
 * @param {function} middleware - ['validateRequest(AuthValidation.changePasswordValidationSchema)']
 * @param {function} controller - ['changePassword']
 * @returns {object} - router
 * @access private
 * @method POST
 */
router.post('/change-password', validateRequest(AuthValidation.changePasswordValidationSchema), ...AuthController.changePassword);

/**
 * @description get user profile
 * @param {string} path - /api/auth/profile
 * @param {function} middleware - ['isAllowed']
 * @param {function} controller - ['getProfile']
 * @returns {object} - router
 * @access private
 * @method GET
 */
router.get('/profile', ...AuthController.getProfile);

/**
 * @description update user profile
 * @param {string} path - /api/auth/profile
 * @param {function} middleware - ['validateRequest(AuthValidation.updateProfileValidationSchema)']
 * @param {function} controller - ['updateProfile']
 * @returns {object} - router
 * @access private
 * @method PATCH
 */
router.patch('/profile', validateRequest(AuthValidation.updateProfileValidationSchema), ...AuthController.updateProfile);

export const AuthRoute = router;