import { User, Course } from '@prisma/client';

// QR Code status enum
export enum QRCodeStatus {
    ACTIVE = 'ACTIVE',
    EXPIRED = 'EXPIRED',
    USED = 'USED'
}

// QR Code status type for backward compatibility
export type QRCodeStatusType = 'ACTIVE' | 'EXPIRED' | 'USED';

// QR Token interface
export interface IQRToken {
    id: string;
    code: string;
    courseId: string;
    teacherId: string;
    validFrom: Date;
    validUntil: Date;
    maxUses: number;
    usedCount: number;
    status: QRCodeStatusType;
    location?: string | null;
    description?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

// QR Token with relationships
export interface IQRTokenWithRelations extends IQRToken {
    course: Course;
    teacher: User;
    checkIns: IQRCheckIn[];
}

// Create QR Token interface
export interface IQRTokenCreate {
    courseId: string;
    teacherId: string;
    validFrom?: Date;
    validUntil?: Date;
    maxUses?: number;
    location?: string | null;
    description?: string | null;
}

// Update QR Token interface
export interface IQRTokenUpdate {
    status?: QRCodeStatus;
    isActive?: boolean;
    location?: string;
    description?: string;
    validUntil?: Date;
    maxUses?: number;
}

// QR Check In interface
export interface IQRCheckIn {
    id: string;
    qrCodeId: string;
    userId: string;
    checkInTime: Date;
    location?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    notes?: string | null;
    isValid: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// QR Check In with relationships
export interface IQRCheckInWithRelations extends IQRCheckIn {
    qrcode: IQRToken;
    user: User;
}

// Create QR Check In interface
export interface IQRCheckInCreate {
    qrCodeId?: string;
    tokenId?: string;
    userId: string;
    checkInTime?: Date;
    location?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    notes?: string | null;
    isValid?: boolean;
}

// QR Code validation request interface
export interface IQRValidationRequest {
    code?: string;
    token?: string;
    userId: string;
    location?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
}

// QR Code validation response interface
export interface IQRValidationResponse {
    isValid: boolean;
    token?: IQRToken;
    checkIn?: IQRCheckIn;
    attendance?: any; // Will be populated if attendance is created
    message: string;
}

// QR Token filters interface
export interface IQRTokenFilters {
    courseId?: string;
    teacherId?: string;
    status?: QRCodeStatusType;
    isActive?: boolean;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

// QR Check In filters interface
export interface IQRCheckInFilters {
    qrCodeId?: string;
    tokenId?: string;
    userId?: string;
    courseId?: string;
    isValid?: boolean;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

// QR Code generation options interface
export interface IQRGenerationOptions {
    expiresIn?: number; // Expiration time in minutes
    maxUses?: number;
    location?: string;
    description?: string;
}

// QR Code statistics interface
export interface IQRStatistics {
    totalTokens: number;
    activeTokens: number;
    expiredTokens: number;
    usedTokens: number;
    totalCheckIns: number;
    validCheckIns: number;
    invalidCheckIns: number;
    todayStats: {
        tokensGenerated: number;
        checkIns: number;
        uniqueUsers: number;
    };
}
