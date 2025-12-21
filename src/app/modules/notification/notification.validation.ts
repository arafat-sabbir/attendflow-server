import { z } from 'zod';

// Notification type validation
const notificationTypeSchema = z.enum(['IN_APP', 'EMAIL', 'BOTH']);

// Email status validation
const emailStatusSchema = z.enum(['PENDING', 'SENT', 'FAILED']);

// Priority validation
const prioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH']);

// Send notification validation
export const sendNotificationValidationSchema = z.object({
    body: z.object({
        recipientId: z.string().min(1, 'Recipient ID is required'),
        title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
        message: z.string().min(1, 'Message is required').max(2000, 'Message must be less than 2000 characters'),
        type: notificationTypeSchema.optional().default('IN_APP'),
        priority: prioritySchema.optional().default('MEDIUM'),
        scheduledAt: z.coerce.date().optional(),
    }),
});

// Email notification validation
export const emailNotificationValidationSchema = z.object({
    body: z.object({
        recipientId: z.string().min(1, 'Recipient ID is required'),
        title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
        message: z.string().min(1, 'Message is required').max(2000, 'Message must be less than 2000 characters'),
        type: z.enum(['EMAIL', 'BOTH']),
        priority: prioritySchema.optional().default('MEDIUM'),
        scheduledAt: z.coerce.date().optional(),
        emailOptions: z.object({
            to: z.array(z.string().email('Invalid email address')).optional(),
            cc: z.array(z.string().email('Invalid email address')).optional(),
            bcc: z.array(z.string().email('Invalid email address')).optional(),
            attachments: z.array(z.object({
                filename: z.string().min(1, 'Filename is required'),
                path: z.string().min(1, 'Path is required'),
                contentType: z.string().optional(),
            })).optional(),
        }).optional(),
    }),
});

// Bulk notification validation
export const bulkNotificationValidationSchema = z.object({
    body: z.object({
        recipientIds: z.array(z.string().min(1, 'Recipient ID cannot be empty')).min(1, 'At least one recipient is required'),
        title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
        message: z.string().min(1, 'Message is required').max(2000, 'Message must be less than 2000 characters'),
        type: notificationTypeSchema.optional().default('IN_APP'),
        priority: prioritySchema.optional().default('MEDIUM'),
        scheduledAt: z.coerce.date().optional(),
    }),
});

// Broadcast notification validation (by role)
export const broadcastNotificationValidationSchema = z.object({
    body: z.object({
        role: z.enum(['ADMIN', 'TEACHER', 'STUDENT', 'ALL']),
        title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
        message: z.string().min(1, 'Message is required').max(2000, 'Message must be less than 2000 characters'),
        type: notificationTypeSchema.optional().default('IN_APP'),
        priority: prioritySchema.optional().default('MEDIUM'),
    }),
});

// Update notification validation
export const updateNotificationValidationSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Notification ID is required'),
    }),
    body: z.object({
        title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters').optional(),
        message: z.string().min(1, 'Message is required').max(2000, 'Message must be less than 2000 characters').optional(),
        type: notificationTypeSchema.optional(),
        readStatus: z.boolean().optional(),
        emailStatus: emailStatusSchema.optional(),
    }),
});

// Mark as read/unread validation
export const markNotificationValidationSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Notification ID is required'),
    }),
    body: z.object({
        readStatus: z.boolean(),
    }),
});

// Get notifications validation
export const getNotificationsValidationSchema = z.object({
    query: z.object({
        page: z.coerce.number().int().positive().optional().default(1),
        limit: z.coerce.number().int().positive().max(100).optional().default(20),
        sortBy: z.enum(['createdAt', 'updatedAt', 'title']).optional().default('createdAt'),
        sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
        type: notificationTypeSchema.optional(),
        readStatus: z.coerce.boolean().optional(),
        emailStatus: emailStatusSchema.optional(),
        recipientId: z.string().optional(),
        search: z.string().optional(),
        startDate: z.coerce.date().optional(),
        endDate: z.coerce.date().optional(),
    }).refine(
        (data) => {
            if (data.startDate && data.endDate) {
                return data.startDate <= data.endDate;
            }
            return true;
        },
        {
            message: 'Start date must be before or equal to end date',
            path: ['endDate'],
        }
    ),
});

// Get single notification validation
export const getSingleNotificationValidationSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Notification ID is required'),
    }),
});

// Delete notification validation
export const deleteNotificationValidationSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Notification ID is required'),
    }),
});

// Resend failed email validation
export const resendEmailValidationSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Notification ID is required'),
    }),
});

// Get notification statistics validation
export const getNotificationStatsValidationSchema = z.object({
    query: z.object({
        recipientId: z.string().optional(),
        startDate: z.coerce.date().optional(),
        endDate: z.coerce.date().optional(),
    }).refine(
        (data) => {
            if (data.startDate && data.endDate) {
                return data.startDate <= data.endDate;
            }
            return true;
        },
        {
            message: 'Start date must be before or equal to end date',
            path: ['endDate'],
        }
    ),
});

// Recipient ID parameter validation
export const recipientIdParamValidationSchema = z.object({
    params: z.object({
        recipientId: z.string().min(1, 'Recipient ID is required'),
    }),
});

// Export all validation schemas
export const notificationValidations = {
    sendNotification: sendNotificationValidationSchema,
    emailNotification: emailNotificationValidationSchema,
    bulkNotification: bulkNotificationValidationSchema,
    broadcastNotification: broadcastNotificationValidationSchema,
    updateNotification: updateNotificationValidationSchema,
    markNotification: markNotificationValidationSchema,
    getNotifications: getNotificationsValidationSchema,
    getSingleNotification: getSingleNotificationValidationSchema,
    deleteNotification: deleteNotificationValidationSchema,
    resendEmail: resendEmailValidationSchema,
    getNotificationStats: getNotificationStatsValidationSchema,
    recipientIdParam: recipientIdParamValidationSchema,
};