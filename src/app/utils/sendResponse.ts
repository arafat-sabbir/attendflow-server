import { Response } from 'express';

interface TResponse<T> {
  message: string;
  data: T;
  statusCode?: number;
}

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  console.log({
    statusCode: data?.statusCode || 200,
    success: true,
    message: data.message,
    data: data.data,
  });
  res.status(200).json({
    statusCode: data?.statusCode || 200,
    success: true,
    message: data.message,
    data: data.data,
  });
};

export default sendResponse;
