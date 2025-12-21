import { Request, Response } from 'express';
import { leaveServices } from './leave.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { leaveValidation } from './leave.validation';

/**
 * Submit a new leave request
 */
const submitLeave = catchAsync(async (req: Request, res: Response) => {
    const result = await leaveServices.submitLeave(req.body);
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        message: "Leave request submitted successfully",
        data: result,
    });
});

/**
 * Update leave request
 */
const updateLeave = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await leaveServices.updateLeave(id, req.body);
    sendResponse(res, {
        message: "Leave request updated successfully",
        data: result,
    });
});

/**
 * Get leave by ID
 */
const getLeaveById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await leaveServices.getLeaveById(id);
    sendResponse(res, {
        message: "Leave request retrieved successfully",
        data: result,
    });
});

/**
 * Get leave requests with filters
 */
const getLeaves = catchAsync(async (req: Request, res: Response) => {
    const result = await leaveServices.getLeaves(req.query);
    sendResponse(res, {
        message: "Leave requests retrieved successfully",
        data: result,
    });
});

/**
 * Approve leave request
 */
const approveLeave = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { rejectionReason } = req.body;
    const result = await leaveServices.processLeaveRequest(
        id,
        'APPROVED',
        req.user?.id || '',
        rejectionReason
    );
    sendResponse(res, {
        message: "Leave request approved successfully",
        data: result,
    });
});

/**
 * Reject leave request
 */
const rejectLeave = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    if (!rejectionReason) {
        return sendResponse(res, {
            statusCode: StatusCodes.BAD_REQUEST,
            message: "Rejection reason is required",
            data: null,
        });
    }

    const result = await leaveServices.processLeaveRequest(
        id,
        'REJECTED',
        req.user?.id || '',
        rejectionReason
    );
    sendResponse(res, {
        message: "Leave request rejected successfully",
        data: result,
    });
});

/**
 * Delete leave request
 */
const deleteLeave = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await leaveServices.deleteLeave(id);
    sendResponse(res, {
        message: "Leave request deleted successfully",
        data: null,
    });
});

/**
 * Get leave statistics
 */
const getLeaveStats = catchAsync(async (req: Request, res: Response) => {
    const result = await leaveServices.getLeaveStats(req.query);
    sendResponse(res, {
        message: "Leave statistics retrieved successfully",
        data: result,
    });
});

/**
 * Get leave dashboard data
 */
const getLeaveDashboard = catchAsync(async (req: Request, res: Response) => {
    const result = await leaveServices.getLeaveDashboard();
    sendResponse(res, {
        message: "Leave dashboard data retrieved successfully",
        data: result,
    });
});

/**
 * Get my leave requests (for the current user)
 */
const getMyLeaves = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        return sendResponse(res, {
            statusCode: StatusCodes.UNAUTHORIZED,
            message: "User not authenticated",
            data: null,
        });
    }

    const filters = { ...req.query, userId };
    const result = await leaveServices.getLeaves(filters);
    sendResponse(res, {
        message: "Your leave requests retrieved successfully",
        data: result,
    });
});

/**
 * Get pending leave requests (for teachers/admins)
 */
const getPendingLeaves = catchAsync(async (req: Request, res: Response) => {
    const filters = { ...req.query, status: 'PENDING' as any };
    const result = await leaveServices.getLeaves(filters);
    sendResponse(res, {
        message: "Pending leave requests retrieved successfully",
        data: result,
    });
});

/**
 * Bulk approve leave requests
 */
const bulkApproveLeaves = catchAsync(async (req: Request, res: Response) => {
    const { leaveIds } = req.body;
    const approvedBy = req.user?.id || '';

    if (!leaveIds || !Array.isArray(leaveIds) || leaveIds.length === 0) {
        return sendResponse(res, {
            statusCode: StatusCodes.BAD_REQUEST,
            message: "Valid leave IDs array is required",
            data: null,
        });
    }

    const results = [];
    for (const id of leaveIds) {
        try {
            const result = await leaveServices.processLeaveRequest(id, 'APPROVED', approvedBy);
            results.push(result);
        } catch (error) {
            // Continue with other leaves even if one fails
            console.error(`Failed to approve leave ${id}:`, error);
        }
    }

    sendResponse(res, {
        message: `${results.length} leave requests approved successfully`,
        data: results,
    });
});

/**
 * Bulk reject leave requests
 */
const bulkRejectLeaves = catchAsync(async (req: Request, res: Response) => {
    const { leaveIds, rejectionReason } = req.body;
    const approvedBy = req.user?.id || '';

    if (!leaveIds || !Array.isArray(leaveIds) || leaveIds.length === 0) {
        return sendResponse(res, {
            statusCode: StatusCodes.BAD_REQUEST,
            message: "Valid leave IDs array is required",
            data: null,
        });
    }

    if (!rejectionReason) {
        return sendResponse(res, {
            statusCode: StatusCodes.BAD_REQUEST,
            message: "Rejection reason is required for bulk rejection",
            data: null,
        });
    }

    const results = [];
    for (const id of leaveIds) {
        try {
            const result = await leaveServices.processLeaveRequest(id, 'REJECTED', approvedBy, rejectionReason);
            results.push(result);
        } catch (error) {
            // Continue with other leaves even if one fails
            console.error(`Failed to reject leave ${id}:`, error);
        }
    }

    sendResponse(res, {
        message: `${results.length} leave requests rejected successfully`,
        data: results,
    });
});

export const leaveControllers = {
    submitLeave,
    updateLeave,
    getLeaveById,
    getLeaves,
    approveLeave,
    rejectLeave,
    deleteLeave,
    getLeaveStats,
    getLeaveDashboard,
    getMyLeaves,
    getPendingLeaves,
    bulkApproveLeaves,
    bulkRejectLeaves,
};