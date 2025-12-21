import { notificationServices } from './notification.service';
import { notificationControllers } from './notification.controller';
import { notificationRoutes } from './notification.route';

export const NotificationModule = {
    service: notificationServices,
    controller: notificationControllers,
    routes: notificationRoutes,
};

export * from './notification.interface';
export * from './notification.validation';
export * from './notification.service';
export * from './notification.controller';
export * from './notification.route';