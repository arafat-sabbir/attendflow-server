# Frontend Application (User Portal) - AI Agent Prompts

> **Project Setup**: Next.js + NextAuth + Shadcn UI + Custom Styling
> **Important**: Use ONLY colors from `global.css`, use existing custom className and CustomFormField components

---

## 🎨 Global Instructions (Apply to ALL Prompts)

### Styling Rules:

- ✅ **USE**: Colors from `global.css` (CSS variables like `hsl(var(--primary))`)
- ✅ **USE**: Existing custom className utilities from the project
- ✅ **USE**: Existing `CustomFormField` component for all form inputs
- ✅ **USE**: Shadcn UI components (Button, Card, Table, etc.)
- ❌ **DO NOT**: Hardcode any colors (no `bg-blue-500`, no hex codes)
- ❌ **DO NOT**: Install new UI libraries
- ❌ **DO NOT**: Create new form field components (use CustomFormField)

### API Integration:

- Base URL: `http://localhost:5000/api/v1`
- Use existing Axios instance from the project
- Handle loading states with Shadcn Skeleton
- Handle errors with Shadcn Toast
- Use NextAuth session for authentication

### File Structure:

```
app/
├── (auth)/
│   ├── login/
│   ├── register/
│   └── forgot-password/
├── (student)/
│   ├── dashboard/
│   ├── attendance/
│   └── ...
├── (teacher)/
│   ├── dashboard/
│   └── ...
└── (admin)/
    └── dashboard/
components/
├── shared/
├── student/
├── teacher/
└── admin/
```

---

## Prompt 1: Authentication - Login Page

### Task:

Create a complete login page with NextAuth integration.

### File to Create:

- `app/(auth)/login/page.tsx`
- `components/auth/LoginForm.tsx`

### Requirements:

1. **Form Fields** (using CustomFormField):

   - Email (type: email, required)
   - Password (type: password, required)
   - Remember Me (checkbox)

2. **Functionality**:

   - Use NextAuth `signIn()` with credentials provider
   - On success: Redirect based on role (ADMIN → `/admin/dashboard`, TEACHER → `/teacher/dashboard`, STUDENT → `/student/dashboard`)
   - Show loading state during login
   - Display error messages with Shadcn Toast

3. **UI Components**:

   - Use Shadcn Card for form container
   - Use Shadcn Button for submit
   - Use CustomFormField for inputs
   - Add "Forgot Password?" link → `/forgot-password`
   - Add "Don't have account? Register" link → `/register`

4. **Styling**:
   - Use `hsl(var(--primary))` for buttons
   - Use `hsl(var(--card))` for card background
   - Center the form on page
   - Responsive design (mobile-first)

### API Endpoint:

```typescript
// NextAuth will handle this, but for reference:
POST /api/v1/auth/login
Body: {
  "email": "student@example.com",
  "password": "password123"
}
Response: {
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "STUDENT"
    }
  }
}
```

### NextAuth Configuration:

```typescript
// app/api/auth/[...nextauth]/route.ts
// Configure credentials provider to call /api/v1/auth/login
// Store accessToken in session
```

---

## Prompt 2: Authentication - Register Page

### Task:

Create registration page with role selection and conditional fields.

### File to Create:

- `app/(auth)/register/page.tsx`
- `components/auth/RegisterForm.tsx`

### Requirements:

1. **Form Fields** (using CustomFormField):

   - Full Name (text, required)
   - Email (email, required)
   - Password (password, required, min 6 chars)
   - Confirm Password (password, required)
   - Phone (tel, optional)
   - Role Selection (dropdown: Student/Teacher)

   **If Student selected**:

   - Student ID (text, required)
   - Department (select dropdown, fetch from API)
   - Batch (select dropdown, fetch from API)

   **If Teacher selected**:

   - Employee ID (text, required)
   - Department (select dropdown)
   - Designation (text, optional)

2. **Functionality**:

   - Fetch departments and batches for dropdowns
   - Validate password match
   - Submit registration
   - On success: Show toast → redirect to `/login`

3. **UI Components**:
   - Shadcn Card container
   - Shadcn Select for dropdowns
   - CustomFormField for inputs
   - Shadcn Button

### API Endpoints:

