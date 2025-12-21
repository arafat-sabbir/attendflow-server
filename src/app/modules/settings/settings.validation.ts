import { z } from 'zod';

const getSettingsQuerySchema = z.object({
    query: z.object({
        group: z.string().optional(),
    }),
});

const updateSettingsSchema = z.object({
    body: z.object({
        group: z.string().optional(),
    }).passthrough(),
});

export const SettingsValidation = {
    getSettingsQuery: getSettingsQuerySchema,
    updateSettings: updateSettingsSchema,
};
