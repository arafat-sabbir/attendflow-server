# AI Agent Prompts: AttendFlow User Portal (Student & Teacher App)

> **Project:** Next.js 16+ with App Router + NextAuth + Shadcn UI + TailwindCSS v4
>
> **Critical Rules:**
>
> - ✅ **ONLY** use colors from CSS variables (e.g., `hsl(var(--primary))`, `var(--success-600)`, `var(--error-600)`)
> - ✅ Use existing `CustomFormField` component for ALL form inputs
> - ✅ Use Shadcn UI components exclusively (Button, Card, Table, Select, etc.)
> - ✅ Use existing custom className utilities from the project
> - ✅ Use Tailwind's custom color variables: `var(--gray-50)`, `var(--gray-100)`, etc.
> - ❌ **NEVER** hardcode colors (no `bg-blue-500`, no hex codes like `#3B82F6`)
> - ❌ **NEVER** install new UI libraries
> - ❌ **NEVER** create custom form components

**Base API URL:** `http://localhost:5000/api/v1`

---

## PROMPT 1: Authentication - Login Page Setup

### Task

Create a complete login page with NextAuth integration, responsive design, and role-based redirects.

### Files to Create

- `app/(auth)/login/page.tsx`
- `components/auth/LoginForm.tsx`
- `app/api/auth/[...nextauth]/route.ts` (NextAuth configuration)

### Requirements

**1. LoginForm Component** (`components/auth/LoginForm.tsx`):

- Use Shadcn `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`
- Use `CustomFormField` for:
  - Email field (type: email, required, validation)
  - Password field (type: password, required, min 6 chars)
  - Remember Me checkbox (optional)
- Use Shadcn `Button` with loading state (spinner icon when submitting)
- Add links:
  - "Forgot Password?" → `/forgot-password` (using Next.js Link)
  - "Don't have an account? Register" → `/register`
- Show error messages using Shadcn `Toast` or `Alert` component
- Center the card on page, max-width 400px

**2. Styling Rules:**

- Card background: `bg-card`
- Primary button: `bg-primary text-primary-foreground hover:bg-primary/90`
- Text colors: `text-foreground`, `text-muted-foreground` or use custom colors: `text-t-primary`, `text-g-600`
- Border colors: `border-border` or use `border-b-primary`
- Form container: centered vertically and horizontally
- Mobile responsive (full width on mobile with padding)
- Background: `bg-background`

**3. NextAuth Configuration** (`app/api/auth/[...nextauth]/route.ts`):

```typescript
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            email: credentials?.email,
            password: credentials?.password,
          });

          if (response.data.success) {
            return {
              id: response.data.data.user.id,
              email: response.data.data.user.email,
              name: response.data.data.user.name,
              role: response.data.data.user.role,
              accessToken: response.data.data.accessToken,
              refreshToken: response.data.data.refreshToken,
            };
          }
          return null;
        } catch (error) {
          console.error('Login error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
});

export { handler as GET, handler as POST };
```

**4. Login Functionality:**

- Use NextAuth `signIn("credentials", { ... })` method
- On success, redirect based on role:
  - `ADMIN` → `/admin/dashboard`
  - `TEACHER` → `/teacher/dashboard`
  - `STUDENT` → `/student/dashboard`
- Display loading state during authentication
- Show error toast on failure

### API Endpoint

**POST** `/api/v1/auth/login`

Request Body:

```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

Response (200):

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_id_123",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "STUDENT",
      "status": "ACTIVE"
    }
  }
}
```

Error Response (401):

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### Color Variables Reference

Use these CSS variables from globals.css:

```css
/* Main Colors */
--background: /* Page background */
--foreground: /* Main text color */
--card: /* Card backgrounds */
--card-foreground: /* Text on cards */
--primary: /* Primary buttons, links */
--primary-foreground: /* Text on primary elements */
--secondary: /* Secondary buttons */
--secondary-foreground: /* Text on secondary elements */
--muted: /* Muted backgrounds */
--muted-foreground: /* Muted text */
--accent: /* Accent elements */
--accent-foreground: /* Text on accent elements */
--destructive: /* Delete, error buttons - can also use var(--error-600) */
--border: /* All borders - can also use var(--b-primary) */
--input: /* Input borders */
--ring: /* Focus rings */

/* Custom Colors */
--success-600: /* Success states */
--error-600: /* Error states */
--warning-400: /* Warning states */
--gray-50 to --gray-900: /* Various gray shades */
--t-primary: /* Primary text color */
--t-tertiary: /* Tertiary text color */
```

**Usage in className:**

```tsx
<div className="bg-background text-foreground">
<Card className="bg-card border-b-primary">
<Button className="bg-primary text-primary-foreground hover:bg-primary/90">
<Badge className="bg-secondary text-secondary-foreground">
<div className="text-t-primary">
<div className="text-g-600">
```

---

## PROMPT 2: Authentication - Registration Page

### Task

Create registration page with role selection, conditional fields for Student/Teacher, and department/batch dropdowns.

### Files to Create

- `app/(auth)/register/page.tsx`
- `components/auth/RegisterForm.tsx`

### Requirements

**1. RegisterForm Component:**

- Use Shadcn `Card` for container
- Use `CustomFormField` for all inputs:
  - Name (text, required)
  - Email (email, required, validation)
  - Password (password, required, min 6 chars, show strength indicator)
  - Confirm Password (password, required, must match)
  - Phone (type: "phone_input", optional)
  - Role Selection (Shadcn `Select` component: "Student" or "Teacher")

**2. Conditional Fields (show based on role):**

**If Role = "STUDENT":**