```typescript
// 1. Register
POST /api/v1/auth/register
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "STUDENT",
  "phone": "1234567890",
  "studentId": "2024CS001",
  "batchId": "batch123",
  "departmentId": "dept123"
}
Response: {
  "success": true,
  "message": "Registration successful"
}

// 2. Get Departments
GET /api/v1/organization/departments
Response: {
  "success": true,
  "data": [
    { "id": "dept1", "name": "Computer Science", "code": "CS" },
    { "id": "dept2", "name": "Electrical Engineering", "code": "EE" }
  ]
}

// 3. Get Batches
GET /api/v1/organization/batches
Response: {
  "success": true,
  "data": [
    { "id": "batch1", "name": "CSE 2024", "year": 2024 },
    { "id": "batch2", "name": "CSE 2023", "year": 2023 }
  ]
}
```

---

## Prompt 3: Student Dashboard - Overview Page

### Task:

Create student dashboard with attendance summary, today's schedule, and leave overview.

### File to Create:

- `app/(student)/dashboard/page.tsx`
- `components/student/AttendanceSummaryCard.tsx`
- `components/student/TodaySchedule.tsx`
- `components/student/LeaveSummaryCard.tsx`
- `components/shared/StatCard.tsx`

### Requirements:

1. **Layout Sections**:

   - Profile Card (name, student ID, batch, department)
   - Attendance Summary (3 stat cards: Overall %, This Month %, Classes Missed)
   - Today's Schedule (timeline of classes)
   - Leave Summary (pending, approved counts, balance)
   - Recent Notifications (last 5)

2. **Stat Cards** (create reusable StatCard component):

   - Props: title, value, icon, color, subtitle
   - Color-code attendance: >90% (green), 75-89% (yellow), <75% (red)
   - Use Shadcn Card

3. **Today's Schedule**:

   - Show course name, time, room, teacher
   - Status badge: Upcoming (blue), Completed (green), Missed (red)
   - Use Shadcn Badge for status

4. **Leave Summary Cards**:

   - Show pending/approved/rejected counts
   - Show leave balance by type
   - Button: "Apply for Leave" → navigate to `/student/leave`

5. **Loading State**:
   - Use Shadcn Skeleton for all sections while loading

### API Endpoints:

```typescript
// 1. Student Dashboard
GET /api/v1/student/dashboard/:studentId
Response: {
  "success": true,
  "data": {
    "student": {
      "id": "stu123",
      "name": "John Doe",
      "studentId": "2024CS001",
      "batchName": "CSE 2024",
      "departmentName": "Computer Science",
      "semester": 3,
      "avatar": "https://..."
    },
    "attendanceSummary": {
      "overallPercentage": 87.5,
      "totalClasses": 120,
      "attended": 105,
      "absent": 12,
      "late": 3,
      "monthlyPercentage": 89.2
    },
    "todaySchedule": [
      {
        "courseId": "crs1",
        "courseName": "Data Structures",
        "time": "09:00 - 10:30",
        "room": "Room 201",
        "teacherName": "Dr. Smith",
        "status": "upcoming"
      }
    ],
    "leaveSummary": {
      "pending": 1,
      "approved": 2,
      "rejected": 0,
      "balance": { "sick": 3, "personal": 2, "vacation": 8 }
    }
  }
}

// 2. Recent Notifications
GET /api/v1/notification?recipientId={userId}&limit=5
Response: {
  "success": true,
  "data": [
    {
      "id": "not1",
      "title": "Attendance Alert",
      "message": "Your attendance is below 75%",
      "isRead": false,
      "createdAt": "2024-12-12T10:00:00Z"
    }
  ]
}
```

### Styling:

- Use grid layout: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`
- Use `hsl(var(--primary))` for buttons
- Use `hsl(var(--success))` for green, `hsl(var(--warning))` for yellow, `hsl(var(--destructive))` for red

---

## Prompt 4: Student QR Check-In Page

### Task:

Create QR code scanner page for attendance check-in.

### File to Create:

- `app/(student)/qr-checkin/page.tsx`
- `components/student/QRScanner.tsx`
- `components/student/CheckInHistory.tsx`

### Requirements:

1. **QR Scanner Section**:

   - Use `html5-qrcode` library (if not installed, use manual input fallback)
   - Camera permission request
   - Live camera feed with QR detection overlay
   - Instruction text: "Point camera at QR code to check in"

2. **Manual Input Fallback**:

   - Text input for QR code string
   - Submit button
   - Use CustomFormField

3. **Check-In History**:

   - Table showing last 10 check-ins
   - Columns: Course, Date/Time, Location, Status
   - Use Shadcn Table

4. **Success Modal**:
   - Show success animation/toast on successful check-in
   - Display: Course name, Time, Location
   - Use Shadcn Dialog or Toast

### API Endpoints:

```typescript
// 1. Validate QR and Check-In
POST /api/v1/qr/validate
Body: {
  "code": "QR_CODE_STRING_HERE",
  "userId": "student_user_id",
  "location": "Room 201"
}
Response: {
  "success": true,
  "data": {
    "isValid": true,
    "checkIn": {
      "id": "checkin123",
      "courseId": "crs1",
      "courseName": "Data Structures",
      "timestamp": "2024-12-12T09:15:00Z",
      "location": "Room 201"
    },
    "attendance": {
      "id": "att123",
      "status": "PRESENT"
    }
  }
}

