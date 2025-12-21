import { Request, Response } from 'express';
import { studentServices } from "./student.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from 'http-status-codes';
import { studentValidation } from './student.validation';

/** Create a new Student profile */
const createStudent = catchAsync(async (req: Request, res: Response) => {
    const result = await studentServices.createStudent(req.body);
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        message: "Student profile created successfully",
        data: result,
    });
});

/** Get a single Student by ID */
const getSingleStudent = catchAsync(async (req: Request, res: Response) => {
    const result = await studentServices.getStudentById(req.params.id);
    sendResponse(res, {
        message: "Student retrieved successfully",
        data: result,
    });
});

/** Get a Student by User ID */
const getStudentByUserId = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const result = await studentServices.getStudentByUserId(userId);
    sendResponse(res, {
        message: "Student retrieved successfully",
        data: result,
    });
});

/** Get all Students */
const getAllStudents = catchAsync(async (req: Request, res: Response) => {
    const result = await studentServices.getAllStudents(req.query);
    sendResponse(res, {
        message: "Students retrieved successfully",
        data: result,
    });
});

/** Update a Student */
const updateStudent = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await studentServices.updateStudent(id, req.body);
    sendResponse(res, {
        message: "Student updated successfully",
        data: result,
    });
});

/** Delete a Student */
const deleteStudent = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await studentServices.deleteStudent(id);
    sendResponse(res, {
        statusCode: StatusCodes.NO_CONTENT,
        message: "Student deleted successfully",
        data: null,
    });
});

/** Get Student Profile */
const getStudentProfile = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await studentServices.getStudentProfile(id);
    sendResponse(res, {
        message: "Student profile retrieved successfully",
        data: result,
    });
});

/** Get Student Attendance Records */
const getStudentAttendance = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await studentServices.getStudentAttendance(id, req.query);
    sendResponse(res, {
        message: "Student attendance retrieved successfully",
        data: result,
    });
});

/** Get Student Attendance Summary */
const getStudentAttendanceSummary = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await studentServices.getStudentAttendanceSummary(id);
    sendResponse(res, {
        message: "Student attendance summary retrieved successfully",
        data: result,
    });
});

/** Submit Leave Request */
const submitLeaveRequest = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await studentServices.submitLeaveRequest(id, req.body);
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        message: "Leave request submitted successfully",
        data: result,
    });
});

/** Update Student Profile */
const updateStudentProfile = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await studentServices.updateStudentProfile(id, req.body);
    sendResponse(res, {
        message: "Student profile updated successfully",
        data: result,
    });
});

/** Get Student Dashboard Data */
const getStudentDashboard = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await studentServices.getStudentDashboard(id);
    sendResponse(res, {
        message: "Student dashboard data retrieved successfully",
        data: result,
    });
});

export const studentControllers = {
    createStudent,
    getSingleStudent,
    getStudentByUserId,
    getAllStudents,
    updateStudent,
    deleteStudent,
    getStudentProfile,
    getStudentAttendance,
    getStudentAttendanceSummary,
    submitLeaveRequest,
    updateStudentProfile,
    getStudentDashboard,
};