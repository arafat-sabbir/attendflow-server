import { Router } from "express";
import { SettingsController } from "./settings.controller";
import AuthorizeRequest from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { SettingsValidation } from "./settings.validation";

const router = Router();

/**
 * @description get system settings
 * @param {string} path - /api/settings/
 * @param {function} middleware - ['AuthorizeRequest("ADMIN")', 'validateRequest(SettingsValidation.getSettingsQuery)']
 * @param {function} controller - ['getSettings']
 * @returns {object} - router
 * @access private - ['ADMIN']
 * @method GET
 */
router.get(
    "/",
    AuthorizeRequest("ADMIN"),
    validateRequest(SettingsValidation.getSettingsQuery),
    SettingsController.getSettings
);

/**
 * @description update system settings
 * @param {string} path - /api/settings/
 * @param {function} middleware - ['AuthorizeRequest("ADMIN")', 'validateRequest(SettingsValidation.updateSettings)']
 * @param {function} controller - ['updateSettings']
 * @returns {object} - router
 * @access private - ['ADMIN']
 * @method PATCH
 */
router.patch(
    "/",
    AuthorizeRequest("ADMIN"),
    validateRequest(SettingsValidation.updateSettings),
    SettingsController.updateSettings
);

export const SettingsRoutes = router;