- Student ID (text, required, e.g., "ST2024001")
- Department (Shadcn `Select`, fetch from API, required)
- Batch (Shadcn `Select`, fetch from API based on department, required)
- Semester (number input, 1-8, optional)

**If Role = "TEACHER":**

- Employee ID (text, required, e.g., "EMP2024001")
- Department (Shadcn `Select`, fetch from API, required)
- Designation (text, optional, e.g., "Assistant Professor")
- Specialization (text, optional, e.g., "Computer Science")

**3. Form Validation:**

- Email format validation
- Password strength (min 6 chars, 1 uppercase, 1 number)
- Confirm password match
- Required field validation
- Show validation errors using Shadcn form error messages

**4. Functionality:**

- Fetch departments on component mount
- Fetch batches when department is selected (for students)
- Submit registration data
- On success: Show success toast → redirect to `/login` after 2 seconds
- On error: Show error toast with message

**5. Styling:**

- Use same styling approach as Login page
- Multi-step form feel (but single page)
- Add "Already have an account? Login" link

### API Endpoints

**GET** `/api/v1/organization/departments`

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "dept_cs_001",
      "name": "Computer Science",
      "code": "CS"
    },
    {
      "id": "dept_ee_001",
      "name": "Electrical Engineering",
      "code": "EE"
    }
  ]
}
```

**GET** `/api/v1/organization/batches?departmentId=dept_cs_001`

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "batch_2024_cs_a",
      "name": "CS Batch 2024-A",
      "year": 2024,
      "semester": 1
    },
    {
      "id": "batch_2024_cs_b",
      "name": "CS Batch 2024-B",
      "year": 2024,
      "semester": 1
    }
  ]
}
```

**POST** `/api/v1/auth/register`

Request Body (Student):

```json
{
  "email": "john.student@example.com",
  "username": "johnstudent",
  "password": "SecurePassword123!",
  "name": "John Student",
  "role": "STUDENT",
  "phone": "+1234567890",
  "studentId": "ST2024001",
  "batchId": "batch_2024_cs_a",
  "departmentId": "dept_cs_001",
  "semester": 1
}
```

Request Body (Teacher):

```json
{
  "email": "jane.teacher@example.com",
  "username": "janeteacher",
  "password": "SecurePassword123!",
  "name": "Jane Teacher",
  "role": "TEACHER",
  "phone": "+1234567890",
  "employeeId": "EMP2024001",
  "departmentId": "dept_cs_001",
  "designation": "Assistant Professor",
  "specialization": "Artificial Intelligence"
}
```

Response (201):

```json
{
  "success": true,
  "message": "Registration successful. Please login."
}
```

---

## PROMPT 3: Forgot Password & Reset Password Pages

### Task

Create forgot password and reset password pages with email verification and password update.

### Files to Create

- `app/(auth)/forgot-password/page.tsx`
- `app/(auth)/reset-password/page.tsx`
- `components/auth/ForgotPasswordForm.tsx`
- `components/auth/ResetPasswordForm.tsx`

### Requirements

**1. Forgot Password Form:**

- Single email input (use `CustomFormField` with type="email")
- Submit button with loading state
- Success message: "Password reset link sent to your email"
- Use Shadcn `Alert` component for messages
- Link back to login

**2. Reset Password Form:**

- Read token from URL query params: `/reset-password?token=xxx`
- Two password fields using `CustomFormField` with type="password":
  - New Password (password, required, min 6 chars)
  - Confirm New Password (password, required)
- Password strength indicator
- Submit button with loading state
- On success: redirect to `/login` with success message

**3. Styling:**

- Same card-based layout as login
- Use colors from globals.css
- Mobile responsive

### API Endpoints

**POST** `/api/v1/auth/forgot-password`

Request:

```json
{
  "email": "john.doe@example.com"
}
```

Response:

```json
{
  "success": true,
  "message": "Password reset link sent to your email"
}
```

**POST** `/api/v1/auth/reset-password`

Request:

```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePassword123!"
}
```

Response:

```json
{
  "success": true,
  "message": "Password reset successful"
}
```

---

## PROMPT 4: Student Dashboard - Overview Page

### Task

Create student dashboard with overview cards, attendance summary, today's schedule, leave summary, and recent notifications.

### Files to Create

- `app/(student)/dashboard/page.tsx`
- `components/student/DashboardOverview.tsx`
- `components/student/AttendanceSummaryCard.tsx`
- `components/student/TodayScheduleCard.tsx`
- `components/student/LeaveSummaryCard.tsx`
- `components/student/RecentNotifications.tsx`

### Requirements

**1. Layout Structure:**

```
┌─────────────────────────────────────────────────┐
│  Student Profile Card (Full width)              │
├─────────────────────┬───────────────────────────┤
│  Attendance Summary │  Leave Summary            │
│  (Card with chart)  │  (Card with stats)        │
├─────────────────────┴───────────────────────────┤
│  Today's Schedule (Table/Cards)                  │
├──────────────────────────────────────────────────┤
│  Recent Notifications (List)                     │
└──────────────────────────────────────────────────┘
```

**2. Profile Card:**

- Display: Name, Student ID, Batch, Department, Semester
- Avatar/Photo (use Shadcn `Avatar` component)
- Email, Phone
- Use Shadcn `Card` with `bg-card` color
- Edit profile button → `/student/profile`

**3. Attendance Summary Card:**

- Total classes: 120
- Attended: 108
- Percentage: 90% (color-coded)
- Color coding:
  - ≥90%: `text-success-600` (from globals.css)
  - 75-89%: `text-warning-400`
  - <75%: `text-error-600`
- Mini bar chart showing monthly attendance (use Recharts)
- "View Details" button → `/student/attendance`

