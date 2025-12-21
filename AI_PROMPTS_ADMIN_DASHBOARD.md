# AI Agent Prompts: AttendFlow Admin Dashboard (Management Panel)

> **Project:** Next.js 14+ with App Router + NextAuth + Shadcn UI + TailwindCSS + Recharts
>
> **Critical Rules:**
>
> - ✅ **ONLY** use colors from `global.css` CSS variables (e.g., `hsl(var(--primary))`)
> - ✅ Use existing `CustomFormField` component for ALL form inputs
> - ✅ Use Shadcn UI components exclusively (Button, Card, Table, Select, Dialog, etc.)
> - ✅ Use existing custom className utilities from the project
> - ✅ Use Recharts for all charts and data visualizations
> - ❌ **NEVER** hardcode colors (no `bg-blue-500`, no hex codes like `#3B82F6`)
> - ❌ **NEVER** install new UI libraries (no Chart.js, no ApexCharts)
> - ❌ **NEVER** create custom form components

**Base API URL:** `http://localhost:5000/api/v1`

---

## PROMPT 1: Admin Dashboard - Overview & Analytics

### Task

Create comprehensive admin dashboard with system-wide statistics, charts, and real-time insights.

### Files to Create

- `app/(admin)/dashboard/page.tsx`
- `components/admin/OverviewStats.tsx`
- `components/admin/AttendanceTrendChart.tsx`
- `components/admin/LowAttendanceAlert.tsx`
- `components/admin/RecentActivityFeed.tsx`

### Requirements

**1. Page Layout:**

```
┌────────────────────────────────────────────────┐
│  Filters: [Date Range] [Department] [Batch]   │
├────────────────────────────────────────────────┤
│  4 Overview Stat Cards (row)                   │
├─────────────────┬──────────────────────────────┤
│  Attendance     │  Leave Statistics            │
│  Trend Chart    │  (Pie Chart)                 │
├─────────────────┴──────────────────────────────┤
│  Low Attendance Alert Table                    │
├──────────────────┬─────────────────────────────┤
│  Recent Activity │  Quick Actions              │
└──────────────────┴─────────────────────────────┘
```

**2. Global Filters (Top Section):**

- Date Range Picker (Shadcn `Popover` + `Calendar`)
- Department Dropdown (Shadcn `Select`, with "All Departments")
- Batch Dropdown (Shadcn `Select`, with "All Batches")
- "Refresh" button with loading state
- All sections update when filters change

**3. Overview Stat Cards (4 cards in row):**

**Card 1: Total Users**

- Icon: UserIcon from Shadcn icons
- Primary: Total count (large number)
- Breakdown: Students, Teachers, Admins (smaller text)
- Trend: "↑ 5% from last month" (with up/down arrow)
- Click → Navigate to `/admin/users`

**Card 2: Active Courses**

- Icon: BookIcon
- Primary: Active courses / Total courses
- Secondary: Average enrollment per course
- Click → Navigate to `/admin/courses`

**Card 3: Attendance Rate**

- Icon: CheckCircleIcon
- Primary: Overall percentage (large, color-coded)
- Color coding:
  - ≥90%: `text-green-600 dark:text-green-400`
  - 75-89%: `text-yellow-600 dark:text-yellow-400`
  - <75%: `text-red-600 dark:text-red-400`
- Secondary: Today's present/absent/late counts
- Trend: Comparison with last week

**Card 4: Leave Requests**

- Icon: CalendarIcon
- Primary: Pending count (large, with badge)
- Secondary: Approved this month, Rejected this month
- Click → Navigate to `/admin/leaves`

**4. Attendance Trend Chart (Left side, col-span-2):**

- Use Recharts `LineChart`
- X-axis: Dates (last 30 days)
- Y-axis: Attendance percentage
- Multiple lines:
  - Overall attendance (primary color)
  - By department (different colors, optional toggle)
- Tooltip showing exact values
- Legend
- Responsive design

**5. Leave Statistics (Right side, col-span-1):**

- Use Recharts `PieChart`
- Segments: Sick, Personal, Emergency, Vacation
- Legend with counts
- Center text showing total leaves
- Colors from global.css variables

**6. Low Attendance Alert Table:**

- Shadcn `Table` component
- Columns: Student Name, Student ID, Batch, Percentage, Action
- Show students with < 75% attendance
- Sort by percentage (ascending)
- Limit to 10 rows, "View All" button
- Action: "Send Reminder" button per student
- Empty state if no alerts

**7. Recent Activity Feed:**

