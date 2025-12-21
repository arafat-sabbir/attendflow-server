import prisma from '../../config/prisma';

/**
 * Course models using Prisma Client
 * All database operations go through the Prisma client
 */
export const CourseModel = prisma.course;
export const CourseEnrollmentModel = prisma.courseEnrollment;
export const ClassScheduleModel = prisma.classSchedule;

export default CourseModel;