**4. Today's Schedule Card:**

- Show today's classes in Shadcn `Table`
- Columns: Time, Course, Teacher, Room, Status
- Status badges (use Shadcn `Badge`):
  - Upcoming: blue/primary
  - Completed: `bg-success-100 text-success-600`
  - Missed: `bg-error-50 text-error-600`
- Empty state if no classes today

**5. Leave Summary Card:**

- Pending Leaves: count with badge
- Approved Leaves: count
- Rejected Leaves: count
- "Apply Leave" button → `/student/leave/apply`

**6. Recent Notifications:**

- Last 5 notifications
- Show: Title, message snippet, timestamp (use `date-fns` for formatting)
- Unread indicator (dot or badge)
- "View All" button → `/student/notifications`

### API Endpoints

**GET** `/api/v1/student/dashboard/:studentId`

Response:

```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "student_123",
      "userId": "user_123",
      "name": "John Doe",
      "email": "john@example.com",
      "studentId": "ST2024001",
      "batch": {
        "id": "batch_1",
        "name": "CS 2024-A"
      },
      "department": {
        "id": "dept_1",
        "name": "Computer Science"
      },
      "semester": 1,
      "phone": "+1234567890",
      "avatar": "https://example.com/avatar.jpg"
    },
    "attendance": {
      "totalClasses": 120,
      "attended": 108,
      "percentage": 90,
      "monthlyData": [
        { "month": "Jan", "percentage": 92 },
        { "month": "Feb", "percentage": 88 }
      ]
    },
    "todaySchedule": [
      {
        "id": "schedule_1",
        "time": "09:00 - 10:30",
        "course": "Data Structures",
        "teacher": "Dr. Smith",
        "room": "Room 201",
        "status": "UPCOMING"
      }
    ],
    "leaveSummary": {
      "pending": 2,
      "approved": 5,
      "rejected": 1
    }
  }
}
```

