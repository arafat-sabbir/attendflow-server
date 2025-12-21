import nodemailer from 'nodemailer';
import { NotificationModel } from './notification.model';
import {
    INotification,
    INotificationCreate,
    INotificationUpdate,
    INotificationResponse,
    INotificationListResponse,
    INotificationQueryOptions,
    INotificationStats,
    INotificationFilters,
    ISendNotificationPayload,
    IEmailNotificationPayload,
    IBulkNotificationPayload,
    IEmailConfig,
    NotificationType,
    EmailStatus
} from './notification.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import prisma from '../../config/prisma';
import config from '../../config';

// Create Nodemailer transporter
const createEmailTransporter = () => {
    const emailConfig: IEmailConfig = {
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: config.email_user || '',
            pass: config.email_pass || '',
        },
    };

    return nodemailer.createTransport(emailConfig);
};

// Send email using Nodemailer
const sendEmail = async (to: string, subject: string, html: string, options?: any) => {
    try {
        const transporter = createEmailTransporter();

        const mailOptions = {
            from: config.email_user || '',
            to,
            subject,
            html,
            ...options,
        };

        const result = await transporter.sendMail(mailOptions);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('Email sending failed:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};

// Create a new notification
const createNotification = async (data: INotificationCreate): Promise<INotificationResponse> => {
    // Check if recipient exists
    const recipient = await prisma.user.findUnique({
        where: { id: data.recipientId },
        select: { id: true, name: true, email: true, role: true },
    });

    if (!recipient) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Recipient not found');
    }

    // Create notification
    const notification = await NotificationModel.create({
        data: {
            recipientId: data.recipientId,
            title: data.title,
            message: data.message,
            type: data.type,
            readStatus: data.readStatus,
            emailStatus: data.type === 'EMAIL' || data.type === 'BOTH' ? 'PENDING' : null,
        },
    });

    // If it's an email notification, send it
    if (data.type === 'EMAIL' || data.type === 'BOTH') {
        const emailResult = await sendEmail(
            recipient.email,
            data.title,
            data.message
        );

        // Update email status
        await NotificationModel.update({
            where: { id: notification.id },
            data: {
                emailStatus: emailResult.success ? 'SENT' : 'FAILED',
            },
        });
    }

    // Get notification with recipient data
    const notificationWithRecipient = await NotificationModel.findUnique({
        where: { id: notification.id },
        include: {
            recipient: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
        },
    });

    return notificationWithRecipient as INotificationResponse;
};

// Send notification to a single user
const sendNotification = async (payload: ISendNotificationPayload): Promise<INotificationResponse> => {
    const notificationData: INotificationCreate = {
        recipientId: payload.recipientId,
        title: payload.title,
        message: payload.message,
        type: payload.type || 'IN_APP',
        readStatus: false,
        emailStatus: payload.type === 'EMAIL' || payload.type === 'BOTH' ? 'PENDING' : null,
    };

    return createNotification(notificationData);
};

// Send email notification
const sendEmailNotification = async (payload: IEmailNotificationPayload): Promise<INotificationResponse> => {
    const recipient = await prisma.user.findUnique({
        where: { id: payload.recipientId },
        select: { id: true, name: true, email: true, role: true },
    });

    if (!recipient) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Recipient not found');
    }

    // Create notification
    const notification = await NotificationModel.create({
        data: {
            recipientId: payload.recipientId,
            title: payload.title,
            message: payload.message,
            type: payload.type,
            readStatus: false,
            emailStatus: 'PENDING',
        },
    });

    // Prepare email options
    const emailOptions = {
        to: payload.emailOptions?.to || [recipient.email],
        cc: payload.emailOptions?.cc,
        bcc: payload.emailOptions?.bcc,
        attachments: payload.emailOptions?.attachments,
    };

    // Send email
    const emailResult = await sendEmail(
        recipient.email,
        payload.title,
        payload.message,
        emailOptions
    );

    // Update email status
    const updatedNotification = await NotificationModel.update({
        where: { id: notification.id },
        data: {
            emailStatus: emailResult.success ? 'SENT' : 'FAILED',
        },
        include: {
            recipient: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
        },
    });

    return updatedNotification as INotificationResponse;
};

// Send bulk notifications
const sendBulkNotifications = async (payload: IBulkNotificationPayload): Promise<INotificationResponse[]> => {
    const notifications: INotificationResponse[] = [];

    for (const recipientId of payload.recipientIds) {
        try {
            const notificationData: INotificationCreate = {
                recipientId,
                title: payload.title,
                message: payload.message,
                type: payload.type || 'IN_APP',
                readStatus: false,
                emailStatus: 'PENDING',
            };

            const notification = await createNotification(notificationData);
            notifications.push(notification);
        } catch (error) {
            console.error(`Failed to send notification to user ${recipientId}:`, error);
        }
    }

    return notifications;
};

// Broadcast notification to all users of a specific role
const broadcastNotification = async (payload: { role: string; title: string; message: string; type?: NotificationType; priority?: string }): Promise<INotificationResponse[]> => {
    let users;
    if (payload.role === 'ALL') {
        users = await prisma.user.findMany({ select: { id: true } });
    } else {
        users = await prisma.user.findMany({
            where: { role: payload.role as any },
            select: { id: true },
        });
    }

    const recipientIds = users.map(u => u.id);

    if (recipientIds.length === 0) {
        return [];
    }

    return sendBulkNotifications({
        recipientIds,
        title: payload.title,
        message: payload.message,
        type: payload.type,
        priority: payload.priority as any,
    });
};

// Get all notifications with query builder support
const getAllNotifications = async (query: INotificationQueryOptions): Promise<INotificationListResponse> => {
    const queryBuilder = new QueryBuilder(query as Record<string, unknown>);

    // Build where clause based on filters
    let whereClause: any = {};

    if (query.filters) {
        const { type, readStatus, emailStatus, recipientId, search, dateRange } = query.filters;

        if (type) whereClause.type = type;
        if (readStatus !== undefined) whereClause.readStatus = readStatus;
        if (emailStatus) whereClause.emailStatus = emailStatus;
        if (recipientId) whereClause.recipientId = recipientId;

        if (search) {
            whereClause.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { message: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (dateRange) {
            whereClause.createdAt = {
                gte: dateRange.start,
                lte: dateRange.end,
            };
        }
    }

    // Build query with search, filter, sort, pagination, and field selection
    queryBuilder.search(['title', 'message']).filter().sort().paginate();

    const queryOptions = queryBuilder.getQueryOptions();

    // Override where clause with our custom filters
    if (Object.keys(whereClause).length > 0) {
        queryOptions.where = { ...queryOptions.where, ...whereClause };
    }

    // Execute query
    const [notifications, total] = await Promise.all([
        NotificationModel.findMany({
            where: queryOptions.where,
            orderBy: queryOptions.orderBy,
            skip: queryOptions.skip,
            take: queryOptions.take,
            include: {
                recipient: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
        }),
        NotificationModel.count({ where: queryOptions.where }),
    ]);

    const meta = queryBuilder.getPaginationMeta(total);
    const page = query.page || 1;
    const limit = query.limit || 20;

    return {
        notifications: notifications.map(notification => ({
            id: notification.id,
            title: notification.title,
            message: notification.message,
            type: notification.type,
            createdAt: notification.createdAt,
            updatedAt: notification.updatedAt,
            readStatus: notification.readStatus,
            emailStatus: notification.emailStatus,
            recipientId: notification.recipientId,
            recipient: notification.recipient,
        })),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
    };
};

// Get a single notification by ID
const getNotificationById = async (id: string): Promise<INotificationResponse | null> => {
    const notification = await NotificationModel.findUnique({
        where: { id },
        include: {
            recipient: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
        },
    });

    return notification as INotificationResponse | null;
};

// Update a notification
const updateNotification = async (id: string, data: INotificationUpdate): Promise<INotificationResponse | null> => {
    // Check if notification exists
    const existingNotification = await NotificationModel.findUnique({
        where: { id },
    });

    if (!existingNotification) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Notification not found');
    }

    const updatedNotification = await NotificationModel.update({
        where: { id },
        data,
        include: {
            recipient: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
        },
    });

    return updatedNotification as INotificationResponse;
};

// Mark notification as read/unread
const markNotificationAsRead = async (id: string, readStatus: boolean): Promise<INotificationResponse | null> => {
    return updateNotification(id, { readStatus });
};

// Delete a notification
const deleteNotification = async (id: string): Promise<void> => {
    // Check if notification exists
    const existingNotification = await NotificationModel.findUnique({
        where: { id },
    });

    if (!existingNotification) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Notification not found');
    }

    await NotificationModel.delete({
        where: { id },
    });
};

// Resend failed email notifications
const resendFailedEmail = async (id: string): Promise<INotificationResponse | null> => {
    const notification = await NotificationModel.findUnique({
        where: { id },
        include: {
            recipient: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
        },
    });

    if (!notification) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Notification not found');
    }

    if (notification.type !== 'EMAIL' && notification.type !== 'BOTH') {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Notification is not an email type');
    }

    if (notification.emailStatus && notification.emailStatus !== 'FAILED') {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Email was not failed, no need to resend');
    }

    // Update status to pending
    await NotificationModel.update({
        where: { id },
        data: { emailStatus: 'PENDING' },
    });

    // Resend email
    const emailResult = await sendEmail(
        notification.recipient?.email,
        notification.title,
        notification.message
    );

    // Update email status
    const updatedNotification = await NotificationModel.update({
        where: { id },
        data: {
            emailStatus: emailResult.success ? 'SENT' : 'FAILED',
        },
        include: {
            recipient: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
        },
    });

    return updatedNotification as INotificationResponse;
};

// Get notification statistics
const getNotificationStats = async (recipientId?: string): Promise<INotificationStats> => {
    let whereClause: any = {};

    if (recipientId) {
        whereClause.recipientId = recipientId;
    }

    const [
        totalNotifications,
        readNotifications,
        inAppNotifications,
        emailNotifications,
        pendingEmails,
        sentEmails,
        failedEmails,
    ] = await Promise.all([
        NotificationModel.count({ where: whereClause }),
        NotificationModel.count({ where: { ...whereClause, readStatus: true } }),
        NotificationModel.count({ where: { ...whereClause, type: 'IN_APP' } }),
        NotificationModel.count({ where: { ...whereClause, type: 'EMAIL' } }),
        NotificationModel.count({ where: { ...whereClause, emailStatus: 'PENDING' } }),
        NotificationModel.count({ where: { ...whereClause, emailStatus: 'SENT' } }),
        NotificationModel.count({ where: { ...whereClause, emailStatus: 'FAILED' } }),
    ]);

    return {
        totalNotifications,
        readNotifications,
        unreadNotifications: totalNotifications - readNotifications,
        inAppNotifications,
        emailNotifications,
        pendingEmails,
        sentEmails,
        failedEmails,
    };
};

// Mark all notifications as read for a user
const markAllNotificationsAsRead = async (recipientId: string): Promise<void> => {
    await NotificationModel.updateMany({
        where: {
            recipientId,
            readStatus: false,
        },
        data: {
            readStatus: true,
        },
    });
};

// Delete all read notifications for a user
const deleteAllReadNotifications = async (recipientId: string): Promise<void> => {
    await NotificationModel.deleteMany({
        where: {
            recipientId,
            readStatus: true,
        },
    });
};

export const notificationServices = {
    createNotification,
    sendNotification,
    sendEmailNotification,
    sendBulkNotifications,
    broadcastNotification,
    getAllNotifications,
    getNotificationById,
    updateNotification,
    markNotificationAsRead,
    deleteNotification,
    resendFailedEmail,
    getNotificationStats,
    markAllNotificationsAsRead,
    deleteAllReadNotifications,
};