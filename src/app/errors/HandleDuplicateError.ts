//A Custom Error Handler For Handling Prisma Unique Constraint Violations

import { TErrorSources } from '../interface/error';
import { Prisma } from '@prisma/client';

const handleDuplicateError = (err: Prisma.PrismaClientKnownRequestError) => {
  const statusCode = 400;

  // Extract the field name from the Prisma error meta
  let fieldName = 'Field';
  let fieldValue = 'value';

  if (err.meta && err.meta.target) {
    const target = err.meta.target as string[];
    fieldName = Array.isArray(target) ? target.join(', ') : String(target);
  }

  const errorSources: TErrorSources = [
    {
      path: fieldName,
      message: `${fieldName} already exists, try another`,
    },
  ];

  return {
    statusCode,
    message: `${fieldName} already exists, try another`,
    errorSources
  };
};

export default handleDuplicateError;
