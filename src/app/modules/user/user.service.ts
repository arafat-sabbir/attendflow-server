import { UserModel } from './user.model';
import { IUserCreate, IUserUpdate, IUserResponse, IUserProfile, IUserStats, UserRole, UserStatus } from './user.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import { hashInfo } from '../../utils/hashInfo';
import prisma from '../../config/prisma';

/** Create a new User */
const createUser = async (data: IUserCreate): Promise<IUserResponse> => {
  // Check if user with email already exists
  const existingUser = await UserModel.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new AppError(StatusCodes.CONFLICT, 'User with this email already exists');
  }

  // Hash password before storing
  const hashedPassword = await hashInfo(data.password);

  const user = await UserModel.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });

  // Remove password from response
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword as IUserResponse;
};

/** Get a User by ID */
const getUserById = async (id: string): Promise<IUserResponse | null> => {
  const user = await UserModel.findUnique({
    where: { id },
  });

  if (!user) {
    return null;
  }

  // Remove password from response
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword as IUserResponse;
};

/** Get all Users with query builder support */
const getAllUsers = async (query: any): Promise<{ data: IUserResponse[]; meta: any }> => {
  const queryBuilder = new QueryBuilder(query);

  // Build query with search, filter, sort, pagination, and field selection
  queryBuilder.search(['name', 'email', 'username']).filter().sort().paginate().fields();

  const queryOptions = queryBuilder.getQueryOptions();

  // Execute query
  const [users, total] = await Promise.all([
    UserModel.findMany({
      ...queryOptions,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        avatar: true,
        phone: true,
        address: true,
        dateOfBirth: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    UserModel.count({ where: queryOptions.where }),
  ]);

  const meta = queryBuilder.getPaginationMeta(total);

  return {
    data: users as IUserResponse[],
    meta,
  };
};

/** Update a User */
const updateUser = async (id: string, data: IUserUpdate): Promise<IUserResponse | null> => {
  // Check if user exists
  const existingUser = await UserModel.findUnique({
    where: { id },
  });

  if (!existingUser) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  // If password is being updated, hash it
  if (data.password) {
    data.password = await hashInfo(data.password);
  }

  const updatedUser = await UserModel.update({
    where: { id },
    data: data as any,
  });

  // Remove password from response
  const { password, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword as IUserResponse;
};

/** Delete a User */
const deleteUser = async (id: string): Promise<void> => {
  // Check if user exists
  const existingUser = await UserModel.findUnique({
    where: { id },
  });

  if (!existingUser) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  await UserModel.delete({
    where: { id },
  });
};

/** Change User Role */
const changeUserRole = async (id: string, role: UserRole): Promise<IUserResponse | null> => {
  // Check if user exists
  const existingUser = await UserModel.findUnique({
    where: { id },
  });

  if (!existingUser) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  const updatedUser = await UserModel.update({
    where: { id },
    data: { role: role as any },
  });

  // Remove password from response
  const { password, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword as IUserResponse;
};

/** Change User Status */
const changeUserStatus = async (id: string, status: UserStatus): Promise<IUserResponse | null> => {
  // Check if user exists
  const existingUser = await UserModel.findUnique({
    where: { id },
  });

  if (!existingUser) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  const updatedUser = await UserModel.update({
    where: { id },
    data: { status: status as any },
  });

  // Remove password from response
  const { password, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword as IUserResponse;
};

/** Get User Profile with related data */
const getUserProfile = async (id: string): Promise<IUserProfile | null> => {
  const user = await UserModel.findUnique({
    where: { id },
  });

  if (!user) {
    return null;
  }

  // Get related data separately
  const [teacherData, studentData, leaveRequests, attendanceRecords] = await Promise.all([
    // If user is a teacher, get their courses
    prisma.teacher.findUnique({
      where: { userId: id },
      include: {
        courses: {
          select: {
            id: true,
            title: true,
            code: true,
          },
        },
      },
    }),
    // If user is a student, get their enrollments
    prisma.student.findUnique({
      where: { userId: id },
      include: {
        batch: true,
        department: true,
      },
    }),
    // Get leave requests
    prisma.leaveRequest.findMany({
      where: {
        userId: id,
        status: 'APPROVED',
      },
      select: {
        id: true,
      },
    }),
    // Get attendance records
    prisma.attendance.findMany({
      where: {
        userId: id,
      },
      select: {
        id: true,
      },
    }),
  ]);

  // Calculate statistics
  const totalCourses = (teacherData?.courses?.length || 0) + (studentData ? 1 : 0);
  const totalEnrollments = studentData ? 1 : 0;
  const totalLeaves = leaveRequests.length;
  const totalAttendances = attendanceRecords.length;

  return {
    ...user,
    totalCourses,
    totalAttendances,
    totalLeaves,
  } as IUserProfile;
};

/** Get User Statistics */
const getUserStats = async (): Promise<IUserStats> => {
  const [
    totalUsers,
    activeUsers,
    inactiveUsers,
    suspendedUsers,
    usersByRole,
  ] = await Promise.all([
    UserModel.count(),
    UserModel.count({ where: { status: 'ACTIVE' } }),
    UserModel.count({ where: { status: 'INACTIVE' } }),
    UserModel.count({ where: { status: 'SUSPENDED' } }),
    UserModel.groupBy({
      by: ['role'],
      _count: true,
    }),
  ]);

  // Transform role counts
  const roleCounts: Record<UserRole, number> = {
    ADMIN: 0,
    TEACHER: 0,
    STUDENT: 0,
  };

  usersByRole.forEach((item) => {
    roleCounts[item.role] = item._count;
  });

  return {
    totalUsers,
    activeUsers,
    inactiveUsers,
    suspendedUsers,
    usersByRole: roleCounts,
  };
};

/** Get Users by Role */
const getUsersByRole = async (role: UserRole): Promise<IUserResponse[]> => {
  const users = await UserModel.findMany({
    where: { role: role as any },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      avatar: true,
      phone: true,
      createdAt: true,
    },
  });

  return users as IUserResponse[];
};

/** Search Users */
const searchUsers = async (query: string): Promise<IUserResponse[]> => {
  const users = await UserModel.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
        { username: { contains: query, mode: 'insensitive' } },
      ],
    },
    select: {
      id: true,
      email: true,
      name: true,
      username: true,
      role: true,
      status: true,
      avatar: true,
      phone: true,
      createdAt: true,
    },
  });

  return users as IUserResponse[];
};