**GET** `/api/v1/notification?recipientId={userId}&limit=5&sort=createdAt:desc`

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "notif_1",
      "title": "Attendance Marked",
      "message": "Your attendance for Data Structures has been marked as Present",
      "isRead": false,
      "createdAt": "2024-12-12T10:30:00Z"
    }
  ]
}
```

### Styling Rules

- Use Shadcn grid layout: `grid grid-cols-1 md:grid-cols-2 gap-6`
- All cards: `bg-card border-b-primary`
- Primary actions: `bg-primary text-primary-foreground`
- Use Shadcn `Skeleton` for loading states
- Custom colors: `text-t-primary`, `text-g-600`, `bg-gray-50`

---

## PROMPT 5: Student Attendance - View & History

### Task

Create student attendance viewing page with filters, detailed history table, and course-wise breakdown.

### Files to Create

- `app/(student)/attendance/page.tsx`
- `components/student/AttendanceFilters.tsx`
- `components/student/AttendanceTable.tsx`
- `components/student/AttendanceChart.tsx`

### Requirements

**1. Page Layout:**

- Top: Filter section (course, date range, status)
- Middle: Summary cards (Present, Absent, Late counts)
- Bottom: Attendance table with pagination

**2. Filters (use Shadcn components):**

- Course Dropdown (Shadcn `Select`, fetch from API)
- Date Range Picker (Shadcn `Popover` + `Calendar`)
- Status Filter (multi-select: Present, Absent, Late, Excused)
- Apply/Reset buttons

**3. Summary Cards (3 cards in a row):**

- Present Count + Percentage
- Absent Count
- Late Count
- Color-coded based on values

**4. Attendance Table (Shadcn `Table`):**

- Columns: Date, Course, Status, Check-In Time, Check-Out Time, Notes
- Status badge with colors:
  - Present: `bg-success-100 text-success-600`
  - Absent: `bg-error-50 text-error-600`
  - Late: `bg-warning-100 text-warning-400`
  - Excused: `bg-gray-100 text-g-700`
- Pagination (Shadcn `Pagination` component)
- Sorting by date (desc by default)

**5. Chart Section:**

- Line chart showing attendance trend over time
- Use Recharts library
- X-axis: Dates, Y-axis: Attendance percentage

### API Endpoints

**GET** `/api/v1/student/:studentId/attendance?courseId={courseId}&startDate={date}&endDate={date}&status={status}&page=1&limit=10`

Response:

```json
{
  "success": true,
  "data": {
    "attendances": [
      {
        "id": "att_1",
        "date": "2024-12-10T00:00:00Z",
        "course": {
          "id": "course_1",
          "name": "Data Structures",
          "code": "CS201"
        },
        "status": "PRESENT",
        "checkIn": "2024-12-10T09:00:00Z",
        "checkOut": "2024-12-10T10:30:00Z",
        "notes": "On time"
      }
    ],
    "summary": {
      "totalClasses": 120,
      "present": 108,
      "absent": 8,
      "late": 4,
      "percentage": 90
    },
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 120,
      "totalPages": 12
    }
  }
}
```

**GET** `/api/v1/student/:studentId/attendance-summary`

Response:

```json
{
  "success": true,
  "data": {
    "overall": {
      "percentage": 90,
      "totalClasses": 120,
      "attended": 108
    },
    "byCourse": [
      {
        "courseId": "course_1",
        "courseName": "Data Structures",
        "percentage": 95,
        "totalClasses": 30,
        "attended": 28
      }
    ],
    "trend": [
      {
        "date": "2024-12-01",
        "percentage": 92
      }
    ]
  }
}
```

---

## PROMPT 6: Student QR Code Check-In Page

### Task

Create QR code scanner page for students to check-in to classes using their camera.

### Files to Create

- `app/(student)/check-in/page.tsx`
- `components/student/QRScanner.tsx`
- `components/student/CheckInSuccess.tsx`

### Requirements

**1. QR Scanner Component:**

- Use `react-qr-scanner` or `html5-qrcode` library
- Camera preview (full width on mobile, max 500px on desktop)
- Request camera permissions
- Show permission denied message if blocked
- Scan QR code and extract data
- Stop scanner after successful scan

**2. Scan Flow:**

- Show camera preview with scanning frame
- Display "Scanning..." indicator
- On successful scan: Extract `attendanceRecordId` from QR code
- Submit check-in request with scanned data
- Show success animation/message
- Redirect to dashboard after 3 seconds

**3. Check-In Success UI:**

- Success checkmark animation (use Shadcn icons)
- Display: Course name, Time, Teacher name
- "Done" button to go back to dashboard

**4. Error Handling:**

- Invalid QR code: Show error toast
- Already checked in: Show message "Already checked in"
- QR code expired: Show message "QR code has expired"
- Network error: Show retry button

**5. Styling:**

- Scanner container: `bg-card border-b-primary rounded-lg`
- Success screen: centered with large checkmark icon
- Use colors from globals.css

### API Endpoints

**POST** `/api/v1/attendance/check-in`

Request:

```json
{
  "studentId": "student_123",
  "attendanceRecordId": "att_record_456",
  "qrToken": "scanned_qr_token_xyz",
  "checkInTime": "2024-12-12T09:05:00Z"
}
```

Response (Success):

```json
{
  "success": true,
  "message": "Check-in successful",
  "data": {
    "id": "att_789",
    "course": {
      "name": "Data Structures",
      "code": "CS201"
    },
    "teacher": "Dr. Smith",
    "checkInTime": "2024-12-12T09:05:00Z",
    "status": "PRESENT"
  }
}
```

Response (Already Checked In):

```json
{
  "success": false,
  "message": "You have already checked in for this class"
}
```

---

## PROMPT 7: Student Leave Management - Apply Leave

### Task

Create leave application form with date selection, leave type, and reason.

### Files to Create

- `app/(student)/leave/apply/page.tsx`
- `components/student/LeaveApplicationForm.tsx`

### Requirements

**1. Leave Application Form:**

- Use Shadcn `Card` container
- Use `CustomFormField` for all inputs:
  - Leave Type (Shadcn `Select`: Sick, Personal, Emergency, Vacation)
  - Start Date (date picker)
  - End Date (date picker, must be >= start date)
  - Reason (fieldType: "text_area", required, min 10 chars, max 500 chars)
  - Supporting Documents (fieldType: "file", optional, max 5MB)

**2. Form Validation:**

- End date must be >= start date
- Calculate total days automatically
- Reason required
- Show character count for reason field

**3. Preview Section:**

- Show calculated leave duration (days)
- Display selected dates
- Show leave type badge

**4. Submit Functionality:**

- Show loading state on button
- On success: Show success toast → redirect to `/student/leave`
- On error: Show error toast with message

**5. Styling:**

- Form layout: single column on mobile, proper spacing
- Date pickers with calendar icon
- Use colors from globals.css

### API Endpoints

**POST** `/api/v1/leave`

Request (multipart/form-data if file attached, otherwise JSON):

```json
{
  "studentId": "student_123",
  "leaveType": "SICK",
  "startDate": "2024-12-15T00:00:00Z",
  "endDate": "2024-12-17T00:00:00Z",
  "reason": "Medical appointment and recovery",
  "supportingDocument": "file_upload"
}
```

Response:

```json
{
  "success": true,
  "message": "Leave application submitted successfully",
  "data": {
    "id": "leave_123",
    "leaveType": "SICK",
    "startDate": "2024-12-15T00:00:00Z",
    "endDate": "2024-12-17T00:00:00Z",
    "status": "PENDING",
    "totalDays": 3
  }
}
```

---

## PROMPT 8: Student Leave Management - View Leaves

### Task

Create leave history page showing all applied leaves with status filters and pagination.

### Files to Create

- `app/(student)/leave/page.tsx`
- `components/student/LeaveList.tsx`
- `components/student/LeaveCard.tsx`

### Requirements

**1. Page Header:**

- Title: "My Leave Applications"
- "Apply New Leave" button → `/student/leave/apply`
- Summary cards: Pending, Approved, Rejected counts

**2. Filter Section:**

- Status filter (tabs or select): All, Pending, Approved, Rejected
- Date range filter
- Leave type filter

**3. Leave List (use Shadcn `Card` for each leave):**

- Display per leave:
  - Leave Type badge (colored)
  - Date range (e.g., "Dec 15 - Dec 17, 2024")
  - Total days
  - Status badge (Pending: `text-warning-400`, Approved: `text-success-600`, Rejected: `text-error-600`)
  - Reason (truncated, expandable)
  - Applied date
  - Approver name (if approved/rejected)
  - Rejection reason (if rejected)
- Actions:
  - View details
  - Cancel (only for pending leaves)

**4. Empty State:**

- Show message "No leave applications found"
- "Apply Leave" button

**5. Pagination:**

- Use Shadcn `Pagination` component
- 10 items per page

### API Endpoints

**GET** `/api/v1/leave?studentId={studentId}&status={status}&leaveType={type}&startDate={date}&endDate={date}&page=1&limit=10`

Response:

```json
{
  "success": true,
  "data": {
    "leaves": [
      {
        "id": "leave_123",
        "leaveType": "SICK",
        "startDate": "2024-12-15T00:00:00Z",
        "endDate": "2024-12-17T00:00:00Z",
        "totalDays": 3,
        "reason": "Medical appointment and recovery",
        "status": "PENDING",
        "appliedAt": "2024-12-10T10:00:00Z",
        "approver": null,
        "rejectionReason": null
      },
      {
        "id": "leave_124",
        "leaveType": "PERSONAL",
        "startDate": "2024-11-20T00:00:00Z",
        "endDate": "2024-11-21T00:00:00Z",
        "totalDays": 2,
        "reason": "Family event",
        "status": "APPROVED",
        "appliedAt": "2024-11-15T10:00:00Z",
        "approver": {
          "id": "teacher_1",
          "name": "Dr. Smith"
        },
        "approvedAt": "2024-11-16T14:00:00Z"
      }
    ],
    "summary": {
      "total": 10,
      "pending": 2,
      "approved": 7,
      "rejected": 1
    },
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 10,
      "totalPages": 1
    }
  }
}
```

**DELETE** `/api/v1/leave/:leaveId` (Cancel leave)

Response:

```json
{
  "success": true,
  "message": "Leave application cancelled successfully"
}
```

---

## PROMPT 9: Student Profile - View & Edit

### Task

Create student profile page with view and edit capabilities.

### Files to Create

- `app/(student)/profile/page.tsx`
- `components/student/ProfileView.tsx`
- `components/student/ProfileEditForm.tsx`

### Requirements

**1. Profile View Mode:**

- Profile header with avatar (use Shadcn `Avatar`)
- Display sections:
  - Personal Information: Name, Email, Phone, DOB
  - Academic Information: Student ID, Batch, Department, Semester, GPA
  - Account Information: Username, Status, Joined Date
- "Edit Profile" button (switches to edit mode)
- "Change Password" button → opens dialog/modal

**2. Profile Edit Mode:**

- Use `CustomFormField` for editable fields:
  - Name (required)
  - Username (required, unique)
  - Phone (fieldType: "phone_input", optional)
  - Date of Birth (date picker)
  - Avatar upload (fieldType: "image", max 2MB, image only)
- Read-only fields: Email, Student ID, Batch, Department
- "Save Changes" and "Cancel" buttons
- Show loading state on save

**3. Change Password Dialog:**

- Use Shadcn `Dialog` component
- Fields using `CustomFormField`:
  - Current Password (fieldType: "password", required)
  - New Password (fieldType: "password", required, min 6 chars)
  - Confirm New Password (fieldType: "password", required)
- Password strength indicator
- Submit button with loading state

**4. Avatar Upload:**

- Click avatar to upload
- Preview uploaded image before saving
- Use `CustomFormField` with fieldType: "image"
- Accept: .jpg, .jpeg, .png only

**5. Styling:**

- Profile card layout with sections
- Use Shadcn `Separator` between sections
- Colors from globals.css

### API Endpoints

**GET** `/api/v1/auth/profile` (get logged-in user profile)

Response:

```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "phone": "+1234567890",
    "dateOfBirth": "2000-01-15T00:00:00Z",
    "avatar": "https://example.com/avatar.jpg",
    "status": "ACTIVE",
    "role": "STUDENT",
    "createdAt": "2024-01-01T00:00:00Z",
    "student": {
      "id": "student_123",
      "studentId": "ST2024001",
      "batch": {
        "name": "CS 2024-A"
      },
      "department": {
        "name": "Computer Science"
      },
      "semester": 1,
      "gpa": 3.5
    }
  }
}
```

**PATCH** `/api/v1/auth/profile`

Request:

```json
{
  "name": "John Updated Doe",
  "username": "johndoe_updated",
  "phone": "+9876543210",
  "dateOfBirth": "2000-01-20T00:00:00Z",
  "avatar": "base64_or_file_upload"
}
```

Response:

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    /* updated user data */
  }
}
```