// 2. Get Check-In History
GET /api/v1/qr/check-ins?userId={studentId}&limit=10
Response: {
  "success": true,
  "data": [
    {
      "id": "checkin1",
      "courseName": "Data Structures",
      "timestamp": "2024-12-12T09:15:00Z",
      "location": "Room 201",
      "status": "SUCCESS"
    }
  ]
}
```

### Dependencies:

```bash
npm install html5-qrcode
```

---

## Prompt 5: Student Attendance View Page

### Task:

Create attendance records page with filters and charts.

### File to Create:

- `app/(student)/attendance/page.tsx`
- `components/student/AttendanceTable.tsx`
- `components/student/AttendanceChart.tsx`
- `components/shared/FilterPanel.tsx`

### Requirements:

1. **Filter Panel**:

   - Course dropdown (fetch enrolled courses)
   - Date range picker (Shadcn Calendar)
   - Status filter: All/Present/Absent/Late/Excused
   - Apply button

2. **Summary Cards** (top section):

   - Total Classes
   - Present count (with %)
   - Absent count
   - Late count
   - Use StatCard component from Prompt 3

3. **Attendance Table**:

   - Columns: Date, Course, Status, Check-In Time, Check-Out Time, Notes
   - Status badge (color-coded)
   - Pagination (20 per page)
   - Use Shadcn Table + Pagination

4. **Monthly Chart**:

   - Line chart showing attendance trend
   - Use Recharts library
   - X-axis: Dates, Y-axis: Status count

5. **Export Button**:
   - Export to CSV
   - Use browser download API

### API Endpoints:

```typescript
// 1. Get Attendance Records
GET /api/v1/student/:id/attendance?courseId=&startDate=2024-01-01&endDate=2024-12-31&status=&page=1&limit=20
Response: {
  "success": true,
  "data": {
    "records": [
      {
        "id": "att1",
        "date": "2024-12-12",
        "courseName": "Data Structures",
        "courseCode": "CS301",
        "status": "PRESENT",
        "checkInTime": "09:15:00",
        "checkOutTime": "10:25:00",
        "notes": ""
      }
    ],
    "pagination": {
      "total": 120,
      "page": 1,
      "limit": 20,
      "totalPages": 6
    }
  }
}

// 2. Get Attendance Summary
GET /api/v1/student/:id/attendance-summary?courseId=
Response: {
  "success": true,
  "data": {
    "totalClasses": 45,
    "present": 40,
    "absent": 3,
    "late": 2,
    "excused": 0,
    "percentage": 88.9
  }
}

// 3. Get Enrolled Courses
GET /api/v1/course/enrollments?studentId={id}
Response: {
  "success": true,
  "data": [
    {
      "id": "enr1",
      "courseId": "crs1",
      "courseName": "Data Structures",
      "courseCode": "CS301"
    }
  ]
}
```

### Dependencies:

```bash
npm install recharts
```

---

## Prompt 6: Student Leave Management Page

### Task:

Create leave application and management page.

### File to Create:

- `app/(student)/leave/page.tsx`
- `components/student/LeaveApplicationForm.tsx`
- `components/student/LeaveTable.tsx`

### Requirements:

1. **Tabs** (use Shadcn Tabs):

   - Tab 1: "My Leaves" (default)
   - Tab 2: "Apply for Leave"

2. **My Leaves Tab**:

   - Table with columns: Leave Type, Start Date, End Date, Reason, Status, Applied Date, Actions
   - Status badge: Pending (yellow), Approved (green), Rejected (red)
   - Actions: View Details (modal), Cancel (if pending)
   - Use Shadcn Table + Badge

3. **Apply for Leave Tab**:

   - Form with CustomFormField:
     - Leave Type (select: Sick, Personal, Vacation, Academic, Emergency)
     - Start Date (date picker)
     - End Date (date picker)
     - Reason (textarea, required)
     - Document Upload (optional, file input)
   - Submit button
   - Show leave balance at top

4. **Leave Details Modal**:
   - Show full leave details
   - Show rejection reason (if rejected)
   - Use Shadcn Dialog

### API Endpoints:

```typescript
// 1. Get My Leaves
GET /api/v1/leave/my-leaves
Response: {
  "success": true,
  "data": [
    {
      "id": "lv1",
      "type": "SICK",
      "startDate": "2024-12-15",
      "endDate": "2024-12-17",
      "reason": "Fever and cold",
      "status": "PENDING",
      "appliedDate": "2024-12-12",
      "approvedBy": null,
      "rejectionReason": null,
      "documents": ["doc1.pdf"]
    }
  ]
}