- List of recent activities (last 20)
- Show: Icon, Activity text, Timestamp (relative)
- Examples:
  - "New student registered: John Doe"
  - "Attendance marked for CS201"
  - "Leave approved for Jane Smith"
- Auto-refresh every 30 seconds
- "View All" link

**8. Quick Actions (Right side):**

- Button grid:
  - "Add User" → `/admin/users/create`
  - "Create Course" → `/admin/courses/create`
  - "Generate Report" → `/admin/reports`
  - "Manage Departments" → `/admin/organization/departments`
- Use Shadcn `Button` with icons

### API Endpoints

**GET** `/api/v1/dashboard/overview?startDate=2024-12-01&endDate=2024-12-31&departmentId=&batchId=`

Response:

```json
{
  "success": true,
  "data": {
    "users": {
      "total": 1250,
      "students": 1000,
      "teachers": 45,
      "admins": 5,
      "activeToday": 850,
      "trend": "+5%"
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
      "trend": "-1.2%"
    },
    "leaves": {
      "pending": 23,
      "approvedThisMonth": 156,
      "rejectedThisMonth": 8
    },
    "attendanceTrend": [
      {
        "date": "2024-12-01",
        "percentage": 88,
        "present": 800,
        "absent": 80
      }
    ],
    "leavesByType": [
      {
        "type": "SICK",
        "count": 120,
        "percentage": 45
      },
      {
        "type": "PERSONAL",
        "count": 80,
        "percentage": 30
      }
    ],
    "lowAttendanceStudents": [
      {
        "studentId": "student_1",
        "studentName": "John Doe",
        "studentIdNumber": "ST2024001",
        "batch": "CS 2024-A",
        "percentage": 68,
        "totalClasses": 40,
        "attended": 27
      }
    ],
    "recentActivities": [
      {
        "id": "activity_1",
        "type": "USER_REGISTERED",
        "message": "New student registered: John Doe",
        "timestamp": "2024-12-12T10:30:00Z"
      }
    ]
  }
}
```

**POST** `/api/v1/notification/send-reminder`

Request:

```json
{
  "studentIds": ["student_1"],
  "message": "Your attendance is below 75%. Please improve.",
  "type": "ATTENDANCE_REMINDER"
}
```

### Styling Rules

- Use Shadcn grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`
- Stat cards: `bg-card border-border hover:shadow-lg transition-shadow`
- Charts: `bg-card rounded-lg border-border p-6`
- All colors from global.css variables

---

## PROMPT 2: User Management - List, Search & Filter

### Task

Create comprehensive user management page with advanced filtering, search, and bulk actions.

### Files to Create

- `app/(admin)/users/page.tsx`
- `components/admin/UsersTable.tsx`
- `components/admin/UserFilters.tsx`
- `components/admin/BulkUserActions.tsx`

### Requirements

**1. Page Header:**

- Title: "User Management"
- "Add New User" button (primary) → `/admin/users/create`
- "Import Users" button (secondary) → bulk upload
- "Export Users" button → download CSV

**2. Filter Section:**

- Search input (search by name, email, username)
- Role filter (multi-select: All, Student, Teacher, Admin)
- Status filter (Active, Inactive, All)
- Department filter (dropdown)
- Batch filter (dropdown, for students)
- Date registered range
- "Apply Filters" and "Clear Filters" buttons

**3. Users Table (Shadcn `Table`):**

- Columns:
  - Checkbox (for bulk selection)
  - Avatar + Name
  - Email
  - Username
  - Role (badge with colors)
  - Status (badge: Active=green, Inactive=red)
  - Department
  - Joined Date
  - Actions (dropdown menu)
- Sortable columns (name, email, role, joined date)
- Pagination (Shadcn `Pagination`)
- Items per page selector: 10, 25, 50, 100

**4. Row Actions (Dropdown Menu):**

- View Profile → `/admin/users/:id`
- Edit → `/admin/users/:id/edit`
- Change Role → opens dialog
- Change Status (Activate/Deactivate)
- Reset Password → sends reset email
- Delete → confirmation dialog

**5. Bulk Actions (when rows selected):**

- Show action bar at top of table
- Actions:
  - Change Status (Activate/Deactivate)
  - Change Role
  - Delete Selected
  - Export Selected
- Confirmation dialogs for destructive actions

**6. Empty State:**

- Show when no users found
- Message with "Add User" button

**7. Loading States:**

- Shadcn `Skeleton` for table rows
- Loading spinner on filters apply

### API Endpoints

**GET** `/api/v1/user?page=1&limit=10&role=STUDENT&status=ACTIVE&search=john&departmentId=dept_1&batchId=batch_1&sortBy=name&sortOrder=asc`

Response:

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_123",
        "name": "John Doe",
        "email": "john@example.com",
        "username": "johndoe",
        "role": "STUDENT",
        "status": "ACTIVE",
        "avatar": "https://example.com/avatar.jpg",
        "phone": "+1234567890",
        "department": {
          "id": "dept_1",
          "name": "Computer Science"
        },
        "batch": {
          "id": "batch_1",
          "name": "CS 2024-A"
        },
        "createdAt": "2024-01-15T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1000,
      "totalPages": 100
    }
  }
}
```