**POST** `/api/v1/auth/change-password`

Request:

```json
{
  "currentPassword": "CurrentPassword123!",
  "newPassword": "NewPassword123!"
}
```

Response:

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## PROMPT 10: Student Notifications Page

### Task

Create notifications page showing all notifications with read/unread status and filtering.

### Files to Create

- `app/(student)/notifications/page.tsx`
- `components/student/NotificationList.tsx`
- `components/student/NotificationItem.tsx`

### Requirements

**1. Page Header:**

- Title: "Notifications"
- Unread count badge
- "Mark All as Read" button

**2. Filter Tabs:**

- All
- Unread
- Read

**3. Notification List:**

- Use Shadcn `Card` for each notification
- Display:
  - Icon based on type (attendance, leave, announcement)
  - Title (bold if unread)
  - Message
  - Timestamp (use `date-fns` for relative time: "2 hours ago")
  - Unread indicator (blue dot)
- Click to mark as read
- Delete button (hover to show)

**4. Empty State:**

- Show when no notifications
- Message: "No notifications yet"

**5. Pagination:**

- Infinite scroll or "Load More" button
- Show loading skeleton while fetching

### API Endpoints

**GET** `/api/v1/notification?recipientId={userId}&isRead={boolean}&page=1&limit=20&sort=createdAt:desc`

Response:

```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notif_1",
        "title": "Attendance Marked",
        "message": "Your attendance for Data Structures has been marked as Present",
        "type": "ATTENDANCE",
        "isRead": false,
        "createdAt": "2024-12-12T10:30:00Z"
      },
      {
        "id": "notif_2",
        "title": "Leave Approved",
        "message": "Your leave request for Dec 15-17 has been approved",
        "type": "LEAVE",
        "isRead": true,
        "createdAt": "2024-12-11T14:00:00Z"
      }
    ],
    "unreadCount": 5,
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3
    }
  }
}
```