// 2. Apply for Leave
POST /api/v1/student/:id/leave-request
Body: {
  "type": "SICK",
  "startDate": "2024-12-15",
  "endDate": "2024-12-17",
  "reason": "Medical emergency",
  "documents": ["base64_or_url"]
}
Response: {
  "success": true,
  "data": {
    "id": "lv123",
    "status": "PENDING",
    "message": "Leave request submitted successfully"
  }
}

// 3. Cancel Leave
DELETE /api/v1/leave/:id
Response: {
  "success": true,
  "message": "Leave request cancelled"
}

// 4. Get Leave Balance
GET /api/v1/student/:id/leave-balance
Response: {
  "success": true,
  "data": {
    "sick": { "total": 5, "used": 2, "remaining": 3 },
    "personal": { "total": 3, "used": 1, "remaining": 2 },
    "vacation": { "total": 10, "used": 2, "remaining": 8 }
  }
}
```

---

## Prompt 7: Student My Courses Page

### Task:

Create courses overview page with enrollment details.

### File to Create:

- `app/(student)/courses/page.tsx`
- `components/student/CourseCard.tsx`
- `components/student/CourseDetailModal.tsx`

### Requirements:

1. **Course Cards Grid**:

   - Responsive grid: 1 col mobile, 2 cols tablet, 3 cols desktop
   - Each card shows:
     - Course Name + Code
     - Teacher Name
     - Department
     - Batch, Semester
     - Credits
     - My Attendance % (progress bar + color-coded)
     - Schedule (days, time, room)
   - Click card → Open detail modal
   - Use Shadcn Card

2. **Progress Bar**:

   - Use Shadcn Progress
   - Color: Green (>90%), Yellow (75-89%), Red (<75%)

3. **Course Detail Modal**:
   - Full course info
   - Class schedule table
   - My attendance history for this course
   - Teacher contact info
   - Use Shadcn Dialog

### API Endpoints:

```typescript
// 1. Get My Courses
GET /api/v1/course/enrollments?studentId={id}
Response: {
  "success": true,
  "data": [
    {
      "id": "enr1",
      "courseId": "crs1",
      "courseName": "Data Structures",
      "courseCode": "CS301",
      "credits": 3,
      "teacherName": "Dr. John Smith",
      "teacherId": "tch1",
      "departmentName": "Computer Science",
      "batchName": "CSE 2024",
      "semester": 3,
      "myAttendancePercentage": 90.5,
      "attended": 27,
      "totalClasses": 30
    }
  ]
}

// 2. Get Course Details
GET /api/v1/course/courses/:courseId
Response: {
  "success": true,
  "data": {
    "id": "crs1",
    "title": "Data Structures",
    "code": "CS301",
    "description": "Introduction to data structures...",
    "credits": 3,
    "teacher": {
      "id": "tch1",
      "name": "Dr. John Smith",
      "email": "john.smith@university.edu",
      "phone": "1234567890"
    }
  }
}

