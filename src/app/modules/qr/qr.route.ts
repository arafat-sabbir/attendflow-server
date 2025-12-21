import { Router } from 'express';
import { QRController } from './qr.controller';
import validateRequest from '../../middlewares/validateRequest';
import AuthorizeRequest from '../../middlewares/auth';
import {
    createQRTokenValidationSchema,
    validateQRTokenValidationSchema,
    updateQRTokenStatusValidationSchema,
    getQRTokensQueryValidationSchema,
    getQRCheckInsQueryValidationSchema,
    getQRStatisticsQueryValidationSchema,
    paramsWithIdSchema,
} from './qr.validation';

const router = Router();

/**
 * @description generate a new QR token for attendance
 * @param {string} path - /api/qr/generate
 * @param {function} middleware - ['AuthorizeRequest(TEACHER, ADMIN)', 'validateRequest(createQRTokenValidationSchema)']
 * @param {function} controller - ['generateQRToken']
 * @returns {object} - router
 * @access private - ['TEACHER', 'ADMIN']
 * @method POST
 */
router.post(
    '/generate',
    AuthorizeRequest('TEACHER', 'ADMIN'),
    validateRequest(createQRTokenValidationSchema),
    QRController.generateQRToken
);

/**
 * @description validate QR token for check-in
 * @param {string} path - /api/qr/validate
 * @param {function} middleware - ['AuthorizeRequest(STUDENT, TEACHER, ADMIN)', 'validateRequest(validateQRTokenValidationSchema)']
 * @param {function} controller - ['validateQRToken']
 * @returns {object} - router
 * @access private
 * @method POST
 */
router.post(
    '/validate',
    AuthorizeRequest('STUDENT', 'TEACHER', 'ADMIN'),
    validateRequest(validateQRTokenValidationSchema),
    QRController.validateQRToken
);

/**
 * @description get all QR tokens with filtering
 * @param {string} path - /api/qr/
 * @param {function} middleware - ['AuthorizeRequest(TEACHER, ADMIN)', 'validateRequest(getQRTokensQueryValidationSchema)']
 * @param {function} controller - ['getQRTokens']
 * @returns {object} - router
 * @access private - ['TEACHER', 'ADMIN']
 * @method GET
 */
router.get(
    '/',
    AuthorizeRequest('TEACHER', 'ADMIN'),
    validateRequest(getQRTokensQueryValidationSchema),
    QRController.getQRTokens
);

/**
 * @description get QR check-ins with filtering
 * @param {string} path - /api/qr/check-ins
 * @param {function} middleware - ['AuthorizeRequest(TEACHER, ADMIN)', 'validateRequest(getQRCheckInsQueryValidationSchema)']
 * @param {function} controller - ['getQRCheckIns']
 * @returns {object} - router
 * @access private - ['TEACHER', 'ADMIN']
 * @method GET
 */
router.get(
    '/check-ins',
    AuthorizeRequest('TEACHER', 'ADMIN'),
    validateRequest(getQRCheckInsQueryValidationSchema),
    QRController.getQRCheckIns
);

/**
 * @description update QR token status
 * @param {string} path - /api/qr/:id/status
 * @param {function} middleware - ['AuthorizeRequest(TEACHER, ADMIN)', 'validateRequest(paramsWithIdSchema)', 'validateRequest(updateQRTokenStatusValidationSchema)']
 * @param {function} controller - ['updateQRTokenStatus']
 * @returns {object} - router
 * @access private - ['TEACHER', 'ADMIN']
 * @method PATCH
 */
router.patch(
    '/:id/status',
    AuthorizeRequest('TEACHER', 'ADMIN'),
    validateRequest(paramsWithIdSchema),
    validateRequest(updateQRTokenStatusValidationSchema),
    QRController.updateQRTokenStatus
);

/**
 * @description manually expire QR tokens
 * @param {string} path - /api/qr/expire
 * @param {function} middleware - ['AuthorizeRequest(TEACHER, ADMIN)']
 * @param {function} controller - ['expireQRTokens']
 * @returns {object} - router
 * @access private - ['TEACHER', 'ADMIN']
 * @method POST
 */
router.post(
    '/expire',
    AuthorizeRequest('TEACHER', 'ADMIN'),
    QRController.expireQRTokens
);

/**
 * @description get QR usage statistics
 * @param {string} path - /api/qr/statistics
 * @param {function} middleware - ['AuthorizeRequest(TEACHER, ADMIN)', 'validateRequest(getQRStatisticsQueryValidationSchema)']
 * @param {function} controller - ['getQRStatistics']
 * @returns {object} - router
 * @access private - ['TEACHER', 'ADMIN']
 * @method GET
 */
router.get(
    '/statistics',
    AuthorizeRequest('TEACHER', 'ADMIN'),
    validateRequest(getQRStatisticsQueryValidationSchema),
    QRController.getQRStatistics
);

/**
 * @description get QR token by ID
 * @param {string} path - /api/qr/:id
 * @param {function} middleware - ['AuthorizeRequest(TEACHER, ADMIN)', 'validateRequest(paramsWithIdSchema)']
 * @param {function} controller - ['getQRTokenById']
 * @returns {object} - router
 * @access private - ['TEACHER', 'ADMIN']
 * @method GET
 */
router.get(
    '/:id',
    AuthorizeRequest('TEACHER', 'ADMIN'),
    validateRequest(paramsWithIdSchema),
    QRController.getQRTokenById
);

/**
 * @description get QR check-in record by ID
 * @param {string} path - /api/qr/check-ins/:id
 * @param {function} middleware - ['AuthorizeRequest(TEACHER, ADMIN)', 'validateRequest(paramsWithIdSchema)']
 * @param {function} controller - ['getQRCheckInById']
 * @returns {object} - router
 * @access private - ['TEACHER', 'ADMIN']
 * @method GET
 */
router.get(
    '/check-ins/:id',
    AuthorizeRequest('TEACHER', 'ADMIN'),
    validateRequest(paramsWithIdSchema),
    QRController.getQRCheckInById
);

/**
 * @description delete QR token
 * @param {string} path - /api/qr/:id
 * @param {function} middleware - ['AuthorizeRequest(ADMIN)', 'validateRequest(paramsWithIdSchema)']
 * @param {function} controller - ['deleteQRToken']
 * @returns {object} - router
 * @access private - ['ADMIN']
 * @method DELETE
 */
router.delete(
    '/:id',
    AuthorizeRequest('ADMIN'),
    validateRequest(paramsWithIdSchema),
    QRController.deleteQRToken
);

/**
 * @description delete QR check-in record
 * @param {string} path - /api/qr/check-ins/:id
 * @param {function} middleware - ['AuthorizeRequest(ADMIN)', 'validateRequest(paramsWithIdSchema)']
 * @param {function} controller - ['deleteQRCheckIn']
 * @returns {object} - router
 * @access private - ['ADMIN']
 * @method DELETE
 */
router.delete(
    '/check-ins/:id',
    AuthorizeRequest('ADMIN'),
    validateRequest(paramsWithIdSchema),
    QRController.deleteQRCheckIn
);

export const QRRoute = router;