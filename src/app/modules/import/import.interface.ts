export type ImportType = 'users' | 'courses' | 'attendance' | 'leave';

export interface IImportOptions {
    updateExisting: boolean;
    skipDuplicates: boolean;
    sendWelcomeEmail: boolean;
    dryRun: boolean;
}

export interface IImportExecution {
    type: ImportType;
    fileId: string;
    options: IImportOptions;
}
