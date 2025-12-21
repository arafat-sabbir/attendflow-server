# AttendFlow Frontend Application - User Portal Specification

> **Note**: This document covers the **user-facing frontend application** for viewing, interacting, and consuming information. For management/CRUD operations, see `DASHBOARD_FEATURES.md`.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Public Pages](#public-pages)
3. [Student Portal](#student-portal)
4. [Teacher Portal](#teacher-portal)
5. [Shared Components](#shared-components)
6. [API Integration Guide](#api-integration-guide)

---

## Overview

### Application Purpose

This is the **user-facing portal** where:

- **Students** view attendance, check-in with QR, apply for leave, view notifications
- **Teachers** view their dashboard, mark attendance, generate QR codes, approve leaves
- **Admins** view system overview (for management features, use the separate Dashboard/Admin Panel application)

### Key Principle

**View & Interact** - Not for CRUD/Management operations

### Architecture

- **3 User Roles**: Admin, Teacher, Student
- **Base API URL**: `http://localhost:5000/api/v1`
- **Authentication**: JWT tokens (access + refresh)
- **Application Type**: Read-focused with limited write operations (attendance marking, leave applications)

### Tech Stack Recommendations

- **Framework**: React.js / Next.js / Vue.js
- **State Management**: Redux Toolkit / Zustand / Pinia
- **HTTP Client**: Axios / React Query
- **UI Library**: Material-UI / Ant Design / Shadcn UI
- **Forms**: React Hook Form + Zod validation
- **QR Scanner**: react-qr-reader / html5-qrcode
- **Charts**: Recharts / Chart.js / ApexCharts
- **Date Handling**: date-fns / dayjs

---

## 🌐 Public Pages

### 1. **Landing Page** `/`

**Purpose**: Marketing + Login entry point

**Components**:

- Hero section with "Check In with QR" feature highlight
- Feature cards (QR attendance, leave management, real-time tracking)
- Call-to-action buttons → Login/Register
- Footer with links

**No API calls needed**

---

### 2. **Login Page** `/login`

**Purpose**: Authentication for all user roles

**Form Fields**:

- Email (required)
- Password (required)
- Remember Me (checkbox)
- Role selector? (optional - auto-detect from backend)

**API Endpoint**:

```
POST /api/v1/auth/login
Body: { email, password }
Response: { accessToken, refreshToken, user: { id, name, role, ... } }
```

**Success Actions**:

- Store tokens in localStorage/sessionStorage
- Redirect based on role:
  - `ADMIN` → `/admin/dashboard`
  - `TEACHER` → `/teacher/dashboard`
  - `STUDENT` → `/student/dashboard`

**UI Elements**:

- "Forgot Password?" link → `/forgot-password`
- "Don't have an account? Register" → `/register`
- Error message display

---

### 3. **Register Page** `/register`

**Purpose**: User self-registration (students/teachers)

**Form Fields**:

- Full Name (required)
- Email (required)
- Username (optional)
- Password (required, min 6 chars)
- Confirm Password
- Phone (optional)
- Date of Birth (optional)
- Role selection: Student/Teacher
- Student-specific: Student ID, Batch dropdown, Department dropdown
- Teacher-specific: Employee ID, Department dropdown

**API Endpoints**:

```
POST /api/v1/auth/register
Body: { name, email, password, role, ... }

GET /api/v1/organization/departments (fetch for dropdowns)
GET /api/v1/organization/batches (fetch for student dropdown)
```

**Success**: Redirect to login with "Account created" message

---

### 4. **Forgot Password** `/forgot-password`

**Form**: Email input

**API**:

```
POST /api/v1/auth/forgot-password
Body: { email }
```

**Success**: Show "Reset link sent to email" message

---

### 5. **Reset Password** `/reset-password?token=xxx`

**Form**: New Password, Confirm Password

**API**:

```
POST /api/v1/auth/reset-password
Body: { token, newPassword }
```

---

## 👨‍🎓 Student Portal

Base Route: `/student/*`

### Dashboard `/student/dashboard`

**Purpose**: Student home screen with overview

**Data to Display**:

1. **Profile Card**
   - Name, Student ID, Batch, Department, Semester
   - Avatar/Photo
   - Email, Phone
2. **Attendance Summary** (Cards)
   - Total Classes Attended / Total Classes
   - Attendance Percentage (with color coding: >90% green, 75-90% yellow, <75% red)
   - Monthly breakdown chart
3. **Today's Schedule** (Table/Cards)
   - Course name, Time, Room, Teacher
   - Status: Upcoming/Completed/Missed
4. **Leave Summary**
   - Pending Leaves count
   - Approved Leaves count
   - Leave Balance (Sick/Personal/Vacation)
5. **Recent Notifications** (List)
   - Last 5 notifications with timestamps
   - Unread badge count

**API Endpoints**:

```
GET /api/v1/student/dashboard/:studentId
GET /api/v1/student/:id/attendance-summary
GET /api/v1/notification?recipientId={userId}&limit=5
```

---

### My Profile `/student/profile`

**Purpose**: View and edit personal information

**Sections**:

1. **Personal Info** (Read-only mostly)
   - Student ID, Batch, Department, Semester
   - Enrollment Date, GPA, Credits
2. **Editable Fields**
   - Phone, Address, Avatar upload
3. **Account Settings**
   - Change Password button → Modal
   - Email (view only, but can verify)

**API Endpoints**:

```
GET /api/v1/student/profile/:id
PATCH /api/v1/student/profile/:id
Body: { phone, address, avatar }

POST /api/v1/auth/change-password
Body: { oldPassword, newPassword }
```

---

### QR Check-In Page `/student/qr-checkin`

**Purpose**: Scan QR code to mark attendance

**Components**:

1. **QR Scanner** (Camera access)
   - Live camera feed
   - QR detection overlay
   - "Scan QR Code to Check In" instruction
2. **Manual Code Entry** (Fallback)
   - Text input for QR code
   - Submit button
3. **Check-In History** (Recent check-ins table)
   - Course, Date/Time, Location, Status

**API Endpoints**:

```
POST /api/v1/qr/validate
Body: { code: "QR_STRING", userId: "student_id", location: "Room 201" }
Response: { isValid: true, checkIn: {...}, attendance: {...} }

GET /api/v1/qr/check-ins?userId={studentId}&limit=10
```

**Success Flow**:

- Show success animation/toast: "Check-In Successful! ✓"
- Display: Course name, Time, Location
- Update check-in history list

---

### My Attendance `/student/attendance`

**Purpose**: View detailed attendance records

**Filters**:

- Course dropdown (fetch enrolled courses)
- Date range picker (Start Date - End Date)
- Status filter: All/Present/Absent/Late/Excused

**Display**:

1. **Summary Cards** (Top)
   - Total Classes: 45
   - Present: 40 (88.9%)
   - Absent: 3
   - Late: 2
   - Excused: 0
2. **Attendance Table**
   - Columns: Date, Course, Status, Check-In Time, Check-Out Time, Notes
   - Pagination (20 per page)
   - Export to CSV button
3. **Monthly Chart**
   - Bar/Line chart showing attendance trend

**API Endpoints**:

```
GET /api/v1/student/:id/attendance?courseId=&startDate=&endDate=&status=&page=1&limit=20

GET /api/v1/student/:id/attendance-summary?courseId=
```

---

### My Courses `/student/courses`

**Purpose**: View enrolled courses

**Display**: Course Cards Grid

- Course Name, Course Code
- Teacher Name, Department
- Batch, Semester
- Credits
- Schedule (Days, Time, Room)
- Attendance %age for this course
- "View Details" button

**Course Detail Modal/Page**:

- Full course info
- Class schedule (timetable)
- Attendance history for this course
- Teacher contact

**API Endpoints**:

```
GET /api/v1/course/enrollments?studentId={id}
GET /api/v1/course/courses/:courseId
GET /api/v1/course/schedules?courseId={id}
```

---

### Leave Management `/student/leave`

**Purpose**: Apply for and manage leave requests

**Tabs**:

1. **My Leaves** (default tab)
   - Table: Leave Type, Start Date, End Date, Reason, Status, Applied Date
   - Status badges: Pending (yellow), Approved (green), Rejected (red)
   - Actions: View Details, Cancel (if pending)
2. **Apply for Leave** (form tab/modal)
   - Leave Type dropdown: Sick, Personal, Vacation, Academic, Emergency
   - Start Date (date picker)
   - End Date (date picker)
   - Reason (textarea, required)
   - Document Upload (optional, for sick leave)
   - Submit button

**API Endpoints**:

```
GET /api/v1/leave?userId={studentId}&page=1&limit=20
GET /api/v1/leave/my-leaves

POST /api/v1/student/:id/leave-request
Body: { type, startDate, endDate, reason, documents }

PATCH /api/v1/leave/:id
Body: { reason } (update before approval)

DELETE /api/v1/leave/:id (cancel leave)
```

**Leave Balance Display**:

- Sick Leave: 3/5 remaining
- Personal Leave: 2/3 remaining
- Vacation Leave: 8/10 remaining

---

### My Schedule `/student/schedule`

**Purpose**: View class timetable

**Display**: Weekly Calendar View

- Days: Monday - Sunday (columns)
- Time slots: 08:00 - 18:00 (rows)
- Color-coded course blocks showing:
  - Course Name
  - Time
  - Room
  - Teacher
- Click on course → View course details

**Filters**:

- Week navigation (Previous/Next week)
- Semester filter

**API Endpoints**:

```
GET /api/v1/course/schedules?batchId={studentBatchId}
```

---

### Notifications `/student/notifications`

**Purpose**: View all notifications

**Display**: Notification Feed

- List of notifications (card/list format)
- Each notification:
  - Title, Message
  - Type badge (In-App/Email)
  - Timestamp (relative: "2 hours ago")
  - Read/Unread status (bold if unread)
  - Click to mark as read

**Actions**:

- Mark all as read
- Delete read notifications
- Filter by type: All/In-App/Email

**API Endpoints**:

```
GET /api/v1/notification?recipientId={userId}&page=1&limit=20

PATCH /api/v1/notification/:id/read

PATCH /api/v1/notification/mark-all-read/:recipientId

DELETE /api/v1/notification/delete-all-read/:recipientId
```

---

## 👨‍🏫 Teacher Portal

Base Route: `/teacher/*`

### Dashboard `/teacher/dashboard`

**Purpose**: Teacher overview with quick stats

**Data to Display**:

1. **Profile Card**
   - Name, Employee ID, Department, Designation
   - Specialization
2. **Today's Schedule** (Cards/Timeline)
   - Course, Time, Room, Batch
   - "Start Session" button → Generate QR
   - "Mark Attendance" button
3. **Quick Stats** (Cards)
   - Total Courses Teaching: 5
   - Total Students: 180
   - Pending Leave Requests: 8
   - Classes Today: 3
4. **Recent Activity** (Feed)
   - Attendance marked for Course X
   - Leave approved for Student Y
   - New enrollment in Course Z
5. **Low Attendance Alerts** (List)
   - Students with <75% attendance
   - Course-wise average attendance

**API Endpoints**:

```
GET /api/v1/teacher/:teacherId/dashboard
GET /api/v1/teacher/:teacherId/schedules/today
GET /api/v1/teacher/:teacherId/leaves/pending?limit=5
```

---

### My Profile `/teacher/profile`

**Sections**:

1. Personal Info (editable)
   - Designation, Specialization, Phone, Address
2. Teaching Info (read-only)
   - Employee ID, Department, Join Date
3. Account Settings
   - Change Password

**API Endpoints**:

```
GET /api/v1/teacher/:teacherId
PATCH /api/v1/teacher/:teacherId
```

---

### My Courses `/teacher/courses`

**Purpose**: View courses I teach

**Display**: Course Cards

- Course Name, Code, Batch, Semester
- Enrolled Students count
- Average Attendance %
- Schedule (days/times)
- Actions:
  - View Students
  - Mark Attendance
  - Generate QR
  - View Attendance Report

**API Endpoints**:

```
GET /api/v1/course/courses?teacherId={id}
GET /api/v1/course/enrollments?courseId={id}
```

---

### Mark Attendance `/teacher/attendance/mark`

**Purpose**: Manually mark attendance for a class

**Flow**:

1. **Select Session**
   - Course dropdown
   - Date picker (default today)
   - Session time (if multiple classes same day)
2. **Student List** (Table with checkboxes)
   - Columns: Student ID, Name, Photo, Attendance Status Radio (Present/Absent/Late/Excused)
   - "Select All Present" button
   - Search/Filter students
3. **Bulk Actions**
   - Mark All Present
   - Mark All Absent
   - Save button

**API Endpoints**:

```
GET /api/v1/course/enrollments?courseId={id} (get student list)

POST /api/v1/teacher/:teacherId/attendance/mark
Body: { courseId, date, studentId, status }

POST /api/v1/teacher/:teacherId/attendance/bulk
Body: { courseId, date, attendances: [{userId, status}, ...] }
```

---

### View Attendance `/teacher/attendance/view`

**Purpose**: View attendance records for courses

**Filters**:

- My Courses dropdown
- Batch filter
- Date range
- Student search

**Display**:

1. **Summary Cards**
   - Total Classes Held
   - Average Attendance %
   - Students with <75% attendance
2. **Attendance Table**
   - Columns: Student Name, ID, Total Classes, Present, Absent, Late, Percentage
   - Color-coded percentages
   - Click row → Student detailed attendance
3. **Session-wise View** (Toggle)
   - Date, Total Students, Present, Absent, Late

**API Endpoints**:

```
GET /api/v1/teacher/:teacherId/courses/:courseId/attendance?startDate=&endDate=

GET /api/v1/teacher/:teacherId/courses/:courseId/attendance/summary
```

---

### Generate QR Code `/teacher/qr/generate`

**Purpose**: Generate QR for students to scan

**Form**:

- Course selection dropdown
- Valid From (datetime, default now)
- Valid Until (datetime, default now + 30 mins)
- Max Uses (number, default 100)
- Location (text, e.g., "Room 201")
- Description (optional)

**Generated QR Display**:

- Large QR code image
- QR Details: Course, Valid until, Max uses
- "Download QR" button (PNG/PDF)
- "Copy QR Code URL" button
- Active QR list (previously generated, active ones)

**API Endpoints**:

```
POST /api/v1/qr/generate
Body: { courseId, teacherId, validFrom, validUntil, maxUses, location }
Response: { id, code, ... }

GET /api/v1/qr?teacherId={id}&status=ACTIVE
```

---

### Leave Requests Management `/teacher/leave/manage`

**Purpose**: Approve/reject student leave requests

**Tabs**:

1. **Pending Requests** (default)
   - Table: Student Name, ID, Leave Type, Dates, Reason, Applied Date
   - Actions: Approve, Reject buttons
2. **Processed Requests**
   - Approved/Rejected leaves history
   - Filter by status

**Approve/Reject Modal**:

- Display leave details
- Rejection reason textarea (if rejecting)
- Confirm button

**API Endpoints**:

```
GET /api/v1/teacher/:teacherId/leaves/pending

PATCH /api/v1/leave/:id/approve
Body: { approvedBy: teacherId }

PATCH /api/v1/leave/:id/reject
Body: { approvedBy: teacherId, rejectionReason: "..." }

GET /api/v1/teacher/:teacherId/leaves/processed
```

**Bulk Actions**:

```
POST /api/v1/leave/bulk-approve
Body: { leaveIds: [...], approvedBy }

POST /api/v1/leave/bulk-reject
Body: { leaveIds: [...], approvedBy, rejectionReason }
```

---

### My Schedule `/teacher/schedule`

**Purpose**: View teaching timetable

**Display**: Weekly Calendar

- Same as student view, but shows courses I teach
- Each slot shows: Course, Batch, Room
- Click → View course details

**API Endpoints**:

```
GET /api/v1/teacher/:teacherId/schedules
```

> **Note**: For schedule management (add/edit/delete schedules), use the Dashboard/Admin Panel application.

---

### My Subjects `/teacher/subjects`

**Purpose**: View subjects I teach (read-only)

**Display**: Subject list with details

**API Endpoints**:

```
GET /api/v1/teacher/subjects?teacherId={id}
GET /api/v1/teacher/subjects/:subjectId
```

---

### Notifications `/teacher/notifications`

Same as student notifications page

**API**: `/api/v1/notification` endpoints

---

## 👨‍💼 Admin View (Read-Only Overview)

> **⚠️ Important**: Admin management features (User Management, Department Management, Course Management, etc.) are in the separate **Dashboard/Admin Panel** application. See `DASHBOARD_FEATURES.md`.

Base Route: `/admin/*`

### Dashboard `/admin/dashboard`

**Purpose**: System-wide overview for quick monitoring (read-only)

1. **Overview Statistics** (4-5 cards)

   - Total Users (students, teachers, admins)
   - Total Active Courses
   - Overall Attendance Percentage
   - Pending Leave Requests
   - System Health Status

2. **Attendance Trends** (Chart)

   - Line chart showing daily/weekly attendance trends
   - Color-coded: Present (green), Absent (red), Late (orange)

3. **Recent Activity Feed**

   - New registrations
   - Attendance marked
   - Leaves approved/rejected
   - Courses created
   - Timestamps

4. **Quick Stats Grid**

   - Low Attendance Alerts (count)
   - Classes Held Today
   - QR Codes Generated Today
   - Notifications Sent Today

5. **Action Button**
   - "Open Admin Panel" → Redirects to Dashboard/Admin Panel application for management tasks

**API Endpoints**:

```
GET /api/v1/dashboard/overview?startDate=&endDate=&departmentId=&batchId=
GET /api/v1/dashboard/alerts?threshold=75
```

**See `DASHBOARD_FEATURES.md` for complete dashboard analytics and all management features.**

---

### My Profile `/admin/profile`

**Sections**:

1. Personal Info (editable)
   - Name, Email, Phone, Address
2. Account Settings
   - Change Password

**API Endpoints**:

```
GET /api/v1/auth/profile
PATCH /api/v1/auth/profile
POST /api/v1/auth/change-password
```

---

### Notifications `/admin/notifications`

**Purpose**: View all system notifications

**Display**: Same as student/teacher notifications page

**API Endpoints**:

```
GET /api/v1/notification?recipientId={userId}&page=1&limit=20
PATCH /api/v1/notification/:id/read
PATCH /api/v1/notification/mark-all-read/:recipientId
DELETE /api/v1/notification/delete-all-read/:recipientId
```

---

### 🔗 Link to Admin Panel

**Important**: For all management operations, admin users should use the separate **Dashboard/Admin Panel** application:

**Management Features Available in Dashboard App**:

- ✅ User Management (Create, Edit, Delete, Role/Status changes)
- ✅ Student Management (CRUD, bulk operations)
- ✅ Teacher Management (CRUD, performance tracking)
- ✅ Department Management (CRUD, statistics)
- ✅ Batch Management (CRUD, activation)
- ✅ Subject Management (CRUD)
- ✅ Semester Management (CRUD)
- ✅ Course Management (CRUD, enrollments)
- ✅ Enrollment Management (Bulk enroll, CSV upload)
- ✅ Schedule Management (Timetable, conflict detection)
- ✅ System-wide Attendance Management
- ✅ System-wide Leave Management
- ✅ QR Code Management (Monitor, expire, statistics)
- ✅ Notification Management (Send bulk, templates)
- ✅ Reports Generation (Attendance, Leave, User reports)
- ✅ System Settings (Configuration, policies)

**See `DASHBOARD_FEATURES.md` for complete specifications of all management features.**

---

## 🔄 Shared Components

### Layout Components

1. **AppLayout** (Wrapper for all pages)
   - Sidebar navigation (role-based menu)
   - Top navbar (user profile dropdown, notifications icon, logout)
   - Breadcrumbs
   - Footer
2. **Sidebar Navigation** (Role-based menu items)
   - **Student**: Dashboard, Profile, QR Check-In, Attendance, Courses, Leave, Schedule, Notifications
   - **Teacher**: Dashboard, Profile, Courses, Mark Attendance, View Attendance, Generate QR, Leave Management, Schedule, Notifications
   - **Admin**: Dashboard, Profile, Notifications, [Open Admin Panel button]
3. **TopNavbar**
   - Institute logo/name
   - Search bar (global search)
   - Notifications bell icon (with unread badge)
   - User avatar dropdown:
     - Profile
     - Settings
     - Change Password
     - Logout

---

### UI Components

1. **DataTable** (Reusable table component)
   - Props: columns, data, pagination, filters, actions
   - Features: Sort, filter, search, export, bulk actions
2. **StatCard** (Dashboard stat cards)
   - Props: title, value, icon, color, change percentage
3. **AttendanceChart** (Charts for attendance data)
   - Line chart, bar chart, pie chart
4. **QRScanner** (QR code scanner component)
   - Camera integration
   - Manual input fallback
5. **DateRangePicker** (Date range selection)
6. **FilterPanel** (Sidebar filters)
7. **NotificationCard** (Notification item)
8. **CourseCard** (Course display card)
9. **ConfirmDialog** (Confirmation modals)
10. **LoadingSpinner** (Loading states)

11. **ErrorBoundary** (Error handling)

12. **Toast/Snackbar** (Success/error messages)

---

## 🔗 API Integration Guide

### Authentication Flow

1. **Login**:

   ```js
   const login = async (email, password) => {
     const response = await axios.post('/api/v1/auth/login', { email, password });
     // Store tokens
     localStorage.setItem('accessToken', response.data.accessToken);
     localStorage.setItem('refreshToken', response.data.refreshToken);
     localStorage.setItem('user', JSON.stringify(response.data.user));
     // Redirect based on role
   };
   ```

2. **Axios Interceptor** (Add token to all requests):

   ```js
   axios.interceptors.request.use(
     (config) => {
       const token = localStorage.getItem('accessToken');
       if (token) {
         config.headers.Authorization = `Bearer ${token}`;
       }
       return config;
     },
     (error) => Promise.reject(error)
   );
   ```

3. **Token Refresh** (On 401 errors):

   ```js
   axios.interceptors.response.use(
     (response) => response,
     async (error) => {
       if (error.response?.status === 401) {
         const refreshToken = localStorage.getItem('refreshToken');
         try {
           const response = await axios.post('/api/v1/auth/refresh-token', { refreshToken });
           localStorage.setItem('accessToken', response.data.accessToken);
           // Retry original request
           error.config.headers.Authorization = `Bearer ${response.data.accessToken}`;
           return axios.request(error.config);
         } catch {
           // Redirect to login
           localStorage.clear();
           window.location.href = '/login';
         }
       }
       return Promise.reject(error);
     }
   );
   ```

4. **Logout**:
   ```js
   const logout = async () => {
     await axios.post('/api/v1/auth/logout');
     localStorage.clear();
     window.location.href = '/login';
   };
   ```

---

### State Management Structure (Redux Toolkit Example)

**Store Slices**:

1. `authSlice` - user, tokens, isAuthenticated
2. `studentSlice` - student data, attendance, courses
3. `teacherSlice` - teacher data, courses, schedules
4. `attendanceSlice` - attendance records, stats
5. `leaveSlice` - leave requests, balance
6. `notificationSlice` - notifications, unread count
7. `courseSlice` - courses, enrollments, schedules
8. `organizationSlice` - departments, batches, semesters, subjects
9. `qrSlice` - QR codes, check-ins
10. `uiSlice` - loading states, modals, toast messages

---

### API Service Functions (Example)

```js
// services/authService.js
export const authService = {
  login: (credentials) => axios.post('/auth/login', credentials),
  register: (userData) => axios.post('/auth/register', userData),
  logout: () => axios.post('/auth/logout'),
  getProfile: () => axios.get('/auth/profile'),
  updateProfile: (data) => axios.patch('/auth/profile', data),
  changePassword: (passwords) => axios.post('/auth/change-password', passwords),
};

// services/attendanceService.js
export const attendanceService = {
  getAttendance: (params) => axios.get('/attendance', { params }),
  markAttendance: (data) => axios.post('/attendance', data),
  bulkMarkAttendance: (data) => axios.post('/attendance/bulk-mark', data),
  getStudentSummary: (userId) => axios.get(`/attendance/student/${userId}/summary`),
  getCourseSummary: (courseId) => axios.get(`/attendance/course/${courseId}/summary`),
};

// services/qrService.js
export const qrService = {
  generateQR: (data) => axios.post('/qr/generate', data),
  validateQR: (data) => axios.post('/qr/validate', data),
  getQRCodes: (params) => axios.get('/qr', { params }),
  getQRStats: () => axios.get('/qr/statistics'),
};

// ... similar services for other modules
```

---

## 📦 Recommended Project Structure

```
frontend/
├── public/
│   ├── logo.png
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── styles/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── DataTable.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── AppLayout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TopNavbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── attendance/
│   │   │   ├── AttendanceTable.jsx
│   │   │   ├── AttendanceChart.jsx
│   │   │   └── MarkAttendanceForm.jsx
│   │   ├── qr/
│   │   │   ├── QRScanner.jsx
│   │   │   └── QRCodeDisplay.jsx
│   │   └── ...
│   ├── pages/
│   │   ├── public/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── ForgotPassword.jsx
│   │   ├── student/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── QRCheckIn.jsx
│   │   │   ├── Attendance.jsx
│   │   │   ├── Courses.jsx
│   │   │   ├── Leave.jsx
│   │   │   ├── Schedule.jsx
│   │   │   └── Notifications.jsx
│   │   ├── teacher/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Courses.jsx
│   │   │   ├── MarkAttendance.jsx
│   │   │   ├── ViewAttendance.jsx
│   │   │   ├── GenerateQR.jsx
│   │   │   ├── LeaveManagement.jsx
│   │   │   ├── Schedule.jsx
│   │   │   └── Notifications.jsx
│   │   └── admin/
│   │       ├── Dashboard.jsx
│   │       ├── Users.jsx
│   │       ├── Students.jsx
│   │       ├── Teachers.jsx
│   │       ├── Departments.jsx
│   │       ├── Batches.jsx
│   │       ├── Subjects.jsx
│   │       ├── Semesters.jsx
│   │       ├── Courses.jsx
│   │       ├── Enrollments.jsx
│   │       ├── Schedules.jsx
│   │       ├── Attendance.jsx
│   │       ├── Leave.jsx
│   │       ├── QRManagement.jsx
│   │       ├── Notifications.jsx
│   │       └── Settings.jsx
│   ├── services/
│   │   ├── api.js (axios instance)
│   │   ├── authService.js
│   │   ├── attendanceService.js
│   │   ├── courseService.js
│   │   ├── leaveService.js
│   │   ├── qrService.js
│   │   ├── organizationService.js
│   │   └── ...
│   ├── store/ (Redux Toolkit)
│   │   ├── store.js
│   │   ├── slices/
│   │   │   ├── authSlice.js
│   │   │   ├── attendanceSlice.js
│   │   │   ├── courseSlice.js
│   │   │   └── ...
│   │   └── ...
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useAttendance.js
│   │   └── ...
│   ├── utils/
│   │   ├── formatDate.js
│   │   ├── validation.js
│   │   └── constants.js
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── RoleBasedRoute.jsx
│   ├── App.jsx
│   └── main.jsx
├── .env
├── package.json
└── README.md
```

---

## 🚀 Development Checklist

### Phase 1: Foundation

- [ ] Setup React/Vue project with routing
- [ ] Configure axios + API base URL
- [ ] Implement authentication (login, register, logout)
- [ ] Create protected routes with role-based access
- [ ] Design layout components (sidebar, navbar, footer)
- [ ] Setup state management (Redux/Zustand)

### Phase 2: Student Portal

- [ ] Student dashboard
- [ ] QR check-in page (with camera integration)
- [ ] Attendance viewing page
- [ ] Leave request form and management
- [ ] Course listing page
- [ ] Schedule/timetable view
- [ ] Profile page
- [ ] Notifications page

### Phase 3: Teacher Portal

- [ ] Teacher dashboard
- [ ] Course management
- [ ] Mark attendance (manual)
- [ ] Generate QR code
- [ ] View attendance reports
- [ ] Leave request approval
- [ ] Schedule management
- [ ] Profile page

### Phase 4: Admin Portal (Priority Features)

- [ ] Admin dashboard with analytics
- [ ] User management (CRUD)
- [ ] Student management
- [ ] Teacher management
- [ ] Department/Batch/Subject/Semester management
- [ ] Course management
- [ ] Enrollment management
- [ ] Class schedule management

### Phase 5: Admin Portal (Secondary Features)

- [ ] System-wide attendance viewing
- [ ] Leave management (all requests)
- [ ] QR code monitoring
- [ ] Notification sending (bulk)
- [ ] Reports generation
- [ ] Settings page

### Phase 6: Polish & Testing

- [ ] Error handling & validation
- [ ] Loading states & spinners
- [ ] Toast notifications
- [ ] Responsive design (mobile/tablet)
- [ ] Accessibility (WCAG)
- [ ] Performance optimization
- [ ] Unit tests
- [ ] E2E tests

---

## 🎨 UI/UX Recommendations

1. **Color Scheme**:

   - Primary: Blue (#1976D2) - Trust, professionalism
   - Success: Green (#4CAF50) - Present/Approved
   - Warning: Yellow/Orange (#FF9800) - Late/Pending
   - Danger: Red (#F44336) - Absent/Rejected
   - Neutral: Gray scale

2. **Attendance Status Colors**:

   - Present: Green
   - Absent: Red
   - Late: Orange
   - Excused: Blue

3. **Leave Status Colors**:

   - Pending: Yellow
   - Approved: Green
   - Rejected: Red

4. **Icons** (Use icon library like Material Icons / Font Awesome):

   - Dashboard: 📊
   - Profile: 👤
   - QR: 📱
   - Attendance: ✓
   - Leave: 📅
   - Courses: 📚
   - Schedule: 🕐
   - Notifications: 🔔

5. **Responsive Breakpoints**:
   - Mobile: < 768px
   - Tablet: 768px - 1024px
   - Desktop: > 1024px

---

## 📝 Notes

1. **QR Code Library**: Use `qrcode.react` or `react-qr-code` for generating QR codes on frontend
2. **QR Scanner**: Use `react-qr-reader` or `html5-qrcode` for scanning
3. **Charts**: Use `recharts` or `chart.js` for data visualization
4. **Date Picker**: Use `react-datepicker` or Material-UI date pickers
5. **Table**: Use `react-table` or `ag-grid` for advanced tables
6. **Forms**: Use `react-hook-form` + `zod` for form validation
7. **File Upload**: For leave documents/avatars, implement file upload with preview

---

**This completes the Frontend Pages specification. See `DASHBOARD_FEATURES.md` for detailed admin dashboard features.**