**PATCH** `/api/v1/notification/:id/read`

Response:

```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

**PATCH** `/api/v1/notification/mark-all-read`

Request:

```json
{
  "recipientId": "user_123"
}
```

Response:

```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

**DELETE** `/api/v1/notification/:id`

Response:

```json
{
  "success": true,
  "message": "Notification deleted"
}
```

---

## PROMPT 11: Teacher Dashboard - Overview Page

### Task

Create teacher dashboard with course overview, today's classes, attendance summary, and pending leave requests.

### Files to Create

- `app/(teacher)/dashboard/page.tsx`
- `components/teacher/DashboardOverview.tsx`
- `components/teacher/TodayClasses.tsx`
- `components/teacher/PendingLeaves.tsx`

### Requirements

**1. Layout Structure:**

```
┌─────────────────────────────────────────────────┐
│  Teacher Profile Card (Full width)               │
├────────────────┬────────────────┬───────────────┤
│  Total Courses │ Total Students │ Classes Today │
│  (Stat Card)   │  (Stat Card)   │  (Stat Card)  │
├────────────────┴────────────────┴───────────────┤
│  Today's Classes (List/Cards)                    │
├──────────────────────────────────────────────────┤
│  Pending Leave Requests (Table)                  │
└──────────────────────────────────────────────────┘
```

**2. Profile Card:**

- Display: Name, Employee ID, Department, Designation
- Avatar
- Email, Phone
- "Edit Profile" button

**3. Stat Cards (3 cards in row):**

- Total Courses: count + "View All" link
- Total Students: count across all courses
- Classes Today: count + upcoming class time

**4. Today's Classes:**

- List of classes scheduled for today
- Show: Time, Course, Batch, Room
- "Mark Attendance" button → `/teacher/attendance/mark/:courseId`
- "Generate QR" button → opens QR modal
- Empty state if no classes

**5. Pending Leave Requests:**

- Show recent 5 pending leaves
- Columns: Student Name, Leave Type, Date Range, Days
- Actions: Approve, Reject (inline buttons)
- "View All" link → `/teacher/leaves`

**6. Styling:**

- Use Shadcn grid for responsive layout
- Stat cards with icons
- Colors from globals.css

### API Endpoints

**GET** `/api/v1/teacher/dashboard/:teacherId`

Response:

