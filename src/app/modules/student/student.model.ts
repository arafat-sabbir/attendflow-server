import prisma from '../../config/prisma';

/**
 * Student model using Prisma Client
 * All database operations go through the Prisma client
 */
export const StudentModel = prisma.student;
export const BatchModel = prisma.batch;
export const DepartmentModel = prisma.department;

export default StudentModel;