// 3. Get Course Schedule
GET /api/v1/course/schedules?courseId={id}
Response: {
  "success": true,
  "data": [
    {
      "id": "sch1",
      "dayOfWeek": 1,
      "dayName": "Monday",
      "startTime": "09:00",
      "endTime": "10:30",
      "room": "Room 201"
    }
  ]
}
```

---

## Prompt 8: Student Schedule/Timetable Page

### Task:

Create weekly schedule calendar view.

### File to Create:

- `app/(student)/schedule/page.tsx`
- `components/student/WeeklyCalendar.tsx`
- `components/student/ScheduleCard.tsx`

### Requirements:

1. **Weekly Calendar View**:

   - Table layout: Days (Mon-Sun) as columns, Time slots (8AM-6PM) as rows
   - Each class shows: Course name, Time, Room, Teacher
   - Color-coded by course (use consistent colors)
   - Click on class → Show course details popup
   - Use Shadcn Table

2. **Week Navigation**:

   - Previous/Next week buttons
   - "Today" button to jump to current week
   - Show week range: "Dec 9 - Dec 15, 2024"
   - Use Shadcn Button

3. **Mobile View**:
   - Switch to list view on mobile
   - Group by day
   - Use Shadcn Accordion for days

### API Endpoint:

```typescript
// Get My Schedule
GET /api/v1/course/schedules?batchId={studentBatchId}
Response: {
  "success": true,
  "data": [
    {
      "id": "sch1",
      "courseId": "crs1",
      "courseName": "Data Structures",
      "courseCode": "CS301",
      "teacherName": "Dr. Smith",
      "dayOfWeek": 1,
      "dayName": "Monday",
      "startTime": "09:00",
      "endTime": "10:30",
      "room": "Room 201",
      "semester": 3
    }
  ]
}
```

---

## Prompt 9: Student Notifications Page

### Task:

Create notifications list with mark as read functionality.

### File to Create:

- `app/(student)/notifications/page.tsx`
- `components/shared/NotificationCard.tsx`

### Requirements:

1. **Notification List**:

   - Each notification card shows:
     - Title (bold if unread)
     - Message (truncated, full on click)
     - Type badge (In-App/Email)
     - Timestamp (relative: "2 hours ago")
     - Unread indicator (blue dot)
   - Click notification → Mark as read + expand
   - Use Shadcn Card

2. **Filter Tabs**:

   - All / Unread / Read
   - Use Shadcn Tabs

3. **Action Buttons** (top):

   - "Mark all as read"
   - "Delete all read"
   - Use Shadcn Button

4. **Pagination**:
   - 20 notifications per page
   - Use Shadcn Pagination

### API Endpoints:

```typescript
// 1. Get Notifications
GET /api/v1/notification?recipientId={userId}&page=1&limit=20
Response: {
  "success": true,
  "data": [
    {
      "id": "not1",
      "title": "Attendance Alert",
      "message": "Your attendance in Data Structures is below 75%. Please improve.",
      "type": "IN_APP",
      "isRead": false,
      "createdAt": "2024-12-12T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 20
  }
}

// 2. Mark as Read
PATCH /api/v1/notification/:id/read
Response: {
  "success": true,
  "message": "Notification marked as read"
}

// 3. Mark All as Read
PATCH /api/v1/notification/mark-all-read/:recipientId
Response: {
  "success": true,
  "message": "All notifications marked as read"
}

// 4. Delete All Read
DELETE /api/v1/notification/delete-all-read/:recipientId
Response: {
  "success": true,
  "message": "All read notifications deleted"
}
```

---

## Prompt 10: Teacher Dashboard - Overview Page

### Task:

Create teacher dashboard with today's schedule and quick stats.

### File to Create:

- `app/(teacher)/dashboard/page.tsx`
- `components/teacher/TodayScheduleCard.tsx`
- `components/teacher/CourseOverviewCard.tsx`
- `components/teacher/PendingLeavesCard.tsx`

### Requirements:

1. **Quick Stats** (3 cards):

   - My Courses (count)
   - Total Students (count)
   - Avg Attendance %
   - Use StatCard component

2. **Today's Schedule**:

   - Timeline/cards showing classes today
   - Each class shows: Course, Time, Room, Batch, Students enrolled
   - Action buttons: "Generate QR", "Mark Attendance"
   - Status: Upcoming (blue), In Progress (green), Completed (gray)
   - Use Shadcn Card + Button

3. **My Courses Overview**:

   - Grid of course cards (3 per row)
   - Each card: Course name, Batch, Students, Avg Attendance %
   - Click → Navigate to course details
   - Use Shadcn Card

4. **Pending Leave Requests**:
   - Table showing pending leaves (max 5)
   - Columns: Student, Leave Type, Dates, Reason
   - Quick actions: Approve, Reject
   - "View All" button → navigate to `/teacher/leave`
   - Use Shadcn Table

### API Endpoint:

```typescript
GET /api/v1/teacher/:teacherId/dashboard?startDate=&endDate=
Response: {
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
        "courseId": "crs1",
        "courseName": "Data Structures",
        "batchName": "CSE 2024",
        "startTime": "09:00",
        "endTime": "10:30",
        "room": "Room 201",
        "studentsEnrolled": 45,
        "hasQRCode": true,
        "attendanceMarked": false
      }
    ],
    "courses": [
      {
        "courseId": "crs1",
        "courseName": "Data Structures",
        "batchName": "CSE 2024",
        "studentsEnrolled": 45,
        "avgAttendance": 87.5,
        "classesHeld": 28,
        "nextClass": "2024-12-16T09:00:00Z"
      }
    ],
    "pendingLeaves": [
      {
        "leaveId": "lv1",
        "studentName": "John Doe",
        "studentId": "STU001",
        "type": "SICK",
        "startDate": "2024-12-20",
        "endDate": "2024-12-22",
        "reason": "Fever",
        "appliedDate": "2024-12-15"
      }
    ]
  }
}
```

---

## Prompt 11: Teacher Mark Attendance Page

### Task:

Create attendance marking page with student list and bulk actions.

### File to Create:

- `app/(teacher)/mark-attendance/page.tsx`
- `components/teacher/AttendanceForm.tsx`
- `components/teacher/StudentListTable.tsx`

### Requirements:

1. **Session Selection** (top form):

   - Course dropdown (my courses)
   - Date picker (default: today)
   - Session time (if multiple classes same day)
   - Use CustomFormField + Shadcn Select

2. **Student List Table**:

   - Columns: Photo, Student ID, Name, Attendance Status (radio buttons)
   - Status options: Present, Absent, Late, Excused
   - Search bar to filter students
   - Use Shadcn Table + RadioGroup

3. **Bulk Actions** (top buttons):

   - "Mark All Present"
   - "Mark All Absent"
   - "Save Attendance"
   - Use Shadcn Button

4. **Loading & Success**:
   - Loading state during save
   - Success toast on save
   - Use Shadcn Toast + Skeleton

### API Endpoints:

```typescript
// 1. Get Course Enrollments (students)
GET /api/v1/course/enrollments?courseId={id}
Response: {
  "success": true,
  "data": [
    {
      "id": "enr1",
      "studentId": "stu1",
      "userId": "user1",
      "studentName": "John Doe",
      "studentIdNumber": "2024CS001",
      "avatar": "https://..."
    }
  ]
}

