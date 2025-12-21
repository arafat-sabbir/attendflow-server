import prisma from '../../config/prisma';

/**
 * User model using Prisma Client
 * All database operations go through the Prisma client
 */
export const UserModel = prisma.user;

export default UserModel;