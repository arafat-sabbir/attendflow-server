// Dashboard module interfaces and types
// Note: According to requirements, dashboard data should be computed from the database, not stored

// Statistics Data Types
export interface IAttendanceStats {
    totalClasses: number;
    presentCount: number;
    absentCount: number;
    lateCount: number;
    excusedCount: number;
    attendancePercentage: number;
    monthlyBreakdown?: Array<{
        month: string;
        present: number;
        absent: number;
        late: number;
        excused: number;
    }>;
}

export interface IPerformanceStats {
    averageGrade: number;
    gradeDistribution: Record<string, number>;
    improvementRate: number;
    topPerformers: Array<{
        studentId: string;
        name: string;
        grade: number;
    }>;
    bottomPerformers: Array<{
        studentId: string;
        name: string;
        grade: number;
    }>;
}

export interface ILeaveStats {
    totalLeaves: number;
    pendingLeaves: number;
    approvedLeaves: number;
    rejectedLeaves: number;
    leaveByType: Record<string, number>;
    monthlyTrend: Array<{
        month: string;
        count: number;
    }>;
}

// Dashboard Overview interfaces
export interface IDashboardOverview {
    totalStudents: number;
    totalTeachers: number;
    totalCourses: number;
    totalDepartments: number;
    attendanceStats: IAttendanceStats;
    leaveStats: ILeaveStats;
    lowAttendanceAlerts: Array<{
        studentId: string;
        studentName: string;
        attendancePercentage: number;
        threshold: number;
    }>;
    recentReports: Array<{
        id: string;
        title: string;
        type: string;
        createdAt: Date;
    }>;
}

export interface IClassLevelStats {
    courseId: string;
    courseName: string;
    batchId: string;
    batchName: string;
    totalStudents: number;
    averageAttendance: number;
    attendanceDistribution: {
        above90: number;
        between75And90: number;
        between60And75: number;
        below60: number;
    };
    monthlyTrend: Array<{
        month: string;
        attendanceRate: number;
    }>;
}

export interface ISubjectLevelStats {
    subjectId: string;
    subjectName: string;
    departmentId: string;
    departmentName: string;
    totalCourses: number;
    totalStudents: number;
    averageAttendance: number;
    averagePerformance: number;
    topPerformingCourses: Array<{
        courseId: string;
        courseName: string;
        attendanceRate: number;
    }>;
}

export interface ITeacherPerformanceData {
    teacherId: string;
    teacherName: string;
    departmentId: string;
    departmentName: string;
    totalCourses: number;
    totalStudents: number;
    averageAttendance: number;
    studentPerformance: number;
    attendanceMarkingConsistency: number;
    leaveApprovalRate: number;
    monthlyPerformance: Array<{
        month: string;
        attendanceRate: number;
        performanceScore: number;
    }>;
}

// API Response interfaces
export interface IDashboardResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
    };
}

export interface IAttendanceReportData {
    summary: {
        totalClasses: number;
        averagePercentage: number;
        totalPresent: number;
        totalAbsent: number;
        totalLate: number;
        totalExcused: number;
    };
    trend: Array<{
        date: string;
        percentage: number;
        present: number;
        absent: number;
        late: number;
        excused: number;
    }>;
    byDepartment: Array<{
        departmentId: string;
        departmentName: string;
        percentage: number;
        totalClasses: number;
        present: number;
        absent: number;
    }>;
    statusDistribution: {
        present: number;
        absent: number;
        late: number;
        excused: number;
    };
    topStudents: Array<{
        studentId: string;
        studentName: string;
        percentage: number;
        totalClasses: number;
        attended: number;
    }>;
    bottomStudents?: Array<{
        studentId: string;
        studentName: string;
        percentage: number;
        totalClasses: number;
        attended: number;
    }>;
    detailedData: Array<{
        id: string;
        name: string;
        type: string;
        totalClasses: number;
        present: number;
        absent: number;
        late: number;
        excused: number;
        percentage: number;
    }>;
}

// Query parameters interfaces
export interface IDashboardQueryParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    startDate?: string;
    endDate?: string;
    entityType?: string;
    entityId?: string;
    statType?: string;
    timePeriod?: string;
}