// 2. Mark Single Attendance
POST /api/v1/teacher/:teacherId/attendance/mark
Body: {
  "courseId": "crs1",
  "date": "2024-12-12",
  "studentId": "user1",
  "status": "PRESENT"
}
Response: {
  "success": true,
  "data": {
    "id": "att123",
    "status": "PRESENT"
  }
}

// 3. Bulk Mark Attendance
POST /api/v1/teacher/:teacherId/attendance/bulk
Body: {
  "courseId": "crs1",
  "date": "2024-12-12",
  "attendances": [
    { "userId": "user1", "status": "PRESENT" },
    { "userId": "user2", "status": "ABSENT" },
    { "userId": "user3", "status": "LATE" }
  ]
}
Response: {
  "success": true,
  "data": {
    "marked": 3,
    "failed": 0
  }
}
```

---

## Prompt 12: Teacher Generate QR Code Page

### Task:

Create QR code generation page with preview and active QR list.

### File to Create:

- `app/(teacher)/generate-qr/page.tsx`
- `components/teacher/QRGenerationForm.tsx`
- `components/teacher/ActiveQRList.tsx`

### Requirements:

1. **QR Generation Form**:

   - Course selection (dropdown)
   - Valid From (datetime-local input, default: now)
   - Valid Until (datetime-local input, default: now + 30 mins)
   - Max Uses (number input, default: 100)
   - Location (text input, e.g., "Room 201")
   - Description (textarea, optional)
   - "Generate QR" button
   - Use CustomFormField

2. **Generated QR Display**:

   - Large QR code image (use `qrcode.react` library)
   - QR Details: Course, Valid until, Max uses, Location
   - Action buttons: "Download PNG", "Copy Code"
   - Use Shadcn Card + Dialog

3. **Active QR Codes List**:
   - Table showing previously generated active QRs
   - Columns: Course, Created At, Valid Until, Uses (current/max), Status, Actions
   - Actions: View QR, Expire Now, Delete
   - Use Shadcn Table

### API Endpoints:

```typescript
// 1. Generate QR
POST /api/v1/qr/generate
Body: {
  "courseId": "crs1",
  "teacherId": "tch1",
  "validFrom": "2024-12-12T09:00:00Z",
  "validUntil": "2024-12-12T09:30:00Z",
  "maxUses": 100,
  "location": "Room 201",
  "description": "Morning class"
}
Response: {
  "success": true,
  "data": {
    "id": "qr123",
    "code": "QR_CODE_STRING_HERE",
    "courseId": "crs1",
    "courseName": "Data Structures",
    "validFrom": "2024-12-12T09:00:00Z",
    "validUntil": "2024-12-12T09:30:00Z",
    "maxUses": 100,
    "currentUses": 0,
    "location": "Room 201",
    "status": "ACTIVE"
  }
}