/** Update User Profile */
const updateUserProfile = async (id: string, data: Partial<IUserCreate>): Promise<IUserResponse | null> => {
  // Check if user exists
  const existingUser = await UserModel.findUnique({
    where: { id },
  });

  if (!existingUser) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  // If email is being updated, check if it's already taken
  if (data.email && data.email !== existingUser.email) {
    const emailExists = await UserModel.findUnique({
      where: { email: data.email },
    });
    if (emailExists) {
      throw new AppError(StatusCodes.CONFLICT, 'Email already exists');
    }
  }

  // If username is being updated, check if it's already taken
  if (data.username && data.username !== existingUser.username) {
    const usernameExists = await UserModel.findUnique({
      where: { username: data.username },
    });
    if (usernameExists) {
      throw new AppError(StatusCodes.CONFLICT, 'Username already exists');
    }
  }

  const updatedUser = await UserModel.update({
    where: { id },
    data: data as any,
  });

  // Remove password from response
  const { password, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword as IUserResponse;
};

/** Soft Delete User (change status to inactive) */
const softDeleteUser = async (id: string): Promise<void> => {
  // Check if user exists
  const existingUser = await UserModel.findUnique({
    where: { id },
  });

  if (!existingUser) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  await UserModel.update({
    where: { id },
    data: { status: 'INACTIVE' as any },
  });
};

/** Bulk Update User Status */
const bulkUpdateUserStatus = async (userIds: string[], status: UserStatus): Promise<void> => {
  await UserModel.updateMany({
    where: {
      id: { in: userIds },
    },
    data: { status: status as any },
  });
};

/** Get User Activity */
const getUserActivity = async (id: string, limit: number = 10): Promise<any[]> => {
  // This would require a UserActivity model
  // For now, return empty array
  return [];
};

export const userServices = {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  changeUserRole,
  changeUserStatus,
  getUserProfile,
  getUserStats,
  getUsersByRole,
  searchUsers,
  updateUserProfile,
  softDeleteUser,
  bulkUpdateUserStatus,
  getUserActivity,
};