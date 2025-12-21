import { z } from "zod";
import { UserRole, UserStatus } from './user.interface';

/** Validation schema for creating User */
const createUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    username: z.string().min(3, 'Username must be at least 3 characters').optional(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    role: z.enum(['ADMIN', 'TEACHER', 'STUDENT']).optional().default('STUDENT'),
    status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING']).optional().default('ACTIVE'),
    avatar: z.string().url('Invalid avatar URL').optional(),
    phone: z.string().regex(/^[+]?[\d\s\-\(\)]+$/, 'Invalid phone number format').optional(),
    address: z.string().optional(),
    dateOfBirth: z.string().refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, 'Invalid date format').optional(),
  }),
});

/** Validation schema for updating User */
const updateUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format').optional(),
    username: z.string().min(3, 'Username must be at least 3 characters').optional(),
    password: z.string().min(6, 'Password must be at least 6 characters').optional(),
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    role: z.enum(['ADMIN', 'TEACHER', 'STUDENT']).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING']).optional(),
    avatar: z.string().url('Invalid avatar URL').optional(),
    phone: z.string().regex(/^[+]?[\d\s\-\(\)]+$/, 'Invalid phone number format').optional(),
    address: z.string().optional(),
    dateOfBirth: z.string().refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, 'Invalid date format').optional(),
  }),
});

/** Validation schema for changing user role */
const changeUserRoleSchema = z.object({
  body: z.object({
    userId: z.string().min(1, 'User ID is required'),
    role: z.enum(['ADMIN', 'TEACHER', 'STUDENT'], 'Invalid role'),
  }),
});

/** Validation schema for changing user status */
const changeUserStatusSchema = z.object({
  body: z.object({
    userId: z.string().min(1, 'User ID is required'),
    status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING'], 'Invalid status'),
  }),
});

/** Validation schema for user ID in params */
const userIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'User ID is required'),
  }),
});

/** Validation schema for user filters in query */
const userFiltersSchema = z.object({
  query: z.object({
    role: z.enum(['ADMIN', 'TEACHER', 'STUDENT']).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING']).optional(),
    search: z.string().optional(),
    page: z.string().regex(/^\d+$/, 'Page must be a number').optional(),
    limit: z.string().regex(/^\d+$/, 'Limit must be a number').optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});

/** Validation schema for bulk update user status */
const bulkUpdateUserStatusSchema = z.object({
  body: z.object({
    userIds: z.array(z.string().min(1, 'User ID cannot be empty')).min(1, 'At least one user ID is required'),
    status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING'], 'Invalid status'),
  }),
});

/** Validation schema for user search */
const userSearchSchema = z.object({
  query: z.object({
    q: z.string().min(1, 'Search query is required').max(100, 'Search query too long'),
  }),
});

/** Validation schema for user role in params */
const userRoleParamSchema = z.object({
  params: z.object({
    role: z.enum(['ADMIN', 'TEACHER', 'STUDENT'], 'Invalid role'),
  }),
});

/** Validation schema for user profile update */
const updateUserProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    username: z.string().min(3, 'Username must be at least 3 characters').optional(),
    avatar: z.string().url('Invalid avatar URL').optional(),
    phone: z.string().regex(/^[+]?[\d\s\-\(\)]+$/, 'Invalid phone number format').optional(),
    address: z.string().optional(),
    dateOfBirth: z.string().refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, 'Invalid date format').optional(),
  }),
});

export const userValidation = {
  createUserSchema,
  updateUserSchema,
  changeUserRoleSchema,
  changeUserStatusSchema,
  userIdParamSchema,
  userFiltersSchema,
  bulkUpdateUserStatusSchema,
  userSearchSchema,
  userRoleParamSchema,
  updateUserProfileSchema,
};
