import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ImportService } from "./import.service";
import { StatusCodes } from "http-status-codes";

const validateImport = catchAsync(async (req: Request, res: Response) => {
    const { type } = req.body;
    const file = req.file; // Assuming multer or similar is used
    const result = await ImportService.validateFile(type, file);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "File validated successfully",
        data: result
    });
});

const executeImport = catchAsync(async (req: Request, res: Response) => {
    const result = await ImportService.executeImport(req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Import executed successfully",
        data: result
    });
});

export const ImportController = {
    validateImport,
    executeImport
};
