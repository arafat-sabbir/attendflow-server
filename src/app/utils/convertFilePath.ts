/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Response } from "express";

// Middleware to convert file path to a URL-friendly path
const convertFilePath = (req:any, res:Response, next:NextFunction) => {
  if (req.file) {
    const fullPath = req.file.path;
    const relativePath = fullPath.split('public')[1];
    req.file.path = relativePath.replace(/\\/g, '/'); // Save the URL-friendly path
  }

  if (req.files && Array.isArray(req.files)) {
    req.files.forEach((file:any) => {
      const fullPath = file.path;
      const relativePath = fullPath.split('public')[1];
      file.path = relativePath.replace(/\\/g, '/');
    });
  }

  next(); // Proceed to the next middleware/controller
};

export default convertFilePath;
