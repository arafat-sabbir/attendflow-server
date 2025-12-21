import prisma from "../../config/prisma";
import { ISettingUpdate } from "./settings.interface";

const getSettings = async (group?: string) => {
    const where = group ? { group } : {};
    const settings = await prisma.setting.findMany({ where });

    // Transform to key-value object
    return settings.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {} as Record<string, any>);
};

const updateSetting = async (payload: ISettingUpdate) => {
    const result = await prisma.setting.upsert({
        where: { key: payload.key },
        update: { value: payload.value },
        create: {
            key: payload.key,
            value: payload.value,
            group: "GENERAL" // Default or parse from key
        }
    });
    return result;
};

const updateSettingsBulk = async (settings: Record<string, any>, group: string = "GENERAL") => {
    const updates = Object.entries(settings).map(([key, value]) => {
        return prisma.setting.upsert({
            where: { key },
            update: { value },
            create: { key, value, group }
        });
    });

    await prisma.$transaction(updates);
    return getSettings(group);
};

export const SettingsService = {
    getSettings,
    updateSetting,
    updateSettingsBulk
};