// 2. Get My Active QR Codes
GET /api/v1/qr?teacherId={id}&status=ACTIVE
Response: {
  "success": true,
  "data": [
    {
      "id": "qr123",
      "code": "QR_CODE_STRING",
      "courseName": "Data Structures",
      "createdAt": "2024-12-12T08:45:00Z",
      "validUntil": "2024-12-12T09:30:00Z",
      "currentUses": 23,
      "maxUses": 100,
      "status": "ACTIVE"
    }
  ]
}

// 3. Delete QR
DELETE /api/v1/qr/:id
Response: {
  "success": true,
  "message": "QR code deleted"
}
```

### Dependencies:

```bash
npm install qrcode.react
```

---

## Prompt 13: Teacher Leave Management Page

### Task:

Create leave request approval/rejection page with filters.

### File to Create:

- `app/(teacher)/leave/page.tsx`
- `components/teacher/LeaveRequestsTable.tsx`
- `components/teacher/LeaveApprovalModal.tsx`

### Requirements:

1. **Tabs** (Shadcn Tabs):

   - Pending Requests (default)
   - Processed Requests (approved/rejected)

2. **Pending Requests Table**:

   - Columns: Student Name, ID, Leave Type, Start Date, End Date, Reason (truncated), Applied Date, Actions
   - Actions: Approve, Reject buttons
   - Click Approve → Show confirmation dialog
   - Click Reject → Show modal with rejection reason textarea
   - Use Shadcn Table + Dialog

3. **Processed Requests Table**:

   - Same columns + Status column, Processed Date
   - Filter by status: All/Approved/Rejected
   - No action buttons

4. **Bulk Actions** (pending tab):
   - Select multiple leaves
   - "Bulk Approve", "Bulk Reject" buttons
   - Use Shadcn Checkbox

### API Endpoints:

```typescript
// 1. Get Pending Leaves
GET /api/v1/teacher/:teacherId/leaves/pending
Response: {
  "success": true,
  "data": [
    {
      "id": "lv1",
      "studentId": "stu1",
      "studentName": "John Doe",
      "studentIdNumber": "2024CS001",
      "type": "SICK",
      "startDate": "2024-12-20",
      "endDate": "2024-12-22",
      "reason": "Fever and cold",
      "appliedDate": "2024-12-15",
      "documents": ["doc1.pdf"]
    }
  ]
}

// 2. Approve Leave
PATCH /api/v1/leave/:id/approve
Body: {
  "approvedBy": "teacher_user_id"
}
Response: {
  "success": true,
  "message": "Leave approved successfully"
}

// 3. Reject Leave
PATCH /api/v1/leave/:id/reject
Body: {
  "approvedBy": "teacher_user_id",
  "rejectionReason": "Insufficient medical documentation"
}
Response: {
  "success": true,
  "message": "Leave rejected"
}

// 4. Bulk Approve
POST /api/v1/leave/bulk-approve
Body: {
  "leaveIds": ["lv1", "lv2", "lv3"],
  "approvedBy": "teacher_user_id"
}
Response: {
  "success": true,
  "data": {
    "approved": 3,
    "failed": 0
  }
}

