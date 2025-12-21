import { Request, Response } from 'express';
import { notificationServices } from './notification.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { notificationValidations } from './notification.validation';

/** Send notification to a single user */
const sendNotification = catchAsync(async (req: Request, res: Response) => {
    const result = await notificationServices.sendNotification(req.body);
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        message: 'Notification sent successfully',
        data: result,
    });
});

/** Send email notification */
const sendEmailNotification = catchAsync(async (req: Request, res: Response) => {
    const result = await notificationServices.sendEmailNotification(req.body);
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        message: 'Email notification sent successfully',
        data: result,
    });
});

/** Send bulk notifications */
const sendBulkNotifications = catchAsync(async (req: Request, res: Response) => {
    const result = await notificationServices.sendBulkNotifications(req.body);
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        message: 'Bulk notifications sent successfully',
        data: result,
    });
});

/** Broadcast notification by role */
const broadcastNotification = catchAsync(async (req: Request, res: Response) => {
    const result = await notificationServices.broadcastNotification(req.body);
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        message: 'Broadcast notifications sent successfully',
        data: result,
    });
});

/** Get all notifications */
const getAllNotifications = catchAsync(async (req: Request, res: Response) => {
    const result = await notificationServices.getAllNotifications(req.query);
    sendResponse(res, {
        message: 'Notifications retrieved successfully',
        data: result,
    });
});

/** Get a single notification by ID */
const getSingleNotification = catchAsync(async (req: Request, res: Response) => {
    const result = await notificationServices.getNotificationById(req.params.id);
    sendResponse(res, {
        message: 'Notification retrieved successfully',
        data: result,
    });
});

/** Update a notification */
const updateNotification = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await notificationServices.updateNotification(id, req.body);
    sendResponse(res, {
        message: 'Notification updated successfully',
        data: result,
    });
});

/** Mark notification as read/unread */
const markNotificationAsRead = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await notificationServices.markNotificationAsRead(id, req.body.readStatus);
    sendResponse(res, {
        message: 'Notification status updated successfully',
        data: result,
    });
});

/** Delete a notification */
const deleteNotification = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await notificationServices.deleteNotification(id);
    sendResponse(res, {
        statusCode: StatusCodes.NO_CONTENT,
        message: 'Notification deleted successfully',
        data: null,
    });
});

/** Resend failed email */
const resendFailedEmail = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await notificationServices.resendFailedEmail(id);
    sendResponse(res, {
        message: 'Failed email resent successfully',
        data: result,
    });
});

/** Get notification statistics */
const getNotificationStats = catchAsync(async (req: Request, res: Response) => {
    const { recipientId } = req.query;
    const result = await notificationServices.getNotificationStats(recipientId as string);
    sendResponse(res, {
        message: 'Notification statistics retrieved successfully',
        data: result,
    });
});

/** Mark all notifications as read for a user */
const markAllNotificationsAsRead = catchAsync(async (req: Request, res: Response) => {
    const { recipientId } = req.params;
    await notificationServices.markAllNotificationsAsRead(recipientId);
    sendResponse(res, {
        message: 'All notifications marked as read successfully',
        data: null,
    });
});

/** Delete all read notifications for a user */
const deleteAllReadNotifications = catchAsync(async (req: Request, res: Response) => {
    const { recipientId } = req.params;
    await notificationServices.deleteAllReadNotifications(recipientId);
    sendResponse(res, {
        statusCode: StatusCodes.NO_CONTENT,
        message: 'All read notifications deleted successfully',
        data: null,
    });
});

export const notificationControllers = {
    sendNotification,
    sendEmailNotification,
    sendBulkNotifications,
    broadcastNotification,
    getAllNotifications,
    getSingleNotification,
    updateNotification,
    markNotificationAsRead,
    deleteNotification,
    resendFailedEmail,
    getNotificationStats,
    markAllNotificationsAsRead,
    deleteAllReadNotifications,
};