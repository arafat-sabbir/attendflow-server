import { QRController } from './qr.controller';
import { QRRoute } from './qr.route';
import { QRService } from './qr.service';
import QRTokenModel, { QRCheckInModel } from './qr.model';
import {
    IQRToken,
    IQRTokenCreate,
    IQRTokenUpdate,
    IQRTokenFilters,
    IQRCheckIn,
    IQRCheckInCreate,
    IQRCheckInFilters,
    IQRStatistics,
    QRCodeStatus,
    QRCodeStatusType,
} from './qr.interface';
import {
    createQRTokenValidationSchema,
    validateQRTokenValidationSchema,
    updateQRTokenStatusValidationSchema,
    getQRTokensQueryValidationSchema,
    getQRCheckInsQueryValidationSchema,
    getQRStatisticsQueryValidationSchema,
    paramsWithIdSchema,
} from './qr.validation';

export {
    QRController,
    QRRoute,
    QRService,
    QRTokenModel,
    QRCheckInModel,
    // Interfaces
    IQRToken,
    IQRTokenCreate,
    IQRTokenUpdate,
    IQRTokenFilters,
    IQRCheckIn,
    IQRCheckInCreate,
    IQRCheckInFilters,
    IQRStatistics,
    QRCodeStatus,
    QRCodeStatusType,
    // Validation schemas
    createQRTokenValidationSchema,
    validateQRTokenValidationSchema,
    updateQRTokenStatusValidationSchema,
    getQRTokensQueryValidationSchema,
    getQRCheckInsQueryValidationSchema,
    getQRStatisticsQueryValidationSchema,
    paramsWithIdSchema,
};