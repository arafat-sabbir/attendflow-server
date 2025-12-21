import prisma from '../../config/prisma';

/**
 * Notification model using Prisma Client
 * All database operations go through the Prisma client
 */
export const NotificationModel = prisma.notification;

export default NotificationModel;