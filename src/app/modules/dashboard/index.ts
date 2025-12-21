import { DashboardController } from './dashboard.controller';
import DashboardRoutes from './dashboard.route';
import DashboardService from './dashboard.service';
import * as dashboardValidation from './dashboard.validation';

export {
    DashboardController,
    DashboardRoutes,
    DashboardService,
    dashboardValidation,
};

export default {
    Controller: DashboardController,
    Routes: DashboardRoutes,
    Service: DashboardService,
    Validation: dashboardValidation,
};