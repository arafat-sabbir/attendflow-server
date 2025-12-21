import { Prisma } from '@prisma/client';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handlePrismaError = (err: any): TGenericErrorResponse => {
    let statusCode = 400;
    let message = 'Database Error';
    let errorSources: TErrorSources = [];

    // Check if it's a Prisma error by checking the code property
    if (err.code) {
        switch (err.code) {
            case 'P2002': // Unique constraint violation
                const target = err.meta?.target as string[] | undefined;
                const field = target ? target.join(', ') : 'Field';
                message = `${field} already exists`;
                errorSources = [
                    {
                        path: field,
                        message: `${field} must be unique`,
                    },
                ];
                break;

            case 'P2025': // Record not found
                statusCode = 404;
                message = 'Record not found';
                errorSources = [
                    {
                        path: 'id',
                        message: 'The requested record does not exist',
                    },
                ];
                break;

            case 'P2003': // Foreign key constraint failed
                message = 'Foreign key constraint failed';
                errorSources = [
                    {
                        path: (err.meta?.field_name as string) || 'relation',
                        message: 'Referenced record does not exist',
                    },
                ];
                break;

            case 'P2014': // Invalid ID
                message = 'Invalid ID';
                errorSources = [
                    {
                        path: 'id',
                        message: 'The provided ID is invalid',
                    },
                ];
                break;

            default:
                message = err.message || 'Database operation failed';
                errorSources = [
                    {
                        path: 'database',
                        message: err.message,
                    },
                ];
        }
    } else {
        message = err.message || 'Database operation failed';
        errorSources = [
            {
                path: 'database',
                message: err.message,
            },
        ];
    }

    return {
        statusCode,
        success: false,
        message,
        errorSources,
    };
};

export default handlePrismaError;
