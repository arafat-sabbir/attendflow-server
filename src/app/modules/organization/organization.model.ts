import prisma from '../../config/prisma';

/**
 * Organization models using Prisma Client
 * All database operations go through the Prisma client
 */

// Export Prisma models directly
export const DepartmentModel = prisma.department;
export const SemesterModel = prisma.semester;
export const BatchModel = prisma.batch;
export const SubjectModel = prisma.subject;

export default DepartmentModel;