// 5. Get Processed Leaves
GET /api/v1/teacher/:teacherId/leaves/processed?status=
Response: {
  "success": true,
  "data": [
    {
      "id": "lv1",
      "studentName": "John Doe",
      "type": "SICK",
      "startDate": "2024-12-20",
      "endDate": "2024-12-22",
      "status": "APPROVED",
      "processedDate": "2024-12-16T10:30:00Z",
      "approvedBy": "Dr. Smith"
    }
  ]
}
```

---

## Prompt 14: Admin Dashboard - Overview Page

### Task:

Create admin read-only dashboard with system overview and link to admin panel.

### File to Create:

- `app/(admin)/dashboard/page.tsx`
- `components/admin/SystemStatsCards.tsx`
- `components/admin/RecentActivityFeed.tsx`

### Requirements:

1. **Overview Statistics** (5 cards):

   - Total Users (with breakdown: students, teachers, admins)
   - Total Active Courses
   - Overall Attendance %
   - Pending Leave Requests
   - System Health/Active Today
   - Use StatCard component

2. **Attendance Trend Chart**:

   - Line chart showing daily/weekly attendance
   - Use Recharts
   - Color-coded lines: Present (green), Absent (red), Late (yellow)

3. **Recent Activity Feed**:

   - List of recent system activities
   - Types: User registered, Attendance marked, Leave approved, Course created
   - Show timestamp (relative)
   - Max 10 activities
   - Use Shadcn Card

4. **Quick Stats Grid**:

   - Low Attendance Alerts (count with icon)
   - Classes Held Today
   - QR Codes Generated Today
   - Notifications Sent Today

5. **Action Button** (prominent):
   - "Open Admin Panel" button → Link to Dashboard App
   - Use Shadcn Button (primary, large)

### API Endpoint:

```typescript
GET /api/v1/dashboard/overview?startDate=&endDate=
Response: {
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
      "lateToday": 15,
      "trends": [
        { "date": "2024-12-01", "present": 850, "absent": 80, "late": 20 },
        { "date": "2024-12-02", "present": 870, "absent": 60, "late": 15 }
      ]
    },
    "leaves": {
      "pending": 23,
      "approvedThisMonth": 156,
      "rejectedThisMonth": 8
    },
    "recentActivity": [
      {
        "id": "act1",
        "type": "USER_REGISTERED",
        "description": "John Doe registered as Student",
        "timestamp": "2024-12-12T10:00:00Z"
      },
      {
        "id": "act2",
        "type": "ATTENDANCE_MARKED",
        "description": "Dr. Smith marked attendance for Data Structures (32/35 present)",
        "timestamp": "2024-12-12T09:30:00Z"
      }
    ]
  }
}
```

---

## Prompt 15: Shared Components - Layout & Navigation

### Task:

Create app layout with sidebar navigation and top navbar.

### File to Create:

- `components/layout/AppLayout.tsx`
- `components/layout/Sidebar.tsx`
- `components/layout/TopNavbar.tsx`
- `components/layout/MobileNav.tsx`

### Requirements:

1. **AppLayout** (wrapper for all authenticated pages):

   - Two-column layout: Sidebar (left) + Main content (right)
   - Responsive: Sidebar hidden on mobile, hamburger menu
   - Use Shadcn Sheet for mobile menu

2. **Sidebar**:

   - Logo/Institute name at top
   - Role-based navigation menu:
     - **Student**: Dashboard, QR Check-In, Attendance, Courses, Leave, Schedule, Notifications
     - **Teacher**: Dashboard, My Courses, Mark Attendance, Generate QR, Leave Management, Schedule, Notifications
     - **Admin**: Dashboard, Notifications, "Open Admin Panel" button
   - Active route highlighting
   - Use custom colors from global.css

3. **TopNavbar**:

   - Left: Menu toggle (mobile), Breadcrumbs
   - Right: Search bar (optional), Notifications bell (with unread badge), User avatar dropdown
   - User Dropdown: Profile, Settings, Change Password, Logout
   - Use Shadcn DropdownMenu + Badge

4. **Notifications Bell**:

   - Show unread count badge
   - Click → Dropdown with last 5 notifications
   - "View All" link → `/notifications`
   - Use Shadcn DropdownMenu + Badge

5. **Mobile Navigation**:
   - Hamburger menu icon
   - Slide-in sidebar
   - Use Shadcn Sheet

### Styling:

- Sidebar background: `hsl(var(--card))`
- Active route: `hsl(var(--primary))` background
- Use `hsl(var(--foreground))` for text

---

## 🎯 Final Checklist

After completing all prompts:

- [ ] All pages use colors from `global.css` only
- [ ] All forms use `CustomFormField` component
- [ ] All API calls use existing Axios instance
- [ ] Loading states use Shadcn Skeleton
- [ ] Error handling with Shadcn Toast
- [ ] NextAuth session management implemented
- [ ] Responsive design (mobile-first)
- [ ] Proper TypeScript types for all API responses
- [ ] Accessibility (ARIA labels, keyboard navigation)
- [ ] SEO (page titles, meta tags)

---

**Total Prompts: 15**
**Estimated Development Time: 2-3 weeks** (assuming 1 prompt per day)