```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "teacher_123",
      "name": "Dr. Jane Smith",
      "employeeId": "EMP2024001",
      "email": "jane@example.com",
      "phone": "+1234567890",
      "department": {
        "name": "Computer Science"
      },
      "designation": "Associate Professor",
      "avatar": "https://example.com/avatar.jpg"
    },
    "stats": {
      "totalCourses": 4,
      "totalStudents": 120,
      "classesToday": 2
    },
    "todayClasses": [
      {
        "id": "class_1",
        "time": "09:00 - 10:30",
        "course": {
          "id": "course_1",
          "name": "Data Structures",
          "code": "CS201"
        },
        "batch": {
          "name": "CS 2024-A"
        },
        "room": "Room 201",
        "enrolledStudents": 35
      }
    ],
    "pendingLeaves": [
      {
        "id": "leave_1",
        "student": {
          "id": "student_1",
          "name": "John Doe",
          "studentId": "ST2024001"
        },
        "leaveType": "SICK",
        "startDate": "2024-12-15T00:00:00Z",
        "endDate": "2024-12-17T00:00:00Z",
        "totalDays": 3,
        "reason": "Medical appointment"
      }
    ]
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

Response:

```json
{
  "success": true,
  "message": "Leave request approved successfully"
}
```

---

## PROMPT 12: Teacher - Mark Attendance (Manual)

### Task

Create attendance marking page where teachers can manually mark attendance for students in a class.

### Files to Create

- `app/(teacher)/attendance/mark/[courseId]/page.tsx`
- `components/teacher/AttendanceMarkingTable.tsx`
- `components/teacher/BulkAttendanceActions.tsx`

### Requirements

**1. Page Header:**

- Course name and code
- Date selector (default: today)
- Batch selector (if course has multiple batches)
- Session time (e.g., "09:00 - 10:30")

**2. Student List Table:**

- Use Shadcn `Table`
- Columns:
  - Checkbox (for bulk selection)
  - Student ID
  - Student Name
  - Photo/Avatar
  - Status (dropdown or radio: Present, Absent, Late, Excused)
  - Check-In Time (time picker, auto-fill if QR scanned)
  - Notes (text input, optional)
- Search/filter students by name or ID
- Highlight late arrivals in `bg-warning-100`

**3. Bulk Actions:**

- "Mark All Present" button
- "Mark All Absent" button
- "Mark Selected as Present/Absent/Late"
- Confirmation dialog before bulk actions

**4. Submit Section:**

- "Save Attendance" button (bottom right, sticky)
- Show count of marked students
- Loading state while saving
- Success toast on save
- Option to "Save & Generate Report"

**5. Features:**

- Auto-save draft (localStorage)
- Show previously marked attendance if exists (edit mode)
- Validation: ensure all students are marked

### API Endpoints

**GET** `/api/v1/teacher/:teacherId/courses/:courseId/students`

Response:

```json
{
  "success": true,
  "data": {
    "course": {
      "id": "course_1",
      "name": "Data Structures",
      "code": "CS201"
    },
    "students": [
      {
        "id": "student_1",
        "studentId": "ST2024001",
        "name": "John Doe",
        "avatar": "https://example.com/avatar.jpg"
      }
    ]
  }
}
```

**POST** `/api/v1/attendance/bulk-mark`

Request:

```json
{
  "teacherId": "teacher_123",
  "courseId": "course_1",
  "date": "2024-12-12T00:00:00Z",
  "attendances": [
    {
      "studentId": "student_1",
      "status": "PRESENT",
      "checkIn": "2024-12-12T09:00:00Z",
      "notes": "On time"
    },
    {
      "studentId": "student_2",
      "status": "ABSENT",
      "notes": ""
    },
    {
      "studentId": "student_3",
      "status": "LATE",
      "checkIn": "2024-12-12T09:15:00Z",
      "notes": "15 minutes late"
    }
  ]
}
```

Response:

```json
{
  "success": true,
  "message": "Attendance marked successfully for 30 students",
  "data": {
    "present": 25,
    "absent": 3,
    "late": 2
  }
}
```

---

## PROMPT 13: Teacher - Generate QR Code for Class

### Task

Create QR code generation feature for teachers to display QR code for student check-in.

### Files to Create

- `app/(teacher)/qr/generate/page.tsx`
- `components/teacher/QRCodeGenerator.tsx`
- `components/teacher/QRCodeDisplay.tsx`

### Requirements

**1. QR Generation Form:**

- Course selector (dropdown)
- Date selector (default: today)
- Session time (start-end time)
- Validity duration (slider: 5-60 minutes)
- "Generate QR Code" button

**2. QR Code Display:**

- Use `qrcode.react` library to render QR
- Large QR code (300x300px minimum)
- Display below QR:
  - Course name
  - Date and time
  - Expiry countdown timer
  - "Students Scanned: X" (real-time count)
- "Download QR" button (save as PNG)
- "Regenerate" button
- "Close" button

**3. Real-time Updates:**

- Show list of students who have checked in (live updates)
- Student name + check-in time
- Use polling or WebSocket for updates

**4. QR Code Data Format:**

```json
{
  "type": "attendance",
  "courseId": "course_1",
  "teacherId": "teacher_123",
  "date": "2024-12-12",
  "sessionTime": "09:00-10:30",
  "qrToken": "unique_token_xyz",
  "expiresAt": "2024-12-12T09:20:00Z"
}
```

**5. Styling:**

- QR display in Shadcn `Dialog` or dedicated page
- Countdown timer with color change (red when < 2 min)
- Use colors from globals.css

### API Endpoints

**POST** `/api/v1/qr/generate`

Request:

```json
{
  "teacherId": "teacher_123",
  "courseId": "course_1",
  "date": "2024-12-12T00:00:00Z",
  "sessionTime": "09:00-10:30",
  "validityMinutes": 15
}
```

Response:

```json
{
  "success": true,
  "data": {
    "qrId": "qr_123",
    "qrToken": "unique_token_xyz",
    "qrData": "eyJjb3Vyc2VJZCI6ImNvdXJzZV8xIiwidGVhY2hlcklkIjoidGVhY2hlcl8xMjMiLCJkYXRlIjoiMjAyNC0xMi0xMiIsInNlc3Npb25UaW1lIjoiMDk6MDAtMTA6MzAiLCJxclRva2VuIjoidW5pcXVlX3Rva2VuX3h5eiIsImV4cGlyZXNBdCI6IjIwMjQtMTItMTJUMDk6MjA6MDBaIn0=",
    "expiresAt": "2024-12-12T09:20:00Z"
  }
}
```

**GET** `/api/v1/qr/:qrId/scans` (get students who scanned)

Response:

```json
{
  "success": true,
  "data": {
    "scans": [
      {
        "studentId": "student_1",
        "studentName": "John Doe",
        "checkInTime": "2024-12-12T09:05:00Z"
      }
    ],
    "totalScans": 25
  }
}
```

---

## PROMPT 14: Teacher - View Course Attendance Report

### Task

Create course-wise attendance report page with filters, charts, and export options.

### Files to Create

- `app/(teacher)/attendance/report/[courseId]/page.tsx`
- `components/teacher/AttendanceReportTable.tsx`
- `components/teacher/AttendanceChart.tsx`
- `components/teacher/ReportFilters.tsx`

### Requirements

**1. Page Header:**

- Course name and code
- Date range selector
- "Export as PDF" and "Export as CSV" buttons

**2. Summary Cards:**

- Average Attendance %
- Total Classes Conducted
- Students Below 75% (alert card if > 0)
- Most Attended Class Date

**3. Attendance Chart:**

- Line chart showing attendance trend over time
- X-axis: Dates, Y-axis: Percentage
- Use Recharts library
- Toggle view: By Date, By Week, By Month

**4. Student-wise Table:**

- Columns:
  - Student ID
  - Student Name
  - Total Classes
  - Present
  - Absent
  - Late
  - Percentage (color-coded)
- Sortable columns
- Search by student name
- Pagination

**5. Low Attendance Alert:**

- Highlight students with < 75% in `bg-error-50 text-error-600`
- "Send Reminder" button (sends notification)

**6. Export Functionality:**

- PDF: Generate formatted report with charts
- CSV: Download table data

### API Endpoints

**GET** `/api/v1/teacher/:teacherId/courses/:courseId/attendance/report?startDate={date}&endDate={date}`

Response:

```json
{
  "success": true,
  "data": {
    "course": {
      "id": "course_1",
      "name": "Data Structures",
      "code": "CS201"
    },
    "summary": {
      "averageAttendance": 87.5,
      "totalClassesConducted": 40,
      "studentsBelow75": 5,
      "mostAttendedDate": "2024-11-15"
    },
    "trend": [
      {
        "date": "2024-12-01",
        "percentage": 85,
        "present": 30,
        "absent": 5
      }
    ],
    "studentWise": [
      {
        "studentId": "student_1",
        "studentName": "John Doe",
        "totalClasses": 40,
        "present": 38,
        "absent": 2,
        "late": 0,
        "percentage": 95
      }
    ]
  }
}
```

**POST** `/api/v1/notification/send-reminder`

Request:

```json
{
  "studentIds": ["student_1", "student_2"],
  "message": "Your attendance is below 75%. Please improve.",
  "type": "ATTENDANCE_REMINDER"
}
```

---

## PROMPT 15: Teacher - Leave Approvals Management

### Task

Create leave management page for teachers to view, approve, or reject student leave requests.

### Files to Create

- `app/(teacher)/leaves/page.tsx`
- `components/teacher/LeaveRequestsTable.tsx`
- `components/teacher/LeaveApprovalDialog.tsx`

### Requirements

**1. Tabs:**

- Pending (default)
- Approved
- Rejected
- All

**2. Leave Requests Table:**

- Columns:
  - Student Name + ID
  - Leave Type badge
  - Date Range
  - Total Days
  - Reason (with "View Full" button)
  - Applied Date
  - Actions (Approve/Reject buttons for pending)
- Filter by date range, leave type
- Search by student name
- Pagination

**3. Approve/Reject Dialog:**

- Show full leave details
- Student info
- Leave type, dates, reason
- Supporting documents (if any)
- Approval form:
  - For Reject: Rejection reason (textarea, required)
  - Approve/Reject buttons
- Confirmation message

**4. Bulk Actions:**

- Select multiple pending leaves
- "Approve Selected" button
- "Reject Selected" button (opens bulk reject dialog)

**5. Styling:**

- Use Shadcn `Table`, `Dialog`, `Badge`
- Status badges with colors
- Colors from globals.css

### API Endpoints

**GET** `/api/v1/leave?status={status}&courseId={courseId}&page=1&limit=10`

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
          "avatar": "url"
        },
        "leaveType": "SICK",
        "startDate": "2024-12-15T00:00:00Z",
        "endDate": "2024-12-17T00:00:00Z",
        "totalDays": 3,
        "reason": "Medical appointment and recovery",
        "supportingDocument": "url_to_file",
        "status": "PENDING",
        "appliedAt": "2024-12-10T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
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

Or:

```json
{
  "status": "REJECTED",
  "rejectionReason": "Insufficient documentation provided"
}
```

Response:

```json
{
  "success": true,
  "message": "Leave request approved successfully"
}
```

---

## Color Palette Reference (from globals.css)

Use these CSS variables throughout the application:

```css
/* Main Theme Colors */
--background: oklch(1 0 0)                    /* Page background */
--foreground: oklch(0.145 0 0)               /* Main text color */
--card: oklch(1 0 0)                        /* Card backgrounds */
--card-foreground: oklch(0.145 0 0)          /* Text on cards */
--primary: oklch(0.205 0 0)                  /* Primary buttons, links */
--primary-foreground: oklch(0.985 0 0)       /* Text on primary elements */
--secondary: oklch(0.97 0 0)                 /* Secondary buttons */
--secondary-foreground: oklch(0.205 0 0)     /* Text on secondary elements */
--muted: oklch(0.97 0 0)                    /* Muted backgrounds */
--muted-foreground: oklch(0.556 0 0)        /* Muted text */
--accent: oklch(0.97 0 0)                    /* Accent elements */
--accent-foreground: oklch(0.205 0 0)        /* Text on accent elements */
--destructive: oklch(0.577 0.245 27.325)    /* Delete, error buttons */
--border: oklch(0.922 0 0)                  /* All borders */
--input: oklch(0.922 0 0)                   /* Input borders */
--ring: oklch(0.708 0 0)                    /* Focus rings */