**PATCH** `/api/v1/user/bulk/status`

Request:

```json
{
  "userIds": ["user_1", "user_2", "user_3"],
  "status": "INACTIVE"
}
```

**DELETE** `/api/v1/user/bulk-delete`

Request:

```json
{
  "userIds": ["user_1", "user_2"]
}
```

---

## PROMPT 3: User Management - Create New User

### Task

Create comprehensive user creation form with role-specific fields and validation.

### Files to Create

- `app/(admin)/users/create/page.tsx`
- `components/admin/CreateUserForm.tsx`

### Requirements

**1. Form Sections:**

**Basic Information:**

- Name (required, `CustomFormField`)
- Email (required, unique validation)
- Username (required, unique validation)
- Password (required, min 6 chars, auto-generate option)
- Phone (optional, format validation)
- Date of Birth (date picker)
- Avatar Upload (file input, max 2MB)

**Role Selection:**

- Role (required, radio buttons or select: Student, Teacher, Admin)

**Conditional Fields Based on Role:**

**If Role = STUDENT:**

- Student ID (required, unique, format: ST2024XXX)
- Department (required, dropdown from API)
- Batch (required, dropdown from API)
- Semester (number, 1-8)
- GPA (decimal, 0.0-4.0, optional)
- Credits (number, optional)

**If Role = TEACHER:**

- Employee ID (required, unique, format: EMP2024XXX)
- Department (required, dropdown)
- Designation (text: Assistant Professor, Associate Professor, etc.)
- Specialization (text: Computer Science, AI, etc.)

**If Role = ADMIN:**

- Employee ID (required)
- Department (optional)

**Account Settings:**

- Status (Active/Inactive, default: Active)
- Send welcome email (checkbox, default: checked)

**2. Form Validation:**

- Real-time validation on blur
- Email format and uniqueness check
- Username availability check
- Password strength indicator
- Required field validation
- Show validation errors below fields

**3. Actions:**

- "Create User" button (primary, with loading state)
- "Create & Add Another" button (secondary)
- "Cancel" button → navigate back

**4. Success Flow:**

- Show success toast
- Option to view created user or create another
- Redirect to user list or stay on form

**5. Auto-fill Features:**

- Generate username from email (suggest)
- Generate random secure password (button)

### API Endpoints

**GET** `/api/v1/organization/departments`

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "dept_1",
      "name": "Computer Science",
      "code": "CS"
    }
  ]
}
```

**GET** `/api/v1/organization/batches?departmentId=dept_1`

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "batch_1",
      "name": "CS 2024-A",
      "year": 2024,
      "semester": 1
    }
  ]
}
```

**POST** `/api/v1/user/create-user`

Request (Student):

```json
{
  "email": "john@example.com",
  "username": "johndoe",
  "password": "SecurePass123!",
  "name": "John Doe",
  "role": "STUDENT",
  "status": "ACTIVE",
  "phone": "+1234567890",
  "address": "123 Main St",
  "dateOfBirth": "2000-01-15T00:00:00Z",
  "avatar": "base64_or_url",
  "studentId": "ST2024001",
  "batchId": "batch_1",
  "departmentId": "dept_1",
  "semester": 1,
  "gpa": 3.5,
  "credits": 30
}
```

