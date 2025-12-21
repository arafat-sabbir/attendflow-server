# AttendFlow Dashboard/Admin Panel - Management & Analytics Application

> **Note**: This document covers the **Dashboard/Admin Panel** application for management, CRUD operations, and system configuration. For user-facing features (view attendance, QR check-in, etc.), see `FRONTEND_PAGES.md`.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Admin Dashboard & Analytics](#admin-dashboard--analytics)
3. [Admin Management Features](#admin-management-features)
4. [Teacher Dashboard & Management](#teacher-dashboard--management)
5. [Student Dashboard](#student-dashboard)
6. [Chart & Visualization Specs](#chart--visualization-specs)
7. [API Integration](#api-integration)
8. [Real-time Features](#real-time-features)

---

## Overview

### Application Purpose

This is the **Dashboard/Admin Panel** application where:

- **Admins** perform CRUD operations, configure system, manage users, generate reports
- **Teachers** have limited management access (if granted)
- **Students** only see analytics dashboard (no management features)

### Key Principle

**Manage & Configure** - All CRUD operations, bulk actions, system settings

### Purpose

The dashboard provides role-specific analytics, insights, and **management capabilities** for effective administration of the attendance system.

### Dashboard Types

1. **Admin Dashboard** - System-wide analytics, management overview
2. **Teacher Dashboard** - Course-specific analytics, teaching insights
3. **Student Dashboard** - Personal academic progress, attendance tracking

### Common Dashboard Features

- Real-time data updates
- Interactive charts and graphs
- Filterable date ranges
- Export functionality (PDF, CSV)
- Quick action buttons
- Responsive design for all devices

---

## 📊 Admin Dashboard

Route: `/admin/dashboard`

### Layout Structure

```
┌────────────────────────────────────────────────────────────────┐
│  Filters: [Date Range] [Department ▼] [Batch ▼] [Refresh]     │
├────────────────────────────────────────────────────────────────┤
│  OVERVIEW STATISTICS (4 Cards)                                  │
├────────────────────────────────────────────────────────────────┤
│  ATTENDANCE TRENDS (Charts - 2 columns)                         │
├────────────────────────────────────────────────────────────────┤
│  LEAVE STATISTICS (2 columns)                                   │
├────────────────────────────────────────────────────────────────┤
│  LOW ATTENDANCE ALERTS (Table)                                  │
├────────────────────────────────────────────────────────────────┤
│  TEACHER PERFORMANCE (Table/Chart)                              │
├────────────────────────────────────────────────────────────────┤
│  RECENT ACTIVITY (Feed) | QUICK ACTIONS (Buttons)              │
└────────────────────────────────────────────────────────────────┘
```

---

### Section 1: Global Filters

**Components**:

- **Date Range Picker**: Start Date - End Date (default: current month)
- **Department Dropdown**: Filter by department (with "All Departments" option)
- **Batch Dropdown**: Filter by batch (with "All Batches" option)
- **Refresh Button**: Reload data

**Behavior**: All dashboard sections update when filters change

---

### Section 2: Overview Statistics Cards

**API Endpoint**:

```
GET /api/v1/dashboard/overview?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&departmentId=&batchId=
```

**Response Structure**:

```json
{
  "success": true,
  "data": {
    "users": {
      "total": 1250,
      "students": 1000,
      "teachers": 45,
      "admins": 5,
      "activeToday": 850
    },
    "courses": {
      "total": 120,
      "activeCourses": 98,
      "avgEnrollment": 35
    },
    "attendance": {
      "totalClasses": 450,
      "overallPercentage": 87.5,
      "presentToday": 780,
      "absentToday": 70,
      "lateToday": 15
    },
    "leaves": {
      "pending": 23,
      "approvedThisMonth": 156,
      "rejectedThisMonth": 8
    }
  }
}
```

**Display Cards** (4 cards in a row, responsive to 2 cols on tablet, 1 on mobile):

#### Card 1: Total Users

```
┌─────────────────────────┐
│  👥 Total Users         │
│                         │
│  1,250                  │
│  ↑ 5% from last month   │
│                         │
│  Students: 1,000        │
│  Teachers: 45           │
│  Active Today: 850      │
└─────────────────────────┘
```

- **Icon**: 👥
- **Primary Metric**: Total users (large font)
- **Secondary Metrics**: Breakdown by role
- **Trend**: Percentage change from previous period
- **Color**: Blue

#### Card 2: Active Courses

```
┌─────────────────────────┐
│  📚 Active Courses      │
│                         │
│  98 / 120               │
│  ↑ 2 new this month     │
│                         │
│  Avg Enrollment: 35     │
│  Total Enrollments: 3,430│
└─────────────────────────┘
```

- **Icon**: 📚
- **Primary Metric**: Active courses vs total
- **Secondary Metrics**: Average enrollment
- **Color**: Purple

#### Card 3: Attendance Overview

```
┌─────────────────────────┐
│  ✓ Attendance Rate      │
│                         │
│  87.5%                  │
│  ↓ 1.2% from last week  │
│                         │
│  Present Today: 780     │
│  Absent Today: 70       │
│  Late Today: 15         │
└─────────────────────────┘
```

- **Icon**: ✓
- **Primary Metric**: Overall attendance percentage (large, color-coded)
- **Color-coding**:
  - ≥90%: Green
  - 75-89%: Orange
  - <75%: Red
- **Secondary Metrics**: Today's breakdown
- **Trend**: Comparison with previous period

#### Card 4: Leave Requests

```
┌─────────────────────────┐
│  📅 Leave Requests      │
│                         │
│  23 Pending             │
│  Requires attention     │
│                         │
│  Approved: 156          │
│  Rejected: 8            │
│  [View All →]           │
└─────────────────────────┘
```

- **Icon**: 📅
- **Primary Metric**: Pending leave count (emphasized)
- **Alert**: Show badge/alert if pending > 10
- **Action Button**: "View All" → Navigate to `/admin/leave?status=pending`
- **Color**: Yellow (pending emphasis)

---

### Section 3: Attendance Trends

**API Endpoint**:

```
GET /api/v1/dashboard/overview (includes attendance.trends array)
```

**Response Data**:

```json
{
  "attendance": {
    "trends": [
      { "date": "2024-01-01", "present": 850, "absent": 80, "late": 20, "percentage": 89.5 },
      { "date": "2024-01-02", "present": 870, "absent": 60, "late": 15, "percentage": 92.1 },
      ...
    ]
  }
}
```

#### Chart 1: Daily Attendance Trend (Line Chart)

**Layout**: Left column (70% width)

**Type**: Multi-line chart
**X-axis**: Date
**Y-axis**: Number of students
**Lines**:

- Present (green line)
- Absent (red line)
- Late (orange line)

**Features**:

- Tooltips on hover (show exact numbers)
- Legend (toggle lines on/off)
- Zoom/pan (optional)
- Date range selector below chart (1 week, 1 month, 3 months, custom)

**Chart Library**: Recharts / Chart.js

**Example Code** (Recharts):

```jsx
<LineChart data={attendanceTrends} width={800} height={300}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Line type="monotone" dataKey="present" stroke="#4CAF50" name="Present" />
  <Line type="monotone" dataKey="absent" stroke="#F44336" name="Absent" />
  <Line type="monotone" dataKey="late" stroke="#FF9800" name="Late" />
</LineChart>
```

#### Chart 2: Attendance Distribution (Pie Chart)

**Layout**: Right column (30% width)

**Type**: Pie/Doughnut chart
**Segments**:

- Present (green): 87%
- Absent (red): 10%
- Late (orange): 3%

**Features**:

- Percentage labels on segments
- Legend
- Tooltips with counts

---

### Section 4: Leave Statistics

**Layout**: 2 columns

#### Chart 3: Leave Status Breakdown (Bar Chart)

**Left column**

**Type**: Horizontal bar chart
**Categories**:

- Pending (yellow bar)
- Approved (green bar)
- Rejected (red bar)

**X-axis**: Count
**Y-axis**: Status

**Data**:

```json
{
  "leaves": {
    "statusBreakdown": {
      "pending": 23,
      "approved": 156,
      "rejected": 8
    }
  }
}
```

#### Chart 4: Leave Types Distribution (Doughnut Chart)

**Right column**

**Type**: Doughnut chart
**Segments**:

- Sick Leave
- Personal Leave
- Vacation
- Academic
- Emergency

**Data**:

```json
{
  "leaves": {
    "typeBreakdown": {
      "SICK": 45,
      "PERSONAL": 32,
      "VACATION": 67,
      "ACADEMIC": 12,
      "EMERGENCY": 8
    }
  }
}
```

---

### Section 5: Low Attendance Alerts

**API Endpoint**:

```
GET /api/v1/dashboard/alerts?threshold=75&limit=20
```

**Purpose**: Identify students with attendance below threshold

**Response Data**:

```json
{
  "success": true,
  "data": {
    "alerts": [
      {
        "studentId": "STU001",
        "studentName": "John Doe",
        "batchName": "CSE 2024",
        "departmentName": "Computer Science",
        "attendancePercentage": 68.5,
        "totalClasses": 45,
        "attended": 31,
        "coursesAffected": ["Data Structures", "DBMS"]
      },
      ...
    ]
  }
}
```

**Display**: Sortable Data Table

**Columns**:

1. **Student Name** (with avatar)
2. **Student ID**
3. **Batch**
4. **Department**
5. **Attendance %** (color-coded, with progress bar)
6. **Classes Attended / Total**
7. **Critical Courses** (chips showing course names)
8. **Actions** (View Details, Send Notification)

**Features**:

- Sort by attendance % (default: lowest first)
- Search by student name/ID
- Export to CSV
- Bulk action: Send notification to selected students
- Color coding:
  - 70-74.9%: Orange
  - 65-69.9%: Dark orange
  - <65%: Red

**Alert Badge**: Show count on card header: "⚠️ 12 Students Below 75%"

---

### Section 6: Class-Level Statistics

**API Endpoint**:

```
GET /api/v1/dashboard/stats/class-level?departmentId=&batchId=&startDate=&endDate=
```

**Response Data**:

```json
{
  "success": true,
  "data": {
    "classes": [
      {
        "courseId": "CRS001",
        "courseName": "Data Structures",
        "batchName": "CSE 2024",
        "teacherName": "Dr. Smith",
        "totalClasses": 30,
        "avgAttendance": 85.5,
        "studentsEnrolled": 45,
        "lastClassDate": "2024-01-15T10:00:00Z"
      },
      ...
    ]
  }
}
```

**Display**: Table + Chart

#### Table: Course-wise Attendance

**Columns**:

1. Course Name
2. Batch
3. Teacher
4. Total Classes
5. Enrolled Students
6. Avg Attendance % (with progress bar)
7. Last Class Date
8. Actions (View Details)

**Sort**: Default by lowest attendance %

#### Chart 5: Course Comparison (Bar Chart)

**Type**: Grouped bar chart
**X-axis**: Course names (top 10 courses)
**Y-axis**: Percentage
**Bars**:

- Average attendance %
- Target attendance % (e.g., 90% - dotted line)

**Color coding**:

- ≥90%: Green
- 75-89%: Yellow
- <75%: Red

---

### Section 7: Subject-Level Statistics

**API Endpoint**:

```
GET /api/v1/dashboard/stats/subject-level?departmentId=&startDate=&endDate=
```

**Response Data**:

```json
{
  "success": true,
  "data": {
    "subjects": [
      {
        "subjectId": "SUB001",
        "subjectName": "Data Structures",
        "departmentName": "Computer Science",
        "totalCourses": 3,
        "totalStudents": 135,
        "avgAttendance": 86.2,
        "lowestCourseAttendance": 78.5
      },
      ...
    ]
  }
}
```

**Display**: Cards Grid + Comparison Chart

**Subject Cards** (responsive grid):

```
┌──────────────────────────────┐
│  Data Structures             │
│  Computer Science Dept.      │
│                              │
│  Avg Attendance: 86.2%       │
│  ██████████████░░░░          │
│                              │
│  3 Courses | 135 Students    │
│  Lowest: 78.5%               │
└──────────────────────────────┘
```

---

### Section 8: Teacher Performance

**API Endpoint**:

```
GET /api/v1/dashboard/stats/teacher-performance?departmentId=&startDate=&endDate=
```

**Response Data**:

```json
{
  "success": true,
  "data": {
    "teachers": [
      {
        "teacherId": "TCH001",
        "teacherName": "Dr. John Smith",
        "departmentName": "Computer Science",
        "totalCourses": 3,
        "totalStudents": 105,
        "avgAttendance": 89.5,
        "classesHeld": 42,
        "qrCodesGenerated": 38,
        "leavesProcessed": 12
      },
      ...
    ]
  }
}
```

**Display**: Table with ranking

**Columns**:

1. **Rank** (#1, #2, ...)
2. **Teacher Name** (with avatar)
3. **Department**
4. **Courses Teaching**
5. **Total Students**
6. **Avg Attendance %** (progress bar + color coding)
7. **Classes Held**
8. **QR Codes Generated**
9. **Leaves Processed**
10. **Actions** (View Details)

**Features**:

- Sort by attendance % (default: highest first)
- Top 3 teachers highlighted with badges (🥇 🥈 🥉)
- Search by teacher name
- Filter by department

**Performance Indicators**:

- ≥90% avg attendance: ⭐⭐⭐ (Excellent)
- 85-89%: ⭐⭐ (Good)
- 80-84%: ⭐ (Average)
- <80%: ⚠️ (Needs attention)

---

### Section 9: Recent Activity Feed

**API Endpoint**:

```
GET /api/v1/user/activity?limit=20&page=1 (or custom activity log endpoint)
```

**Purpose**: Show system-wide recent activities

**Display**: Vertical timeline/feed

**Activity Types**:

1. **New User Registered**
   - Icon: 👤
   - Text: "John Doe registered as Student"
   - Timestamp: "2 minutes ago"
2. **Attendance Marked**
   - Icon: ✓
   - Text: "Dr. Smith marked attendance for Data Structures (Batch CSE 2024)"
   - Details: "32/35 present"
   - Timestamp: "15 minutes ago"
3. **Leave Approved**
   - Icon: ✅
   - Text: "Dr. Smith approved leave request from Jane Doe"
   - Timestamp: "1 hour ago"
4. **Course Created**
   - Icon: 📚
   - Text: "New course 'Machine Learning' created"
   - Timestamp: "3 hours ago"
5. **QR Code Generated**
   - Icon: 📱
   - Text: "Dr. Jones generated QR code for Algorithms class"
   - Timestamp: "5 hours ago"

**Features**:

- Auto-refresh every 30 seconds (optional)
- "Load More" button (pagination)
- Filter by activity type
- Click on activity → Navigate to relevant page

---

### Section 10: Quick Actions Panel

**Layout**: Card with action buttons grid

**Actions** (4x2 grid):

1. **➕ Add User** → `/admin/users/create`
2. **👨‍🎓 Add Student** → `/admin/students/create`
3. **👨‍🏫 Add Teacher** → `/admin/teachers/create`
4. **📚 Create Course** → `/admin/courses/create`
5. **🏢 Add Department** → `/admin/departments/create`
6. **📅 Create Batch** → `/admin/batches/create`
7. **🔔 Send Notification** → `/admin/notifications/send`
8. **📊 View Reports** → `/admin/reports`

**Button Style**: Icon + Text, colored background, hover effect

---

## 🛠️ Admin Management Features

> **This section covers all CRUD and configuration operations available only in the Dashboard/Admin Panel application.**

### User Management `/admin/users`

**Purpose**: Manage all users (Admin, Teacher, Student)

**Features**:

1. **User List Table**

   - Columns: Name, Email, Role, Status, Department, Created Date
   - Filters: Role, Status, Search
   - Bulk Actions: Activate, Deactivate, Delete

2. **Actions per User**

   - Edit → Open edit modal
   - View Profile
   - Change Role
   - Change Status (Active/Inactive/Suspended)
   - Delete

3. **Add New User** (Button → Modal/Page)
   - Same as registration form
   - Admin can assign any role

**API Endpoints**:

```
GET /api/v1/user?role=&status=&search=&page=1&limit=20
POST /api/v1/user/create-user
GET /api/v1/user/:id
PATCH /api/v1/user/:id
PATCH /api/v1/user/:id/role
PATCH /api/v1/user/:id/status
DELETE /api/v1/user/:id
PATCH /api/v1/user/bulk/status
GET /api/v1/user/stats
```

---

### Student Management `/admin/students`

**Purpose**: Manage student profiles

**Features**:

- Student list (with filters: Batch, Department, Semester)
- Add Student (creates User + Student profile)
- Edit Student (update profile fields)
- View Student Details (profile, attendance, courses)
- Delete Student
- Bulk operations (CSV import, bulk edit)

**API Endpoints**:

```
GET /api/v1/student?batchId=&departmentId=&semester=&search=&page=1
POST /api/v1/student/create-student
GET /api/v1/student/:id
PATCH /api/v1/student/:id
DELETE /api/v1/student/:id
GET /api/v1/student/profile/:id
GET /api/v1/student/:id/attendance-summary
GET /api/v1/student/stats
```

---

### Teacher Management `/admin/teachers`

**Purpose**: Manage teacher profiles

**Features**:

- Teacher list (filter by department)
- Add Teacher
- Edit Teacher (designation, specialization, etc.)
- View Teacher Details (courses, schedule, performance)
- Delete Teacher
- Assign courses to teachers

**API Endpoints**:

```
GET /api/v1/teacher?departmentId=&page=1
POST /api/v1/teacher
GET /api/v1/teacher/:teacherId
PUT /api/v1/teacher/:teacherId
DELETE /api/v1/teacher/:teacherId
GET /api/v1/teacher/stats
```

---

### Department Management `/admin/departments`

**Purpose**: Manage academic departments (CRUD operations)

**Features**:

- Department list table (Name, Code, Students, Teachers, Courses)
- Add Department (modal/form)
- Edit Department
- View Department Details (students, teachers, courses, subjects)
- Delete Department (with cascade warning)
- Department Statistics

**API Endpoints**:

```
GET /api/v1/organization/departments?search=&page=1
POST /api/v1/organization/departments
GET /api/v1/organization/departments/:departmentId
PATCH /api/v1/organization/departments/:departmentId
DELETE /api/v1/organization/departments/:departmentId
GET /api/v1/organization/departments/stats
```

---

### Batch Management `/admin/batches`

**Purpose**: Manage student batches (year groups)

**Features**:

- Batch list (Name, Year, Start/End Dates, Students Count)
- Add Batch
- Edit Batch
- View Batch Details (students, courses)
- Activate/Deactivate Batch
- Delete Batch

**API Endpoints**:

```
GET /api/v1/organization/batches?year=&isActive=&page=1
POST /api/v1/organization/batches
GET /api/v1/organization/batches/:batchId
PATCH /api/v1/organization/batches/:batchId
DELETE /api/v1/organization/batches/:batchId
GET /api/v1/organization/batches/stats
```

---

### Subject Management `/admin/subjects`

**Purpose**: Manage curriculum subjects

**Features**:

- Subject list (Name, Code, Credits, Department)
- Add Subject
- Edit Subject
- View Subject Details (courses using this subject)
- Delete Subject
- Subject statistics

**API Endpoints**:

```
GET /api/v1/organization/subjects?departmentId=&page=1
POST /api/v1/organization/subjects
GET /api/v1/organization/subjects/:subjectId
PATCH /api/v1/organization/subjects/:subjectId
DELETE /api/v1/organization/subjects/:subjectId
GET /api/v1/organization/subjects/stats
```

---

### Semester Management `/admin/semesters`

**Purpose**: Manage academic semesters

**Features**:

- Semester list (Name, Year, Department, Start/End Dates)
- Add Semester
- Edit Semester
- Activate/Deactivate Semester
- Link semesters to departments

**API Endpoints**:

```
GET /api/v1/organization/semesters?departmentId=&year=&isActive=
POST /api/v1/organization/semesters
GET /api/v1/organization/semesters/:semesterId
PATCH /api/v1/organization/semesters/:semesterId
DELETE /api/v1/organization/semesters/:semesterId
GET /api/v1/organization/semesters/stats
```

---

### Course Management `/admin/courses`

**Purpose**: Manage course offerings (create, edit, delete courses)

**Features**:

1. **Course List**

   - Filters: Department, Batch, Teacher, Subject, Semester
   - Columns: Title, Code, Teacher, Batch, Students, Status
   - Sort by: Name, Students, Date created

2. **Add Course** (Form/Modal)

   - Title, Code, Description
   - Credits
   - Batch (dropdown)
   - Department (dropdown)
   - Teacher (dropdown)
   - Subject (dropdown, optional)
   - Semester (dropdown, optional)

3. **Course Details Page**
   - Basic info
   - Enrolled students (table with add/remove)
   - Class schedules (add/edit/delete)
   - Attendance summary
   - Actions: Edit, Delete, Duplicate

**API Endpoints**:

```
GET /api/v1/course/courses?departmentId=&batchId=&teacherId=&page=1
POST /api/v1/course/courses
GET /api/v1/course/courses/:courseId
PATCH /api/v1/course/courses/:courseId
DELETE /api/v1/course/courses/:courseId
GET /api/v1/course/courses/stats
```

---

### Course Enrollment Management `/admin/enrollments`

**Purpose**: Enroll students in courses (bulk operations)

**Features**:

- Enrollment list (Student, Course, Enrolled Date)
- Enroll Student (select student + course)
- **Bulk Enrollment** (CSV upload or multi-select)
- Remove Enrollment
- Enrollment Statistics
- Conflict detection (already enrolled)

**API Endpoints**:

```
GET /api/v1/course/enrollments?studentId=&courseId=&page=1
POST /api/v1/course/enrollments
GET /api/v1/course/enrollments/:enrollmentId
DELETE /api/v1/course/enrollments/:enrollmentId
POST /api/v1/course/enrollments/bulk (for bulk enrollment)
GET /api/v1/course/enrollments/stats
```

---

### Class Schedule Management `/admin/schedules`

**Purpose**: Manage timetables (create, edit, delete class schedules)

**Features**:

- Schedule list/calendar view
- **Add Class Schedule**
  - Teacher dropdown
  - Course dropdown
  - Batch dropdown
  - Day of Week (Monday-Sunday, 0-6)
  - Start Time, End Time
  - Room
  - Semester
- Edit Schedule
- Delete Schedule
- **Conflict Detection** (same teacher/room at same time)
- Bulk schedule creation

**API Endpoints**:

```
GET /api/v1/course/schedules?teacherId=&courseId=&batchId=&page=1
POST /api/v1/course/schedules
GET /api/v1/course/schedules/:scheduleId
PATCH /api/v1/course/schedules/:scheduleId
DELETE /api/v1/course/schedules/:scheduleId
GET /api/v1/course/schedules/stats
```

---

### System-wide Attendance Management `/admin/attendance`

**Purpose**: View, edit, and manage all attendance records

**Features**:

- Filters: Date range, Course, Batch, Teacher, Student, Status
- Attendance records table (full system view)
- **Edit Attendance** (correct mistakes)
- **Bulk Operations** (mark, update, delete)
- Export to CSV/PDF
- Attendance analytics (charts, trends)

**API Endpoints**:

```
GET /api/v1/attendance?courseId=&userId=&startDate=&endDate=&status=&page=1
GET /api/v1/attendance/:id
PATCH /api/v1/attendance/:id
DELETE /api/v1/attendance/:id
GET /api/v1/attendance/dashboard
POST /api/v1/attendance/bulk-update
```

---

### System-wide Leave Management `/admin/leave`

**Purpose**: View and manage all leave requests (approve/reject/edit)

**Features**:

- Leave requests table (filters: Status, Type, Date range, User, Department)
- **Approve/Reject leaves** (with reason)
- **Bulk actions** (approve/reject multiple)
- Edit leave details (dates, type, status)
- Leave statistics (by type, by department, trends)
- Leave balance management (set policies)
- Leave policy configuration

**API Endpoints**:

```
GET /api/v1/leave?status=&type=&startDate=&endDate=&userId=&page=1
GET /api/v1/leave/:id
PATCH /api/v1/leave/:id
PATCH /api/v1/leave/:id/approve
PATCH /api/v1/leave/:id/reject
DELETE /api/v1/leave/:id
POST /api/v1/leave/bulk-approve
POST /api/v1/leave/bulk-reject
GET /api/v1/leave/stats
GET /api/v1/leave/dashboard
```

---

### QR Code Management `/admin/qr`

**Purpose**: Monitor and manage QR codes system-wide

**Features**:

- Active QR codes list (all teachers)
- QR code history (generated, used, expired)
- Check-in records (who scanned when)
- QR statistics (generated, scanned, expired, misuse)
- **Expire QR codes manually** (bulk expire old QRs)
- Delete QR codes
- QR usage analytics

**API Endpoints**:

```
GET /api/v1/qr?courseId=&teacherId=&status=&page=1
GET /api/v1/qr/:id
DELETE /api/v1/qr/:id
POST /api/v1/qr/expire
POST /api/v1/qr/bulk-expire
GET /api/v1/qr/check-ins?qrCodeId=&userId=&page=1
GET /api/v1/qr/statistics
```

---

### Notification Management `/admin/notifications`

**Purpose**: Send and manage system notifications

**Features**:

1. **Send Notification** (Form)

   - Recipient Type: Single User / Role-based (All Students/Teachers/Admins) / Custom List / Department / Batch
   - Notification Type: In-App / Email / Both
   - Title, Message (with rich text editor)
   - Schedule send (optional)
   - Send button

2. **Sent Notifications** (History)

   - Table: Title, Recipient(s), Type, Status (Sent/Failed/Scheduled), Date
   - Resend failed notifications
   - View delivery status

3. **Bulk Notifications**

   - Send to all users of a role
   - Send to specific department/batch
   - Custom recipient lists (CSV upload)

4. **Notification Templates**

   - Create reusable templates
   - Variables: {userName}, {courseName}, {date}, etc.

5. **Notification Stats**
   - Total sent, delivered, failed
   - Open rates (for emails)

**API Endpoints**:

```
POST /api/v1/notification/send
POST /api/v1/notification/send-email
POST /api/v1/notification/send-bulk
GET /api/v1/notification?page=1&status=&type=
GET /api/v1/notification/:id
PATCH /api/v1/notification/:id
DELETE /api/v1/notification/:id
POST /api/v1/notification/resend/:id
GET /api/v1/notification/stats
```

---

### Reports Generation `/admin/reports`

**Purpose**: Generate comprehensive reports

**Report Types**:

1. **Attendance Reports**

   - Course-wise attendance (all courses)
   - Student-wise attendance (all students)
   - Teacher-wise attendance (classes held)
   - Department-wise attendance
   - Date range selection
   - Low attendance students report
   - Attendance trends analysis

2. **Leave Reports**

   - Leave statistics by type
   - Leave statistics by department
   - Pending leaves summary
   - Approved/rejected leaves analysis
   - Leave balance reports

3. **User Reports**

   - Active users count (by role)
   - User registrations over time
   - Inactive users report
   - User growth analytics

4. **Course Reports**

   - Enrollment numbers (by course, department, batch)
   - Course performance (attendance, completion)
   - Popular courses
   - Underenrolled courses

5. **Custom Reports**
   - Select metrics
   - Date ranges
   - Export options

**Export Options**: PDF, CSV, Excel

**Features**:

- Schedule report generation (daily, weekly, monthly)
- Email reports to admins
- Report templates
- Save custom report configurations

**API**: Use existing analytics endpoints + frontend report generation

---

### System Settings `/admin/settings`

**Purpose**: Configure system-wide settings

**Sections**:

1. **General Settings**

   - Institute Name, Logo upload
   - Contact Email, Phone
   - Academic Year (current)
   - Default Semester
   - System timezone

2. **Attendance Settings**

   - QR Code validity duration (default: 30 mins)
   - Low attendance threshold (default: 75%)
   - Late check-in grace period (default: 10 mins)
   - Auto-mark absent after X hours
   - Attendance calculation method

3. **Leave Settings**

   - Max leave days per type (Sick, Personal, Vacation, etc.)
   - Leave balance reset period
   - Auto-approve settings (conditions)
   - Require documents for sick leave > X days
   - Leave policies by role

4. **Notification Settings**

   - Email server configuration (SMTP)
   - Email templates (welcome, password reset, leave approved, etc.)
   - Notification preferences (which events trigger notifications)
   - Push notification settings

5. **Security Settings**

   - Password requirements (length, complexity)
   - Session timeout duration
   - Two-factor authentication (enable/disable)
   - Login attempt limits

6. **Data & Privacy**
   - Data retention policies
   - Backup settings
   - Export user data
   - GDPR compliance settings

**API Endpoints** (if backend supports):

```
GET /api/v1/settings
PATCH /api/v1/settings
GET /api/v1/settings/:category
PATCH /api/v1/settings/:category
```

_Note: Some settings may be environment variables or config files instead of database records._

---

### Organization Overview `/admin/organization`

**Purpose**: High-level organizational structure view

**Display**:

- Total Departments, Batches, Semesters, Subjects
- **Organization hierarchy visualization** (tree view)
- Quick stats for each entity
- Quick links to manage each entity type

**Features**:

- Interactive org chart
- Drag-and-drop reorganization (optional)
- Export org structure

**API Endpoints**:

```
GET /api/v1/organization/overview
GET /api/v1/organization/hierarchy
```

---

## 👨‍🏫 Teacher Dashboard & Management

> **Note**: Teachers primarily use the user-facing frontend app. This dashboard is for analytics overview. If teachers need management permissions, they can access limited features here.

Route: `/teacher/dashboard` (in Dashboard/Admin Panel app)

### Layout Structure

```
┌────────────────────────────────────────────────────────────────┐
│  Filters: [Date Range] [Refresh]                               │
├────────────────────────────────────────────────────────────────┤
│  QUICK STATS (3 Cards)                                          │
├────────────────────────────────────────────────────────────────┤
│  TODAY'S SCHEDULE (Timeline/Cards)                             │
├────────────────────────────────────────────────────────────────┤
│  MY COURSES (Cards Grid)                                        │
├────────────────────────────────────────────────────────────────┤
│  ATTENDANCE SUMMARY (Charts - 2 columns)                        │
├────────────────────────────────────────────────────────────────┤
│  PENDING LEAVE REQUESTS (Table)                                 │
├────────────────────────────────────────────────────────────────┤
│  STUDENT PERFORMANCE ALERTS (Table)                             │
└────────────────────────────────────────────────────────────────┘
```

---

### API Endpoint:

```
GET /api/v1/teacher/:teacherId/dashboard?startDate=&endDate=
```

**Response Structure**:

```json
{
  "success": true,
  "data": {
    "summary": {
      "totalCourses": 5,
      "totalStudents": 180,
      "classesToday": 3,
      "avgAttendance": 88.5
    },
    "todaySchedule": [
      {
        "courseId": "CRS001",
        "courseName": "Data Structures",
        "batchName": "CSE 2024",
        "startTime": "09:00",
        "endTime": "10:30",
        "room": "Room 201",
        "studentsEnrolled": 45,
        "hasQRCode": true,
        "attendanceMarked": false
      },
      ...
    ],
    "courses": [
      {
        "courseId": "CRS001",
        "courseName": "Data Structures",
        "batchName": "CSE 2024",
        "studentsEnrolled": 45,
        "avgAttendance": 87.5,
        "classesHeld": 28,
        "nextClass": "2024-01-16T09:00:00Z"
      },
      ...
    ],
    "attendanceTrends": [
      { "date": "2024-01-01", "present": 158, "absent": 12, "late": 10 },
      ...
    ],
    "pendingLeaves": [
      {
        "leaveId": "LV001",
        "studentName": "John Doe",
        "studentId": "STU001",
        "type": "SICK",
        "startDate": "2024-01-20",
        "endDate": "2024-01-22",
        "reason": "Fever",
        "appliedDate": "2024-01-15"
      },
      ...
    ],
    "lowAttendanceStudents": [
      {
        "studentName": "Jane Smith",
        "studentId": "STU045",
        "courseName": "Data Structures",
        "attendancePercentage": 72.5,
        "attended": 29,
        "totalClasses": 40
      },
      ...
    ]
  }
}
```

---

### Section 1: Quick Stats (3 Cards)

#### Card 1: My Courses

```
┌─────────────────────────┐
│  📚 My Courses          │
│                         │
│  5                      │
│  180 Total Students     │
└─────────────────────────┘
```

#### Card 2: Classes Today

```
┌─────────────────────────┐
│  🕐 Classes Today       │
│                         │
│  3                      │
│  Next: 09:00 - DS       │
└─────────────────────────┘
```

#### Card 3: Avg Attendance

```
┌─────────────────────────┐
│  ✓ Avg Attendance       │
│                         │
│  88.5%                  │
│  ↑ 2% from last week    │
└─────────────────────────┘
```

---

### Section 2: Today's Schedule

**Display**: Timeline view or card list

**Each Class Card**:

```
┌────────────────────────────────────────────────────────┐
│  09:00 - 10:30                                         │
│  Data Structures (CSE 2024) - Room 201                 │
│                                                        │
│  👥 45 students enrolled                               │
│  Status: Upcoming | QR Code: ✓ Generated              │
│                                                        │
│  [Generate QR]  [Mark Attendance]  [View Details]     │
└────────────────────────────────────────────────────────┘
```

**Features**:

- Color-coded by status:
  - Upcoming: Blue border
  - In Progress: Green border
  - Completed: Gray
- Quick action buttons
- "Generate QR" button (if not generated yet)
- "Mark Attendance" button
- Timer showing time until class starts

---

### Section 3: My Courses Overview

**Display**: Course cards grid (3 per row on desktop)

**Each Course Card**:

```
┌──────────────────────────────────┐
│  Data Structures                 │
│  Batch: CSE 2024                 │
│                                  │
│  👥 45 Students                  │
│  Avg Attendance: 87.5%           │
│  ██████████████████░░            │
│                                  │
│  Classes Held: 28                │
│  Next Class: Jan 16, 09:00       │
│                                  │
│  [View Students]  [View Report]  │
└──────────────────────────────────┘
```

**Features**:

- Click card → Navigate to course details
- Attendance progress bar (color-coded)
- Quick links to view students and attendance report

---

### Section 4: Attendance Summary

#### Chart 1: My Courses Attendance Comparison (Bar Chart)

**Left column**

**Type**: Horizontal bar chart
**Y-axis**: Course names
**X-axis**: Attendance percentage (0-100%)
**Features**:

- Bars color-coded by percentage
- Target line at 90%
- Tooltips with exact values

#### Chart 2: Weekly Attendance Trend (Line Chart)

**Right column**

**Type**: Line chart
**X-axis**: Days of the week
**Y-axis**: Number of students
**Lines**:

- Present (green)
- Absent (red)
- Late (orange)

---

### Section 5: Pending Leave Requests

**Display**: Table

**Columns**:

1. Student Name (with avatar)
2. Student ID
3. Course
4. Leave Type
5. Start Date
6. End Date
7. Reason (truncated, tooltip on hover)
8. Applied Date
9. Actions (Approve, Reject buttons)

**Features**:

- Click "Approve" → Confirm dialog → API call
- Click "Reject" → Modal with rejection reason textarea
- Badge showing total pending count
- Sort by applied date (newest first)
- Filter by course, leave type

**Quick Actions**:

- Bulk approve selected
- Bulk reject selected

---

### Section 6: Student Performance Alerts

**Display**: Table

**Purpose**: Students with low attendance in my courses

**Columns**:

1. Student Name
2. Student ID
3. Course
4. Attendance %
5. Attended / Total
6. Actions (View Details, Send Notification)

**Features**:

- Show only students with <75% attendance
- Sort by percentage (lowest first)
- Color-coded percentages
- Click "Send Notification" → Opens notification modal with pre-filled message

---

## 👨‍🎓 Student Dashboard

> **Note**: Students primarily use the user-facing frontend app. This analytics dashboard is the same in both apps - no management features for students.

Route: `/student/dashboard`

### Layout Structure

```
┌────────────────────────────────────────────────────────────────┐
│  PROFILE CARD                                                   │
├────────────────────────────────────────────────────────────────┤
│  ATTENDANCE SUMMARY (3 Cards)                                   │
├────────────────────────────────────────────────────────────────┤
│  MY ATTENDANCE CHART (Line Chart)                               │
├────────────────────────────────────────────────────────────────┤
│  TODAY'S SCHEDULE (Timeline)                                    │
├────────────────────────────────────────────────────────────────┤
│  MY COURSES (Cards Grid)                                        │
├────────────────────────────────────────────────────────────────┤
│  LEAVE SUMMARY (2 Cards)                                        │
├────────────────────────────────────────────────────────────────┤
│  RECENT NOTIFICATIONS (List)                                    │
└────────────────────────────────────────────────────────────────┘
```

---

### API Endpoint:

```
GET /api/v1/student/dashboard/:studentId
```

**Response Structure**:

```json
{
  "success": true,
  "data": {
    "student": {
      "id": "STU001",
      "name": "John Doe",
      "email": "john@example.com",
      "studentId": "2024CS001",
      "batchName": "CSE 2024",
      "departmentName": "Computer Science",
      "semester": 3,
      "avatar": "url_to_avatar"
    },
    "attendanceSummary": {
      "overallPercentage": 87.5,
      "totalClasses": 120,
      "attended": 105,
      "absent": 12,
      "late": 3,
      "monthlyTrend": [
        { "month": "Sep", "percentage": 88.0 },
        { "month": "Oct", "percentage": 89.5 },
        { "month": "Nov", "percentage": 86.0 },
        { "month": "Dec", "percentage": 87.5 }
      ]
    },
    "todaySchedule": [
      {
        "courseId": "CRS001",
        "courseName": "Data Structures",
        "time": "09:00 - 10:30",
        "room": "Room 201",
        "teacherName": "Dr. Smith",
        "status": "upcoming" // upcoming | completed | missed
      },
      ...
    ],
    "courses": [
      {
        "courseId": "CRS001",
        "courseName": "Data Structures",
        "teacherName": "Dr. Smith",
        "attendancePercentage": 90.0,
        "attended": 27,
        "totalClasses": 30
      },
      ...
    ],
    "leaveSummary": {
      "pending": 1,
      "approved": 2,
      "rejected": 0,
      "balance": {
        "sick": 3,
        "personal": 2,
        "vacation": 8
      }
    },
    "recentNotifications": [
      {
        "id": "NOT001",
        "title": "Attendance Reminder",
        "message": "Your attendance in Data Structures is 72%. Please improve.",
        "isRead": false,
        "createdAt": "2024-01-15T10:00:00Z"
      },
      ...
    ]
  }
}
```

---

### Section 1: Profile Card

**Display**: Horizontal card at the top

```
┌─────────────────────────────────────────────────────────────┐
│  [Avatar]  John Doe                                         │
│            Student ID: 2024CS001                            │
│            Batch: CSE 2024 | Dept: Computer Science        │
│            Semester: 3 | Email: john@example.com           │
│                                                             │
│            [Edit Profile]  [QR Check-In]                   │
└─────────────────────────────────────────────────────────────┘
```

---

### Section 2: Attendance Summary (3 Cards)

#### Card 1: Overall Attendance

```
┌─────────────────────────┐
│  ✓ Overall Attendance   │
│                         │
│  87.5%                  │
│  ████████████████████   │
│                         │
│  105 / 120 Classes      │
└─────────────────────────┘
```

- **Color-coded**:
  - ≥90%: Green
  - 75-89%: Orange
  - <75%: Red (with warning icon)

#### Card 2: This Month

```
┌─────────────────────────┐
│  📅 This Month          │
│                         │
│  89.2%                  │
│  ↑ 1.7% from last month │
│                         │
│  23 / 26 Classes        │
└─────────────────────────┘
```

#### Card 3: Classes Missed

```
┌─────────────────────────┐
│  ⚠️ Classes Missed      │
│                         │
│  12                     │
│  Late: 3                │
│                         │
│  [View Details]         │
└─────────────────────────┘
```

---

### Section 3: My Attendance Chart

**Type**: Line chart (monthly trend)

**X-axis**: Months (last 4-6 months)
**Y-axis**: Attendance percentage (0-100%)

**Line**: Attendance percentage trend
**Target line**: 75% or 90% (dashed horizontal line)

**Features**:

- Tooltips showing exact percentage on hover
- Color gradient fill under line (green if above target, red if below)

---

### Section 4: Today's Schedule

**Display**: Timeline view

**Each Class**:

```
┌────────────────────────────────────────────────────────┐
│  09:00 - 10:30  [Upcoming]                             │
│  Data Structures                                       │
│  Dr. Smith | Room 201                                  │
│                                                        │
│  [Check-In with QR]  [View Course]                     │
└────────────────────────────────────────────────────────┘
```

**Status Badges**:

- Upcoming: Blue
- Completed: Green (with ✓)
- Missed: Red (with ⚠️)

**Features**:

- "Check-In with QR" button (if class is in progress)
- Timer showing time until class

---

### Section 5: My Courses

**Display**: Course cards grid

**Each Course Card**:

```
┌──────────────────────────────────┐
│  Data Structures                 │
│  Dr. Smith                       │
│                                  │
│  My Attendance: 90.0%            │
│  ████████████████████            │
│                                  │
│  Attended: 27 / 30               │
│  Next Class: Jan 16, 09:00       │
│                                  │
│  [View Details]                  │
└──────────────────────────────────┘
```

**Features**:

- Click card → Navigate to course details with attendance history
- Color-coded attendance bar

---

### Section 6: Leave Summary (2 Cards)

#### Card 1: Leave Requests Status

```
┌─────────────────────────┐
│  📅 Leave Requests      │
│                         │
│  Pending: 1             │
│  Approved: 2            │
│  Rejected: 0            │
│                         │
│  [View All Leaves]      │
└─────────────────────────┘
```

#### Card 2: Leave Balance

```
┌─────────────────────────┐
│  💼 Leave Balance       │
│                         │
│  Sick: 3 remaining      │
│  Personal: 2 remaining  │
│  Vacation: 8 remaining  │
│                         │
│  [Apply for Leave]      │
└─────────────────────────┘
```

---

### Section 7: Recent Notifications

**Display**: List (card format)

**Each Notification**:

```
┌────────────────────────────────────────────────────────┐
│  [●] Attendance Reminder                               │
│  Your attendance in Data Structures is 72%. Please... │
│  2 hours ago                                           │
└────────────────────────────────────────────────────────┘
```

**Features**:

- Unread notifications: Bold with blue dot (●)
- Click notification → Mark as read + navigate to relevant page
- "View All" button at bottom

---

## 📈 Chart & Visualization Specs

### Chart Library Recommendations

1. **Recharts** (React) - Simple, declarative, responsive
2. **Chart.js** - Versatile, lightweight
3. **ApexCharts** - Feature-rich, modern
4. **Victory** (React) - Flexible, composable

### Common Chart Configurations

#### Responsive Chart Wrapper

```jsx
<ResponsiveContainer width="100%" height={300}>
  {/* Chart component */}
</ResponsiveContainer>
```

#### Color Palette

- **Present/Approved/Success**: `#4CAF50` (Green)
- **Absent/Rejected/Danger**: `#F44336` (Red)
- **Late/Pending/Warning**: `#FF9800` (Orange)
- **Primary**: `#1976D2` (Blue)
- **Secondary**: `#9C27B0` (Purple)
- **Neutral**: `#757575` (Gray)

#### Chart Interactions

- **Tooltips**: Show on hover with detailed info
- **Legends**: Clickable to toggle data series
- **Zoom**: Enable for time-series charts
- **Export**: Button to download chart as PNG/SVG/PDF

---

## 🔌 API Integration

### Global API Configuration

**Base URL**: `http://localhost:5000/api/v1`

**Axios Instance**:

```js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1',
  timeout: 10000,
});

// Add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

---

### Dashboard API Endpoints Summary

#### Admin Dashboard

```
GET /api/v1/dashboard/overview
GET /api/v1/dashboard/stats/class-level
GET /api/v1/dashboard/stats/subject-level
GET /api/v1/dashboard/stats/teacher-performance
GET /api/v1/dashboard/alerts?threshold=75
```

#### Teacher Dashboard

```
GET /api/v1/teacher/:teacherId/dashboard
GET /api/v1/teacher/:teacherId/schedules/today
GET /api/v1/teacher/:teacherId/courses/:courseId/attendance
GET /api/v1/teacher/:teacherId/leaves/pending
```

#### Student Dashboard

```
GET /api/v1/student/dashboard/:studentId
GET /api/v1/student/:id/attendance-summary
GET /api/v1/student/:id/attendance?courseId=&startDate=&endDate=
GET /api/v1/course/enrollments?studentId={id}
GET /api/v1/notification?recipientId={userId}&limit=5
```

---

### Data Fetching Best Practices

1. **Use React Query** (or SWR) for caching and auto-refetch

```jsx
import { useQuery } from 'react-query';

const useDashboardData = (startDate, endDate) => {
  return useQuery(
    ['dashboard-overview', startDate, endDate],
    () => api.get(`/dashboard/overview?startDate=${startDate}&endDate=${endDate}`),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true,
    }
  );
};
```

2. **Loading States**: Show skeleton loaders for charts and cards

3. **Error Handling**: Show error message with retry button

4. **Empty States**: Show "No data available" message with illustration

---

## ⚡ Real-time Features

### WebSocket Integration (Optional)

**Use Cases**:

1. Live attendance updates (when teacher marks attendance)
2. New notification alerts (real-time push)
3. Leave request status changes
4. Dashboard metric updates

**Implementation** (Socket.io):

```js
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

// Listen for attendance updates
socket.on('attendance-updated', (data) => {
  // Update dashboard stats
  updateAttendanceStats(data);
});

// Listen for new notifications
socket.on('new-notification', (notification) => {
  // Show toast notification
  showToast(notification.title, notification.message);
  // Increment unread badge
  incrementNotificationBadge();
});
```

### Auto-Refresh (Polling Alternative)

If WebSockets are not implemented:

```jsx
// Refresh dashboard data every 30 seconds
useEffect(() => {
  const interval = setInterval(() => {
    refetchDashboardData();
  }, 30000); // 30 seconds

  return () => clearInterval(interval);
}, []);
```

---

## 📱 Responsive Design Guidelines

### Breakpoints

- **Mobile**: < 768px (1 column layout)
- **Tablet**: 768px - 1024px (2 column layout)
- **Desktop**: > 1024px (3-4 column layout)

### Mobile Optimizations

1. **Cards**: Stack vertically on mobile
2. **Tables**: Convert to card list or horizontal scroll
3. **Charts**: Reduce height on mobile (200px instead of 300px)
4. **Filters**: Move to collapsible panel or bottom sheet
5. **Navigation**: Hamburger menu for sidebar

### Tablet Optimizations

- 2-column grid for cards
- Tables with fewer columns (hide less important ones)
- Side-by-side charts

---

## 🎨 UI Components Checklist

### Dashboard Components to Build

- [ ] **StatCard** (reusable metric card)
- [ ] **LineChart** (attendance trends)
- [ ] **BarChart** (comparisons)
- [ ] **PieChart** (distributions)
- [ ] **DataTable** (with sort, filter, pagination)
- [ ] **ActivityFeed** (recent activity list)
- [ ] **ScheduleTimeline** (today's classes)
- [ ] **CourseCard** (course overview card)
- [ ] **AlertTable** (low attendance alerts)
- [ ] **FilterPanel** (date range, dropdowns)
- [ ] **QuickActionButton** (dashboard actions)
- [ ] **NotificationCard** (notification item)
- [ ] **ProgressBar** (attendance percentage)
- [ ] **SkeletonLoader** (loading states)
- [ ] **EmptyState** (no data illustration)

---

## 🚀 Development Priority

### Phase 1: Core Dashboards (Week 1-2)

- [ ] Admin overview stats and filters
- [ ] Student dashboard with attendance summary
- [ ] Teacher dashboard with today's schedule

### Phase 2: Charts & Analytics (Week 3)

- [ ] Attendance trend charts (line, bar, pie)
- [ ] Course comparison charts
- [ ] Leave statistics visualization

### Phase 3: Tables & Lists (Week 4)

- [ ] Low attendance alerts table
- [ ] Teacher performance table
- [ ] Pending leave requests table
- [ ] Recent activity feed

### Phase 4: Real-time & Polish (Week 5)

- [ ] Auto-refresh / WebSocket integration
- [ ] Export functionality (PDF, CSV)
- [ ] Mobile responsive design
- [ ] Loading and error states
- [ ] Accessibility improvements

---

**This completes the Dashboard Features specification. Refer to `FRONTEND_PAGES.md` for page-level details.**
