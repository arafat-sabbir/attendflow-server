import { z } from 'zod';

// Create QR token validation schema
export const createQRTokenValidationSchema = z.object({
    body: z.object({
        courseId: z.string().min(1, {
            message: 'Course ID is required',
        }),
        teacherId: z.string().min(1, {
            message: 'Teacher ID is required',
        }),
        validFrom: z.string().datetime().optional(),
        validUntil: z.string().datetime().optional(),
        maxUses: z.number().min(1).max(1000).optional(),
        location: z.string().max(255).optional(),
        description: z.string().max(500).optional(),
    }).refine((data) => {
        // Custom validation for date range
        if (data.validFrom && data.validUntil) {
            const from = new Date(data.validFrom);
            const until = new Date(data.validUntil);
            if (until <= from) {
                return false;
            }
        }
        return true;
    }, {
        message: 'validUntil must be after validFrom',
        path: ['validUntil'],
    }).refine((data) => {
        // Custom validation to ensure dates are not too far in the future
        if (data.validUntil) {
            const until = new Date(data.validUntil);
            const maxDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
            if (until > maxDate) {
                return false;
            }
        }
        return true;
    }, {
        message: 'validUntil cannot be more than 24 hours from now',
        path: ['validUntil'],
    }),
});

// Validate QR token validation schema
export const validateQRTokenValidationSchema = z.object({
    body: z.object({
        token: z.string().min(1, {
            message: 'QR token is required',
        }),
        userId: z.string().min(1, {
            message: 'User ID is required',
        }),
        location: z.string().optional(),
        ipAddress: z.string().optional(),
        userAgent: z.string().optional(),
    }),
});

// Update QR token status validation schema
export const updateQRTokenStatusValidationSchema = z.object({
    params: z.object({
        id: z.string().min(1, {
            message: 'Token ID is required',
        }),
    }),
    body: z.object({
        status: z.enum(['ACTIVE', 'EXPIRED', 'USED']).refine((val) => val !== undefined, {
            message: 'Status is required',
        }),
    }),
});

// Get QR tokens query validation schema
export const getQRTokensQueryValidationSchema = z.object({
    query: z.object({
        courseId: z.string().optional(),
        teacherId: z.string().optional(),
        status: z.enum(['ACTIVE', 'EXPIRED', 'USED']).optional(),
        isActive: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional(),
        page: z.string().regex(/^\d+$/).transform(Number).optional(),
        limit: z.string().regex(/^\d+$/).transform(Number).optional(),
        sortBy: z.string().optional(),
        sortOrder: z.enum(['asc', 'desc']).optional(),
    }),
});

// Get QR check-ins query validation schema
export const getQRCheckInsQueryValidationSchema = z.object({
    query: z.object({
        tokenId: z.string().optional(),
        userId: z.string().optional(),
        studentId: z.string().optional(),
        courseId: z.string().optional(),
        isValid: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional(),
        page: z.string().regex(/^\d+$/).transform(Number).optional(),
        limit: z.string().regex(/^\d+$/).transform(Number).optional(),
        sortBy: z.string().optional(),
        sortOrder: z.enum(['asc', 'desc']).optional(),
    }),
});

// Get QR statistics query validation schema
export const getQRStatisticsQueryValidationSchema = z.object({
    query: z.object({
        courseId: z.string().optional(),
        teacherId: z.string().optional(),
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional(),
    }),
});

// Parameter validation schemas for route parameters
export const paramsWithIdSchema = z.object({
    params: z.object({
        id: z.string().min(1, {
            message: 'ID is required',
        }),
    }),
});
