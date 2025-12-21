import { z } from 'zod';

const validateImportSchema = z.object({
    body: z.object({
        type: z.enum(['STUDENT', 'TEACHER', 'COURSE', 'DEPARTMENT', 'BATCH']),
    }),
});

const executeImportSchema = z.object({
    body: z.object({
        type: z.enum(['STUDENT', 'TEACHER', 'COURSE', 'DEPARTMENT', 'BATCH']),
        data: z.array(z.any()),
    }),
});

export const ImportValidation = {
    validateImport: validateImportSchema,
    executeImport: executeImportSchema,
};