Response:

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "STUDENT"
  }
}
```

---

## PROMPT 4: User Management - Edit User

### Task

Create user editing page with role-specific fields and change tracking.

### Files to Create

- `app/(admin)/users/[id]/edit/page.tsx`
- `components/admin/EditUserForm.tsx`

### Requirements

**1. Page Load:**

- Fetch user data by ID
- Show loading skeleton while fetching
- Pre-fill all form fields with existing data

**2. Form Layout:**

- Same layout as Create User form
- All fields editable except:
  - Email (read-only, show "Change Email" button if needed)
  - Role (show "Change Role" button separately with confirmation)
  - Student ID / Employee ID (read-only)

**3. Password Section:**

- Don't show current password
- "Reset Password" button → sends reset email
- Or "Set New Password" section (admin can set new password)

**4. Change Tracking:**

- Highlight changed fields
- Show "Unsaved Changes" warning if user tries to leave
- "Discard Changes" button to reset form

**5. Actions:**

- "Save Changes" button (primary)
- "Cancel" button
- "Delete User" button (destructive, bottom left)

**6. Role Change Dialog:**

- Separate from main form
- Show current role → new role
- Warning message: "This will change user permissions"
- Confirmation required

**7. Delete Confirmation:**

- Show Shadcn `AlertDialog`
- Warning: "This action cannot be undone"
- Type username to confirm
- "Permanently Delete" button

### API Endpoints

**GET** `/api/v1/user/:id`

Response:

```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "role": "STUDENT",
    "status": "ACTIVE",
    "phone": "+1234567890",
    "address": "123 Main St",
    "dateOfBirth": "2000-01-15T00:00:00Z",
    "avatar": "url",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-12-01T00:00:00Z",
    "student": {
      "id": "student_123",
      "studentId": "ST2024001",
      "batchId": "batch_1",
      "departmentId": "dept_1",
      "semester": 1,
      "gpa": 3.5
    }
  }
}
```

**PATCH** `/api/v1/user/:id`

Request:

```json
{
  "name": "John Updated",
  "username": "johnupdated",
  "phone": "+9876543210",
  "address": "Updated Address",
  "dateOfBirth": "2000-01-20T00:00:00Z",
  "status": "ACTIVE",
  "semester": 2,
  "gpa": 3.7
}
```

**PATCH** `/api/v1/user/:id/role`

Request:

```json
{
  "userId": "user_123",
  "role": "TEACHER"
}
```

**DELETE** `/api/v1/user/:id`

Response:

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## PROMPT 5: Course Management - List & CRUD

### Task

Create course management page with list, create, edit, delete operations.

### Files to Create

- `app/(admin)/courses/page.tsx`
- `app/(admin)/courses/create/page.tsx`
- `app/(admin)/courses/[id]/edit/page.tsx`
- `components/admin/CoursesTable.tsx`
- `components/admin/CourseForm.tsx`

### Requirements

**1. Courses List Page:**

**Header:**

- Title: "Course Management"
- "Create Course" button → `/admin/courses/create`
- "Import Courses" button (bulk upload CSV)

**Filters:**

- Search by course name/code
- Department filter
- Status filter (Active/Inactive)
- Semester filter

**Table (Shadcn `Table`):**

- Columns:
  - Course Code
  - Course Name
  - Department
  - Credits
  - Teacher(s)
  - Enrolled Students
  - Status (badge)
  - Actions
- Actions dropdown:
  - View Details → `/admin/courses/:id`
  - Edit → `/admin/courses/:id/edit`
  - Assign Teacher
  - View Enrollments
  - Delete
- Pagination

**2. Create Course Form:**

**Fields (use `CustomFormField`):**

- Course Code (required, unique, e.g., "CS201")
- Course Name (required, e.g., "Data Structures")
- Description (textarea, optional)
- Department (required, dropdown)
- Credits (required, number, 1-6)
- Semester (required, number, 1-8)
- Max Students (optional, number, default: 50)
- Teacher Assignment (multi-select dropdown)
- Status (radio: Active/Inactive, default: Active)
- Schedule (optional):
  - Day of Week (multi-select: Mon-Sun)
  - Start Time
  - End Time
  - Room Number

**Validation:**

- Unique course code
- Required fields
- Valid credit range

**Actions:**

- "Create Course" button
- "Save & Add Schedule" button
- "Cancel" button

**3. Edit Course Form:**

- Same as create form
- Pre-filled with existing data
- Additional section: "Enrolled Students" (table)
  - List of enrolled students
  - "Remove" button per student
  - "Add Students" button
- "Save Changes" button
- "Delete Course" button (with confirmation)

### API Endpoints

**GET** `/api/v1/course?page=1&limit=10&search=data&departmentId=dept_1&status=ACTIVE&semester=1`

Response:

```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "course_1",
        "code": "CS201",
        "name": "Data Structures",
        "description": "Introduction to data structures",
        "credits": 3,
        "department": {
          "id": "dept_1",
          "name": "Computer Science"
        },
        "semester": 3,
        "maxStudents": 50,
        "enrolledCount": 35,
        "teachers": [
          {
            "id": "teacher_1",
            "name": "Dr. Smith"
          }
        ],
        "status": "ACTIVE"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 120,
      "totalPages": 12
    }
  }
}
```

**POST** `/api/v1/course`

Request:

```json
{
  "code": "CS201",
  "name": "Data Structures",
  "description": "Introduction to data structures and algorithms",
  "credits": 3,
  "departmentId": "dept_1",
  "semester": 3,
  "maxStudents": 50,
  "teacherIds": ["teacher_1", "teacher_2"],
  "status": "ACTIVE"
}
```

**PATCH** `/api/v1/course/:id`

Request: (same as POST)

**DELETE** `/api/v1/course/:id`

Response:

```json
{
  "success": true,
  "message": "Course deleted successfully"
}
```

---

## PROMPT 6: Department & Batch Management

### Task

Create organization management page for departments and batches with CRUD operations.

### Files to Create

- `app/(admin)/organization/departments/page.tsx`
- `app/(admin)/organization/batches/page.tsx`
- `components/admin/DepartmentList.tsx`
- `components/admin/DepartmentForm.tsx`
- `components/admin/BatchList.tsx`
- `components/admin/BatchForm.tsx`

### Requirements

**1. Departments Management:**

**List View:**

- Shadcn `Card` grid layout (3 cards per row)
- Each card shows:
  - Department Name
  - Department Code
  - Head of Department
  - Total Teachers
  - Total Students
  - Actions (Edit, Delete)
- "Add Department" button → opens dialog

**Department Form (Dialog):**

- Department Name (required)
- Department Code (required, unique, e.g., "CS")
- Description (textarea, optional)
- Head of Department (select from teachers)
- Building/Location (text, optional)
- Actions: "Save", "Cancel"

**2. Batches Management:**

**List View:**

- Shadcn `Table`
- Columns:
  - Batch Name
  - Department
  - Year
  - Semester
  - Total Students
  - Status
  - Actions
- Filters: Department, Year, Status
- "Add Batch" button → opens dialog

**Batch Form (Dialog):**

- Batch Name (required, e.g., "CS 2024-A")
- Department (required, dropdown)
- Year (required, number, e.g., 2024)
- Semester (required, number, 1-8)
- Start Date (date picker)
- End Date (date picker)
- Status (Active/Inactive)
- Actions: "Save", "Cancel"

**3. Delete Confirmations:**

- Show warning if department has students/courses
- Option to "Reassign and Delete" or "Cancel"

### API Endpoints

**Departments:**

**GET** `/api/v1/organization/departments`

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "dept_1",
      "name": "Computer Science",
      "code": "CS",
      "description": "Department of Computer Science",
      "hodId": "teacher_1",
      "hod": {
        "name": "Dr. Smith"
      },
      "totalTeachers": 15,
      "totalStudents": 300,
      "location": "Building A"
    }
  ]
}
```