/* Custom Color Palette */
--success-100: #DCFAE6                       /* Success background */
--success-600: #079455                       /* Success text/buttons */
--error-50: #FEF3F2                         /* Error background */
--error-100: #FEE4E2                        /* Error background */
--error-500: #F04438                        /* Error color */
--error-600: #D92D20                        /* Error text/buttons */
--error-800: #912018                        /* Dark error */
--warning-400: #FDB022                      /* Warning color */
--gray-25: #FDFDFD                          /* Lightest gray */
--gray-50: #FAFAFA                          /* Very light gray */
--gray-100: #F5F5F5                         /* Light gray */
--gray-200: #E9EAEB                         /* Border gray */
--gray-300: #D5D7DA                         /* Muted gray */
--gray-400: #A4A7AE                         /* Disabled text */
--gray-500: #717680                         /* Secondary text */
--gray-600: #535862                         /* Tertiary text */
--gray-700: #414651                         /* Dark gray */
--gray-800: #2D3139                         /* Very dark gray */
--gray-900: #121212                         /* Darkest gray */
--b-primary: #EAECF0                        /* Primary border color */
--t-primary: #0F172A                        /* Primary text color */
--t-tertiary: #4D5462                       /* Tertiary text color */
```

**Usage in className:**

```tsx
<div className="bg-background text-foreground">
<Card className="bg-card border-b-primary">
<Button className="bg-primary text-primary-foreground hover:bg-primary/90">
<Badge className="bg-secondary text-secondary-foreground">
<div className="text-t-primary">
<div className="text-g-600">
<div className="bg-success-100 text-success-600">
<div className="bg-error-50 text-error-600">
<div className="text-warning-400">
```

**Never use hardcoded colors:**
- ❌ `bg-blue-500`
- ❌ `text-gray-900`
- ❌ `#3B82F6`
- ❌ `rgb(59, 130, 246)`

Always use the CSS variables from globals.css!