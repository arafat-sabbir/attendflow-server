import { Response } from 'express';

interface TResponse<T> {
  message: string;
  data: T;
  statusCode?: number;
}

interface TPaginatedResponse<T> {
  message: string;
  data: {
    [modelName: string]: T[] | {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
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

const sendPaginatedResponse = <T>(
  res: Response,
  modelName: string,
  data: T[],
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  },
  message?: string,
  statusCode?: number
) => {
  const response = {
    statusCode: statusCode || 200,
    success: true,
    message: message || `${modelName} retrieved successfully`,
    data: {
      [modelName]: data,
      meta,
    },
  };

  console.log(response);
  res.status(statusCode || 200).json(response);
};

export { sendPaginatedResponse };
export default sendResponse;
