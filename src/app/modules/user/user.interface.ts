import { User } from '@prisma/client';

// Define types locally since they're not exported from @prisma/client
export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING';

// Export the Prisma-generated User type
export type IUser = User;

// For creating a new user (without id and timestamps)
export type IUserCreate = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

// For updating a user (all fields optional)
export type IUserUpdate = Partial<IUserCreate>;

// User response without password
export type IUserResponse = Omit<IUser, 'password'>;

// User profile response with additional information
export interface IUserProfile extends IUserResponse {
  totalCourses?: number;
  totalAttendances?: number;
  totalLeaves?: number;
}

// User statistics
export interface IUserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  suspendedUsers: number;
  usersByRole: Record<UserRole, number>;
}

// User filters for queries
export interface IUserFilters {
  role?: UserRole;
  status?: UserStatus;
  search?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// User activity log
export interface IUserActivity {
  id: string;
  userId: string;
  action: string;
  timestamp: Date;
  details?: Record<string, any>;
}