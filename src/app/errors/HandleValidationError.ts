import { TErrorSources } from '../interface/error';

// Prisma validation errors handler
const handleValidationError = (err: any) => {
  const statusCode = 400;

  // Prisma validation errors come in different formats
  const errorSources: TErrorSources = err.errors
    ? Object.values(err.errors).map((val: any) => ({
      path: val.path || 'unknown',
      message: val.message || 'Validation failed',
    }))
    : [{ path: 'unknown', message: err.message || 'Validation Error' }];

  return { statusCode, message: 'Validation Error', errorSources };
};

export default handleValidationError;
