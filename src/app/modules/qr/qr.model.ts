import prisma from '../../config/prisma';
import {
    IQRToken,
    IQRTokenCreate,
    IQRTokenUpdate,
    IQRCheckIn,
    IQRCheckInCreate,
    IQRTokenFilters,
    IQRCheckInFilters,
    IQRStatistics,
    QRCodeStatus
} from './qr.interface';

// Utility function to generate a cryptographically secure random token
const generateSecureToken = (length: number = 32): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(array[i] % chars.length);
    }
    return result;
};

// Rate limiting store for QR validation attempts
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting function
const checkRateLimit = (identifier: string, maxAttempts: number = 5, windowMs: number = 60000): boolean => {
    const now = Date.now();
    const record = rateLimitStore.get(identifier);
    
    if (!record || now > record.resetTime) {
        // First attempt or window expired
        rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
        return true;
    }
    
    if (record.count >= maxAttempts) {
        return false;
    }
    
    record.count++;
    return true;
};

// Utility function to generate a random token (deprecated - use generateSecureToken)
const generateRandomToken = (length: number = 32): string => {
    return generateSecureToken(length);
};

// QR Token model operations
export const QRTokenModel = {
    // Create a new QR token
    create: async (data: IQRTokenCreate): Promise<IQRToken> => {
        // Generate a unique token
        const token = generateRandomToken(32); // Generate a 32-character token

        // Set default values if not provided
        const now = new Date();
        const validFrom = data.validFrom || now;
        const validUntil = data.validUntil || new Date(now.getTime() + 2 * 60 * 60 * 1000); // Default 2 hours
        const maxUses = data.maxUses || 1;
        const result = await prisma.qRCode.create({
            data: {
                code: token,
                courseId: data.courseId,
                teacherId: data.teacherId,
                validFrom,
                validUntil,
                maxUses,
                location: data.location,
                description: data.description,
                status: 'ACTIVE' as QRCodeStatus,
            },
            include: {
                course: {
                    select: { id: true, title: true, code: true },
                },
                teacher: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        return result as unknown as IQRToken;
    },

    // Find QR token by ID
    findById: async (id: string): Promise<IQRToken | null> => {
        const result = await prisma.qRCode.findUnique({
            where: { id },
            include: {
                course: {
                    select: { id: true, title: true, code: true },
                },
                teacher: {
                    select: { id: true, name: true, email: true },
                },
                checkIns: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true },
                        },
                    },
                },
            },
        });

        return result as unknown as IQRToken | null;
    },

    // Find QR token by token string
    findByToken: async (token: string): Promise<IQRToken | null> => {
        const result = await prisma.qRCode.findUnique({
            where: { code: token },
            include: {
                course: {
                    select: { id: true, title: true, code: true },
                },
                teacher: {
                    select: { id: true, name: true, email: true },
                },
                checkIns: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true },
                        },
                    },
                },
            },
        });

        return result as unknown as IQRToken | null;
    },

    // Get QR tokens with filters
    findMany: async (filters: IQRTokenFilters) => {
        const {
            courseId,
            teacherId,
            status,
            startDate,
            endDate,
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = filters;

        const where: any = {};

        if (courseId) where.courseId = courseId;
        if (teacherId) where.teacherId = teacherId;
        if (status) where.status = status;
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt.gte = new Date(startDate);
            if (endDate) where.createdAt.lte = new Date(endDate);
        }

        const skip = (page - 1) * limit;

        const [tokens, total] = await Promise.all([
            prisma.qRCode.findMany({
                where,
                include: {
                    course: {
                        select: { id: true, title: true, code: true },
                    },
                    teacher: {
                        select: { id: true, name: true, email: true },
                    },
                    _count: {
                        select: { checkIns: true },
                    },
                },
                orderBy: { [sortBy]: sortOrder },
                skip,
                take: limit,
            }),
            prisma.qRCode.count({ where }),
        ]);

        return {
            data: tokens,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    },

    // Update QR token
    update: async (id: string, data: IQRTokenUpdate): Promise<IQRToken> => {
        const result = await prisma.qRCode.update({
            where: { id },
            data: data as any,
            include: {
                course: {
                    select: { id: true, title: true, code: true },
                },
                teacher: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        return result as unknown as IQRToken;
    },

    // Delete QR token
    delete: async (id: string): Promise<IQRToken> => {
        const result = await prisma.qRCode.delete({
            where: { id },
            include: {
                course: {
                    select: { id: true, title: true, code: true },
                },
                teacher: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        return result as unknown as IQRToken;
    },

    // Increment used count for a QR token
    incrementUsedCount: async (id: string): Promise<IQRToken> => {
        const result = await prisma.qRCode.update({
            where: { id },
            data: {
                usedCount: {
                    increment: 1,
                },
            },
            include: {
                course: {
                    select: { id: true, title: true, code: true },
                },
                teacher: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        return result as unknown as IQRToken;
    },

    // Expire QR token
    expireToken: async (id: string): Promise<IQRToken> => {
        const result = await prisma.qRCode.update({
            where: { id },
            data: {
                status: 'EXPIRED' as QRCodeStatus,
            },
            include: {
                course: {
                    select: { id: true, title: true, code: true },
                },
                teacher: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        return result as unknown as IQRToken;
    },

    // Check if QR token is valid
    isValidToken: async (token: string): Promise<{ isValid: boolean; tokenData?: IQRToken; reason?: string }> => {
        const tokenData = await prisma.qRCode.findUnique({
            where: { code: token },
        });

        if (!tokenData) {
            return { isValid: false, reason: 'Token not found' };
        }

        const now = new Date();

        // Check if token has expired
        if (now > (tokenData as any).validUntil) {
            return { isValid: false, reason: 'Token has expired' };
        }

        // Check if token is not yet valid
        if (now < (tokenData as any).validFrom) {
            return { isValid: false, reason: 'Token is not yet valid' };
        }

        // Check if token has been used up
        if ((tokenData as any).usedCount >= (tokenData as any).maxUses) {
            return { isValid: false, reason: 'Token has reached maximum usage limit' };
        }

        // Check if token status is ACTIVE
        if ((tokenData as any).status !== 'ACTIVE') {
            return { isValid: false, reason: `Token status is ${(tokenData as any).status}` };
        }

        return { isValid: true, tokenData: tokenData as unknown as IQRToken };
    },
};

// QR Check In model operations
export const QRCheckInModel = {
    // Create a new QR check-in
    create: async (data: IQRCheckInCreate): Promise<IQRCheckIn> => {
        const qrCodeId = data.qrCodeId || data.tokenId;
        if (!qrCodeId) {
            throw new Error('qrCodeId or tokenId is required');
        }

        const result = await prisma.qRCheckIn.create({
            data: {
                qrCodeId,
                userId: data.userId,
                checkInTime: data.checkInTime || new Date(),
                location: data.location,
                ipAddress: data.ipAddress,
                userAgent: data.userAgent,
                notes: data.notes,
                isValid: data.isValid !== undefined ? data.isValid : true,
            },
            include: {
                qrcode: {
                    include: {
                        course: {
                            select: { id: true, title: true, code: true },
                        },
                        teacher: {
                            select: { id: true, name: true, email: true },
                        },
                    },
                },
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        return result as unknown as IQRCheckIn;
    },

    // Find QR check-in by ID
    findById: async (id: string): Promise<IQRCheckIn | null> => {
        const result = await prisma.qRCheckIn.findUnique({
            where: { id },
            include: {
                qrcode: {
                    include: {
                        course: {
                            select: { id: true, title: true, code: true },
                        },
                        teacher: {
                            select: { id: true, name: true, email: true },
                        },
                    },
                },
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        return result as unknown as IQRCheckIn | null;
    },

    // Get QR check-ins with filters
    findMany: async (filters: IQRCheckInFilters) => {
        const {
            tokenId,
            userId,
            isValid,
            startDate,
            endDate,
            page = 1,
            limit = 10,
            sortBy = 'checkInTime',
            sortOrder = 'desc'
        } = filters;

        const where: any = {};

        if (tokenId) where.qrCodeId = tokenId;
        if (userId) where.userId = userId;
        if (isValid !== undefined) where.isValid = isValid;
        if (startDate || endDate) {
            where.checkInTime = {};
            if (startDate) where.checkInTime.gte = new Date(startDate);
            if (endDate) where.checkInTime.lte = new Date(endDate);
        }

        const skip = (page - 1) * limit;

        const [checkIns, total] = await Promise.all([
            prisma.qRCheckIn.findMany({
                where,
                include: {
                    qrcode: {
                        include: {
                            course: {
                                select: { id: true, title: true, code: true },
                            },
                            teacher: {
                                select: { id: true, name: true, email: true },
                            },
                        },
                    },
                    user: {
                        select: { id: true, name: true, email: true },
                    },
                },
            }),
            prisma.qRCheckIn.count({ where }),
        ]);

        return {
            data: checkIns,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    },

    // Update QR check-in
    update: async (id: string, data: Partial<IQRCheckIn>): Promise<IQRCheckIn> => {
        const result = await prisma.qRCheckIn.update({
            where: { id },
            data,
            include: {
                qrcode: {
                    include: {
                        course: {
                            select: { id: true, title: true, code: true },
                        },
                        teacher: {
                            select: { id: true, name: true, email: true },
                        },
                    },
                },
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        return result as unknown as IQRCheckIn;
    },

    // Delete QR check-in
    remove: async (id: string): Promise<IQRCheckIn> => {
        const result = await prisma.qRCheckIn.delete({
            where: { id },
            include: {
                qrcode: {
                    include: {
                        course: {
                            select: { id: true, title: true, code: true },
                        },
                        teacher: {
                            select: { id: true, name: true, email: true },
                        },
                    },
                },
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        return result as unknown as IQRCheckIn;
    },

    // Get QR statistics
    getStatistics: async (): Promise<IQRStatistics> => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const [
            totalTokens,
            activeTokens,
            expiredTokens,
            usedTokens,
            totalCheckIns,
            validCheckIns,
            invalidCheckIns,
            todayTokens,
            todayCheckIns,
            todayUniqueUsers,
        ] = await Promise.all([
            prisma.qRCode.count(),
            prisma.qRCode.count({ where: { status: 'ACTIVE' } }),
            prisma.qRCode.count({ where: { status: 'EXPIRED' } }),
            prisma.qRCode.count({ where: { status: 'USED' } }),
            prisma.qRCheckIn.count(),
            prisma.qRCheckIn.count({ where: { isValid: true } }),
            prisma.qRCheckIn.count({ where: { isValid: false } }),
            prisma.qRCode.count({ where: { createdAt: { gte: today, lt: tomorrow } } }),
            prisma.qRCheckIn.count({ where: { checkInTime: { gte: today, lt: tomorrow } } }),
            prisma.qRCheckIn.findMany({
                where: { checkInTime: { gte: today, lt: tomorrow } },
                select: { userId: true },
                distinct: ['userId'],
            }).then((users: any[]) => users.length),
        ]);

        return {
            totalTokens,
            activeTokens,
            expiredTokens,
            usedTokens,
            totalCheckIns,
            validCheckIns,
            invalidCheckIns,
            todayStats: {
                tokensGenerated: todayTokens,
                checkIns: todayCheckIns,
                uniqueUsers: todayUniqueUsers,
            },
        };
    },
};

// Export the checkRateLimit function for use in service
export { checkRateLimit };

export default QRTokenModel;
