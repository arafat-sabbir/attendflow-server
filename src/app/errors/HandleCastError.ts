import { TGenericErrorResponse } from '../interface/error';

// Prisma doesn't have CastError like Mongoose
// This handler is for invalid ID formats or type mismatches
const handleCastError = (err: any): TGenericErrorResponse => {
  const errorSources = [
    {
      path: err.path || 'id',
      message: err.message || 'Invalid ID format provided',
    },
  ];
  return {
    statusCode: 400,
    success: false,
    message: 'Invalid ID Provided',
    errorSources,
  };
};

export default handleCastError;
