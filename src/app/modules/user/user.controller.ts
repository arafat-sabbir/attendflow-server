import { Request, Response } from 'express';
import { userServices } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse, { sendPaginatedResponse } from "../../utils/sendResponse";
import { StatusCodes } from 'http-status-codes';
import { userValidation } from './user.validation';

/** Create a new User */
const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createUser(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "New User created successfully",
    data: result,
  });
});

/** Get a single User by ID */
const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.getUserById(req.params.id);
  sendResponse(res, {
    message: "User retrieved successfully",
    data: result,
  });
});

/** Get all Users */
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.getAllUsers(req.query);
  sendPaginatedResponse(res, "users", result.data, result.meta, "Users retrieved successfully");
});

/** Update a User */
const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userServices.updateUser(id, req.body);
  sendResponse(res, {
    message: "User updated successfully",
    data: result,
  });
});

/** Delete a User */
const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await userServices.deleteUser(id);
  sendResponse(res, {
    statusCode: StatusCodes.NO_CONTENT,
    message: "User deleted successfully",
    data: null,
  });
});

/** Change User Role */
const changeUserRole = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userServices.changeUserRole(id, req.body.role);
  sendResponse(res, {
    message: "User role changed successfully",
    data: result,
  });
});

/** Change User Status */
const changeUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userServices.changeUserStatus(id, req.body.status);
  sendResponse(res, {
    message: "User status changed successfully",
    data: result,
  });
});

/** Get User Profile */
const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.getUserProfile(req.params.id);
  sendResponse(res, {
    message: "User profile retrieved successfully",
    data: result,
  });
});

/** Get User Statistics */
const getUserStats = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.getUserStats();
  sendResponse(res, {
    message: "User statistics retrieved successfully",
    data: result,
  });
});

/** Get Users by Role */
const getUsersByRole = catchAsync(async (req: Request, res: Response) => {
  const { role } = req.params;
  const result = await userServices.getUsersByRole(role as any);
  sendResponse(res, {
    message: `Users with role ${role} retrieved successfully`,
    data: result,
  });
});

/** Search Users */
const searchUsers = catchAsync(async (req: Request, res: Response) => {
  const { q } = req.query;
  const result = await userServices.searchUsers(q as string);
  sendResponse(res, {
    message: "Users search completed successfully",
    data: result,
  });
});

/** Update User Profile */
const updateUserProfile = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userServices.updateUserProfile(id, req.body);
  sendResponse(res, {
    message: "User profile updated successfully",
    data: result,
  });
});

/** Soft Delete User */
const softDeleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await userServices.softDeleteUser(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "User deactivated successfully",
    data: null,
  });
});

/** Bulk Update User Status */
const bulkUpdateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { userIds, status } = req.body;
  await userServices.bulkUpdateUserStatus(userIds, status);
  sendResponse(res, {
    message: "Users status updated successfully",
    data: null,
  });
});

/** Get User Activity */
const getUserActivity = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { limit } = req.query;
  const result = await userServices.getUserActivity(id, Number(limit) || 10);
  sendResponse(res, {
    message: "User activity retrieved successfully",
    data: result,
  });
});

export const userControllers = {
  createUser,
  getSingleUser,
  getAllUsers,
  updateUser,
  deleteUser,
  changeUserRole,
  changeUserStatus,
  getUserProfile,
  getUserStats,
  getUsersByRole,
  searchUsers,
  updateUserProfile,
  softDeleteUser,
  bulkUpdateUserStatus,
  getUserActivity,
};