**POST** `/api/v1/organization/departments`

Request:

```json
{
  "name": "Computer Science",
  "code": "CS",
  "description": "Department of Computer Science",
  "hodId": "teacher_1",
  "location": "Building A"
}
```

**PATCH** `/api/v1/organization/departments/:id`

**DELETE** `/api/v1/organization/departments/:id`

**Batches:**

**GET** `/api/v1/organization/batches?departmentId=dept_1`

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "batch_1",
      "name": "CS 2024-A",
      "departmentId": "dept_1",
      "department": {
        "name": "Computer Science"
      },
      "year": 2024,
      "semester": 1,
      "startDate": "2024-01-01T00:00:00Z",
      "endDate": "2024-12-31T00:00:00Z",
      "totalStudents": 40,
      "status": "ACTIVE"
    }
  ]
}
```

**POST** `/api/v1/organization/batches`

Request:

```json
{
  "name": "CS 2024-A",
  "departmentId": "dept_1",
  "year": 2024,
  "semester": 1,
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-12-31T00:00:00Z",
  "status": "ACTIVE"
}
```

---

## PROMPT 7: Attendance Reports & Analytics

### Task

Create comprehensive attendance reports page with filtering, charts, and export functionality.

### Files to Create

- `app/(admin)/reports/attendance/page.tsx`
- `components/admin/AttendanceReportFilters.tsx`
- `components/admin/AttendanceReportCharts.tsx`
- `components/admin/AttendanceReportTable.tsx`

### Requirements

**1. Report Filters:**

- Report Type (dropdown):
  - Overall Summary
  - By Department
  - By Batch
  - By Course
  - By Student
  - By Teacher
- Date Range (required)
- Department (multi-select)
- Batch (multi-select)
- Course (multi-select)
- "Generate Report" button

**2. Summary Cards (4 cards):**

- Total Classes Conducted
- Average Attendance %
- Total Present
- Total Absent
- All with trend indicators

**3. Charts Section:**

**Chart 1: Attendance Trend (Line Chart - Recharts):**

- X-axis: Date
- Y-axis: Percentage
- Multiple lines: Overall, by department (if selected)
- Tooltip with details

**Chart 2: Department-wise Comparison (Bar Chart - Recharts):**

- X-axis: Department names
- Y-axis: Attendance percentage
- Color-coded bars

**Chart 3: Status Distribution (Pie Chart - Recharts):**

- Segments: Present, Absent, Late, Excused
- Show percentages and counts

**Chart 4: Top/Bottom Performers (Horizontal Bar - Recharts):**

- Top 10 students by attendance
- Bottom 10 students (if needed)

**4. Detailed Table:**

- Based on selected report type
- Sortable columns
- Pagination
- Export to CSV/PDF buttons

**5. Export Options:**

- "Export as PDF" button
- "Export as CSV" button
- "Email Report" button (opens dialog with email input)

### API Endpoints

**GET** `/api/v1/dashboard/attendance-report?reportType=overall&startDate=2024-01-01&endDate=2024-12-31&departmentIds=dept_1,dept_2&batchIds=batch_1`

Response:

```json
{
  "success": true,
  "data": {
    "summary": {
      "totalClasses": 500,
      "averagePercentage": 87.5,
      "totalPresent": 20000,
      "totalAbsent": 2500,
      "totalLate": 500
    },
    "trend": [
      {
        "date": "2024-12-01",
        "percentage": 88,
        "present": 800,
        "absent": 100
      }
    ],
    "byDepartment": [
      {
        "departmentId": "dept_1",
        "departmentName": "Computer Science",
        "percentage": 90,
        "totalClasses": 200,
        "present": 180
      }
    ],
    "statusDistribution": {
      "present": 20000,
      "absent": 2500,
      "late": 500,
      "excused": 100
    },
    "topStudents": [
      {
        "studentId": "student_1",
        "studentName": "John Doe",
        "percentage": 98,
        "totalClasses": 100,
        "attended": 98
      }
    ]
  }
}
```

---

## PROMPT 8: Leave Management - Admin View

### Task

Create comprehensive leave management page for admins to view, filter, and manage all leave requests.

### Files to Create

- `app/(admin)/leaves/page.tsx`
- `components/admin/LeavesTable.tsx`
- `components/admin/LeaveDetailsDialog.tsx`
- `components/admin/LeaveStatistics.tsx`

### Requirements

**1. Page Header:**

- Title: "Leave Management"
- Statistics cards (row):
  - Pending Leaves (with badge)
  - Approved This Month
  - Rejected This Month
  - Total Leave Days (this month)

**2. Filters:**

- Status tabs: All, Pending, Approved, Rejected
- Leave Type filter (multi-select)
- Date Range filter
- Student/Department search
- Teacher filter (approved by)

**3. Leave Table (Shadcn `Table`):**

- Columns:
  - Student Name + ID
  - Leave Type (badge with colors)
  - Date Range
  - Total Days
  - Applied Date
  - Status (badge)
  - Reviewed By (teacher name)
  - Actions
- Sortable by applied date, status
- Pagination

**4. Actions (per row):**

- View Details (opens dialog)
- Approve (if pending)
- Reject (if pending)
- Cancel (if approved and future)
- View Documents (if attached)

**5. Leave Details Dialog:**

- Student information
- Leave type and dates
- Reason (full text)
- Supporting documents (download/view)
- Review history
- Approval form (for pending):
  - Approve/Reject buttons
  - Rejection reason (if reject)

**6. Bulk Actions:**

- Select multiple pending leaves
- "Bulk Approve" button
- "Bulk Reject" button

**7. Statistics Chart:**

- Monthly leave trend (line chart)
- Leave type distribution (pie chart)
- Department-wise leave comparison (bar chart)

### API Endpoints

**GET** `/api/v1/leave?status=PENDING&leaveType=SICK&startDate=2024-01-01&endDate=2024-12-31&search=john&page=1&limit=10`

Response:

```json
{
  "success": true,
  "data": {
    "leaves": [
      {
        "id": "leave_1",
        "student": {
          "id": "student_1",
          "name": "John Doe",
          "studentId": "ST2024001",
          "department": "Computer Science",
          "batch": "CS 2024-A"
        },
        "leaveType": "SICK",
        "startDate": "2024-12-15T00:00:00Z",
        "endDate": "2024-12-17T00:00:00Z",
        "totalDays": 3,
        "reason": "Medical appointment and recovery",
        "supportingDocument": "url_to_file",
        "status": "PENDING",
        "appliedAt": "2024-12-10T10:00:00Z",
        "reviewedBy": null,
        "reviewedAt": null
      }
    ],
    "statistics": {
      "pending": 23,
      "approvedThisMonth": 156,
      "rejectedThisMonth": 8,
      "totalDaysThisMonth": 450
    },
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 200,
      "totalPages": 20
    }
  }
}
```

**PATCH** `/api/v1/leave/:leaveId/status`

Request:

```json
{
  "status": "APPROVED",
  "rejectionReason": ""
}
```

**PATCH** `/api/v1/leave/bulk-update`

Request:

```json
{
  "leaveIds": ["leave_1", "leave_2"],
  "status": "APPROVED"
}
```

---

## PROMPT 9: System Settings & Configuration

### Task

Create system settings page for configuring application-wide settings.

### Files to Create

- `app/(admin)/settings/page.tsx`
- `components/admin/GeneralSettings.tsx`
- `components/admin/AttendanceSettings.tsx`
- `components/admin/NotificationSettings.tsx`

### Requirements

**1. Settings Tabs (Shadcn `Tabs`):**

- General
- Attendance
- Notifications
- Email
- Security

**2. General Settings Tab:**

- System Name (text input)
- System Logo (file upload)
- Timezone (dropdown)
- Date Format (dropdown)
- Academic Year (start/end dates)
- Default Language (dropdown)

**3. Attendance Settings Tab:**

- QR Code Validity (slider, 5-60 minutes)
- Late Threshold (number, minutes after class start)
- Attendance Low Alert (percentage threshold)
- Auto Mark Absent (enable/disable, time after class)
- Excused Leave Auto-Approve (enable/disable)

**4. Notification Settings Tab:**

- Enable Email Notifications (toggle)
- Enable SMS Notifications (toggle)
- Notification Recipients:
  - Students (checkboxes for event types)
  - Teachers (checkboxes)
  - Admins (checkboxes)
- Event Types:
  - Attendance marked
  - Leave approved/rejected
  - Low attendance alert
  - New user registered

**5. Email Settings Tab:**

- SMTP Host
- SMTP Port
- SMTP Username
- SMTP Password (masked)
- From Email
- From Name
- Test Email button

**6. Security Settings Tab:**

- Password Policy:
  - Minimum length
  - Require uppercase
  - Require numbers
  - Require special chars
- Session Timeout (minutes)
- Max Login Attempts
- Two-Factor Authentication (enable/disable)

**7. Save Actions:**

- Each tab has "Save Changes" button
- Show success toast on save
- Validation before save

### API Endpoints

**GET** `/api/v1/settings`

Response:

```json
{
  "success": true,
  "data": {
    "general": {
      "systemName": "AttendFlow",
      "timezone": "America/New_York",
      "dateFormat": "MM/DD/YYYY",
      "academicYearStart": "2024-09-01",
      "academicYearEnd": "2025-06-30"
    },
    "attendance": {
      "qrValidityMinutes": 15,
      "lateThresholdMinutes": 10,
      "lowAttendanceThreshold": 75,
      "autoMarkAbsent": true,
      "autoMarkAbsentAfterMinutes": 30
    },
    "notifications": {
      "emailEnabled": true,
      "smsEnabled": false,
      "events": {
        "attendanceMarked": true,
        "leaveApproved": true,
        "lowAttendance": true
      }
    }
  }
}
```

**PATCH** `/api/v1/settings`

Request:

```json
{
  "general": {
    "systemName": "AttendFlow Updated"
  },
  "attendance": {
    "qrValidityMinutes": 20
  }
}
```

---

## PROMPT 10: Bulk Import - Users, Courses, Attendance

### Task

Create bulk import functionality for importing data via CSV/Excel files.

### Files to Create

- `app/(admin)/import/page.tsx`
- `components/admin/ImportWizard.tsx`
- `components/admin/FileUploader.tsx`
- `components/admin/ImportPreview.tsx`
- `components/admin/ImportResults.tsx`

### Requirements

**1. Import Type Selection:**

- Radio buttons or cards:
  - Import Users (Students/Teachers)
  - Import Courses
  - Import Attendance Records
  - Import Leave Records
- "Download Template" button (downloads CSV template)

**2. File Upload Step:**

- Drag & drop zone (Shadcn `Input` type="file")
- Accept: .csv, .xlsx
- Max file size: 10MB
- Show file name and size after upload
- "Upload" button

**3. Data Preview & Validation:**

- Show table preview (first 10 rows)
- Highlight validation errors in red
- Show validation summary:
  - Total rows
  - Valid rows
  - Rows with errors
  - Error types (missing required fields, invalid format, duplicates)
- Option to "Skip Invalid Rows" or "Fix & Retry"

**4. Column Mapping:**

- If CSV headers don't match exactly
- Dropdown mapping for each column
- Auto-detect common patterns

**5. Import Options:**

- Update existing records (if duplicate found)
- Skip duplicates
- Send welcome emails (for users)
- Dry run (preview without importing)

**6. Import Process:**

- "Start Import" button
- Progress bar showing import progress
- Real-time status updates
- Cancel button

**7. Import Results:**

- Summary:
  - Successfully imported: count
  - Failed: count
  - Skipped: count
- Detailed table of failed records with error messages
- "Download Error Report" button (CSV)
- "Import Another File" button
- "View Imported Data" button

### API Endpoints

**POST** `/api/v1/import/validate`

Request (multipart/form-data):

```
file: uploaded_file.csv
type: "users" | "courses" | "attendance"
```

Response:

```json
{
  "success": true,
  "data": {
    "totalRows": 100,
    "validRows": 95,
    "invalidRows": 5,
    "preview": [
      {
        "row": 1,
        "data": {
          "name": "John Doe",
          "email": "john@example.com"
        },
        "valid": true,
        "errors": []
      },
      {
        "row": 5,
        "data": {
          "name": "Jane",
          "email": "invalid-email"
        },
        "valid": false,
        "errors": ["Invalid email format"]
      }
    ],
    "errors": [
      {
        "row": 5,
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

**POST** `/api/v1/import/execute`

Request:

```json
{
  "type": "users",
  "fileId": "uploaded_file_id",
  "options": {
    "updateExisting": true,
    "skipDuplicates": false,
    "sendWelcomeEmail": true,
    "dryRun": false
  }
}
```

Response:

```json
{
  "success": true,
  "data": {
    "imported": 95,
    "failed": 5,
    "skipped": 0,
    "failedRecords": [
      {
        "row": 5,
        "data": {},
        "error": "Duplicate email"
      }
    ]
  }
}
```

---

## Color Palette Reference (from global.css)

**CRITICAL:** Use ONLY these CSS variables throughout the application:

```css
/* Light & Dark mode variables */
--background: /* Main page background */
--foreground: /* Main text color */
--card: /* Card backgrounds */
--card-foreground: /* Text on cards */
--popover: /* Popover backgrounds */
--popover-foreground: /* Text in popovers */
--primary: /* Primary buttons, links, highlights */
--primary-foreground: /* Text on primary elements */
--secondary: /* Secondary buttons */
--secondary-foreground: /* Text on secondary elements */
--muted: /* Muted backgrounds */
--muted-foreground: /* Muted text */
--accent: /* Accent elements */
--accent-foreground: /* Text on accent elements */
--destructive: /* Delete, error buttons */
--destructive-foreground: /* Text on destructive elements */
--border: /* All borders */
--input: /* Input borders */
--ring: /* Focus rings */
--radius: /* Border radius */
```

**Usage Examples:**

```tsx
// ✅ CORRECT - Use CSS variables
<div className="bg-background text-foreground">
<Card className="bg-card border-border">
<Button className="bg-primary text-primary-foreground hover:bg-primary/90">
<Badge className="bg-secondary text-secondary-foreground">
<Alert className="bg-destructive text-destructive-foreground">

// ❌ WRONG - Never use hardcoded colors
<div className="bg-blue-500 text-gray-900"> // NEVER DO THIS
<Card style={{ backgroundColor: "#3B82F6" }}> // NEVER DO THIS
<Button className="bg-indigo-600"> // NEVER DO THIS
```

**Chart Colors (Recharts):**

```tsx
// Use CSS variables in Recharts
const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--accent))',
  'hsl(var(--muted))',
];

<Line stroke="hsl(var(--primary))" fill="hsl(var(--primary))" />;
```

---

## Additional Guidelines

**1. Loading States:**

- Always show Shadcn `Skeleton` during data fetch
- Use loading spinners on buttons during actions
- Disable buttons during loading

**2. Error Handling:**

- Show Shadcn `Toast` for errors
- Display inline error messages below form fields
- Use Shadcn `Alert` for important warnings

**3. Responsive Design:**

- Mobile-first approach
- Use Shadcn grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- Stack cards vertically on mobile
- Hamburger menu for mobile navigation

**4. Accessibility:**

- Use semantic HTML
- Add ARIA labels
- Keyboard navigation support
- Focus indicators (using `ring` color)

**5. Performance:**

- Use React Query for data fetching and caching
- Implement pagination for large lists
- Lazy load charts and heavy components
- Debounce search inputs

**6. Data Validation:**

- Use Zod schemas for form validation
- Show validation errors in real-time
- Prevent invalid form submissions

Always refer to this document and use the provided API endpoints and color variables!
