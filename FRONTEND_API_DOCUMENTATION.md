# AttendFlow Frontend API Documentation

## Overview

This document provides comprehensive API documentation for the AttendFlow Frontend Application (User Portal). The frontend application is designed for students, teachers, and administrators to perform daily operations including attendance marking, leave requests, profile management, and real-time notifications.

**Base URL:** `http://localhost:5000/api/v1`
**Authentication:** Bearer Token (JWT)

## Authentication

### Login (All Roles)
**Endpoint:** `POST /auth/login`

**Description:** Authenticate users with any role (Student, Teacher, Admin) to access the frontend application.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Request Fields:**
- `email` (string, required): User's email address
- `password` (string, required): User's password

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-uuid",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "STUDENT",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

**Response Fields:**
- `success` (boolean): Request success status
- `message` (string): Response message
- `data.accessToken` (string): JWT access token for API calls
- `data.refreshToken` (string): JWT refresh token for token renewal
- `data.user` (object): User information
  - `id` (string): Unique user identifier
  - `name` (string): User's full name
  - `email` (string): User's email address
  - `role` (string): User role (STUDENT, TEACHER, ADMIN)
  - `createdAt` (string): Account creation timestamp
  - `updatedAt` (string): Last update timestamp

### Register User
**Endpoint:** `POST /auth/register`

**Description:** Register a new user account in the system.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "role": "STUDENT"
}
```

**Request Fields:**
- `name` (string, required): User's full name
- `email` (string, required): User's email address (must be unique)
- `password` (string, required): User's password (min 6 characters)
- `role` (string, required): User role (STUDENT, TEACHER, ADMIN)

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "user-uuid",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "STUDENT",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### Forgot Password
**Endpoint:** `POST /auth/forgot-password`

**Description:** Request a password reset link to be sent to the user's email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Request Fields:**
- `email` (string, required): User's email address

**Response:**
```json
{
  "success": true,
  "message": "Password reset link sent to your email"
}
```

### Reset Password
**Endpoint:** `POST /auth/reset-password`

**Description:** Reset user's password using the reset token received via email.

**Request Body:**
```json
{
  "token": "reset-token-here",
  "newPassword": "newpassword123"
}
```

**Request Fields:**
- `token` (string, required): Password reset token from email
- `newPassword` (string, required): New password (min 6 characters)

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

### Change Password
**Endpoint:** `POST /auth/change-password`

**Description:** Change user's password while authenticated.

**Request Headers:**
- `Authorization: Bearer {jwt_token}`

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Request Fields:**
- `currentPassword` (string, required): Current password
- `newPassword` (string, required): New password (min 6 characters)

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Get User Profile
**Endpoint:** `GET /auth/profile`

**Description:** Retrieve the authenticated user's profile information.

**Request Headers:**
- `Authorization: Bearer {jwt_token}`

**Response:**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "user-uuid",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "STUDENT",
    "profile": {
      "phone": "+1234567890",
      "address": "123 Main St, City, Country",
      "semester": 2,
      "rollNumber": "CS2024001",
      "registrationNumber": "REG202400001"
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### Update User Profile
**Endpoint:** `PATCH /auth/profile`

**Description:** Update the authenticated user's profile information.

**Request Headers:**
- `Authorization: Bearer {jwt_token}`

**Request Body:**
```json
{
  "name": "John Smith"
}
```

**Request Fields:**
- `name` (string, optional): Updated user name
- `phone` (string, optional): Updated phone number
- `address` (string, optional): Updated address

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "user-uuid",
    "name": "John Smith",
    "email": "john.doe@example.com",
    "role": "STUDENT",
    "profile": {
      "phone": "+1234567890",
      "address": "123 Main St, City, Country",
      "semester": 2,
      "rollNumber": "CS2024001",
      "registrationNumber": "REG202400001"
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-02T00:00:00Z"
  }
}
```

### Logout
**Endpoint:** `POST /auth/logout`

**Description:** Logout user and invalidate refresh token.

**Request Headers:**
- `Authorization: Bearer {jwt_token}`

**Request Body:**
```json
{
  "refreshToken": "refresh-token-here"
}
```

**Request Fields:**
- `refreshToken` (string, required): Refresh token to invalidate

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## Student Features

### Get Student Dashboard
**Endpoint:** `GET /student/dashboard/{userId}`

**Description:** Retrieve dashboard data for a student including attendance summary, recent activities, and notifications.

**Path Parameters:**
- `userId` (string, required): User ID of the student

**Request Headers:**
- `Authorization: Bearer {jwt_token}`

**Response:**
```json
{
  "success": true,
  "message": "Student dashboard retrieved successfully",
  "data": {
    "attendanceSummary": {
      "totalClasses": 100,
      "presentClasses": 85,
      "absentClasses": 10,
      "leaveClasses": 5,
      "attendancePercentage": 85.0
    },
    "recentAttendance": [
      {
        "id": "attendance-uuid",
        "date": "2024-12-19",
        "status": "PRESENT",
        "course": {
          "id": "course-uuid",
          "name": "Data Structures",
          "code": "DS101"
        }
      }
    ],
    "leaveRequests": [
      {
        "id": "leave-uuid",
        "startDate": "2024-12-20",
        "endDate": "2024-12-22",
        "reason": "Medical Leave",
        "status": "PENDING"
      }
    ],
    "notifications": [
      {
        "id": "notification-uuid",
        "title": "Class Schedule Change",
        "message": "Tomorrow's Data Structures class is moved to Room 102",
        "type": "SCHEDULE",
        "isRead": false,
        "createdAt": "2024-12-19T10:00:00Z"
      }
    ]
  }
}
```

### Get Student Profile
**Endpoint:** `GET /student/profile/{userId}`

**Description:** Retrieve detailed profile information for the authenticated student.

**Path Parameters:**
- `userId` (string, required): User ID of the student

**Request Headers:**
- `Authorization: Bearer {jwt_token}`

**Response:**
```json
{
  "success": true,
  "message": "Student profile retrieved successfully",
  "data": {
    "id": "student-uuid",
    "userId": "user-uuid",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "address": "123 Main St, City, Country",
    "semester": 2,
    "rollNumber": "CS2024001",
    "registrationNumber": "REG202400001",
    "departmentId": "dept-uuid",
    "batchId": "batch-uuid",
    "department": {
      "id": "dept-uuid",
      "name": "Computer Science",
      "code": "CS"
    },
    "batch": {
      "id": "batch-uuid",
      "name": "Batch 2024-2028",
      "year": 2024
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### Update Student Profile
**Endpoint:** `PATCH /student/profile/{userId}`

**Description:** Update the authenticated student's profile information.

**Path Parameters:**
- `userId` (string, required): User ID of the student

**Request Headers:**
- `Authorization: Bearer {jwt_token}`

**Request Body:**
```json
{
  "name": "John Smith",
  "phone": "+1234567890"
}
```

**Request Fields:**
- `name` (string, optional): Updated student name
- `phone` (string, optional): Updated phone number
- `address` (string, optional): Updated address

**Response:**
```json
{
  "success": true,
  "message": "Student profile updated successfully",
  "data": {
    "id": "student-uuid",
    "userId": "user-uuid",
    "name": "John Smith",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "address": "123 Main St, City, Country",
    "semester": 2,
    "rollNumber": "CS2024001",
    "registrationNumber": "REG202400001",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-02T00:00:00Z"
  }
}
```

### Get Attendance Records
**Endpoint:** `GET /student/{userId}/attendance`

**Description:** Retrieve attendance records for the authenticated student within a date range.

**Path Parameters:**
- `userId` (string, required): User ID of the student

**Request Headers:**
- `Authorization: Bearer {jwt_token}`

**Query Parameters:**
- `startDate` (string, optional): Start date for attendance records (YYYY-MM-DD)
- `endDate` (string, optional): End date for attendance records (YYYY-MM-DD)
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Number of items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "message": "Student attendance retrieved successfully",
  "data": {
    "attendanceRecords": [
      {
        "id": "attendance-uuid",
        "date": "2024-12-19",
        "status": "PRESENT",
        "checkInTime": "09:05:00",
        "checkOutTime": "10:30:00",
        "course": {
          "id": "course-uuid",
          "name": "Data Structures",
          "code": "DS101"
        },
        "teacher": {
          "id": "teacher-uuid",
          "name": "Jane Smith"
        }
      }
    ],
    "summary": {
      "totalClasses": 50,
      "presentClasses": 42,
      "absentClasses": 6,
      "leaveClasses": 2,
      "attendancePercentage": 84.0
    },
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3
    }
  }
}
```

### Get Attendance Summary
**Endpoint:** `GET /student/{userId}/attendance-summary`

**Description:** Retrieve attendance summary for the authenticated student.

**Path Parameters:**
- `userId` (string, required): User ID of the student

**Request Headers:**
- `Authorization: Bearer {jwt_token}`

**Response:**
```json
{
  "success": true,
  "message": "Attendance summary retrieved successfully",
  "data": {
    "totalClasses": 100,
    "presentClasses": 85,
    "absentClasses": 10,
    "leaveClasses": 5,
    "attendancePercentage": 85.0,
    "byCourse": [
      {
        "courseId": "course-uuid",
        "courseName": "Data Structures",
        "courseCode": "DS101",
        "totalClasses": 30,
        "presentClasses": 25,
        "absentClasses": 3,
        "leaveClasses": 2,
        "attendancePercentage": 83.3
      }
    ],
    "byMonth": [
      {
        "month": "2024-12",
        "totalClasses": 20,
        "presentClasses": 17,
        "absentClasses": 2,
        "leaveClasses": 1,
        "attendancePercentage": 85.0
      }
    ]
  }
}
```

### Submit Leave Request
**Endpoint:** `POST /student/{userId}/leave-request`

**Description:** Submit a leave request for the authenticated student.

**Path Parameters:**
- `userId` (string, required): User ID of the student

**Request Headers:**
- `Authorization: Bearer {jwt_token}`

**Request Body:**
```json
{
  "startDate": "2024-12-20",
  "endDate": "2024-12-22",
  "reason": "Medical Leave"
}
```

**Request Fields:**
- `startDate` (string, required): Leave start date (YYYY-MM-DD)
- `endDate` (string, required): Leave end date (YYYY-MM-DD)
- `reason` (string, required): Reason for leave request

**Response:**
```json
{
  "success": true,
  "message": "Leave request submitted successfully",
  "data": {
    "id": "leave-uuid",
    "studentId": "student-uuid",
    "startDate": "2024-12-20",
    "endDate": "2024-12-22",
    "reason": "Medical Leave",
    "status": "PENDING",
    "createdAt": "2024-12-19T00:00:00Z",
    "updatedAt": "2024-12-19T00:00:00Z"
  }
}
```

---

## Teacher Features

### Get Teacher Dashboard
**Endpoint:** `GET /teacher/{userId}/dashboard`

**Description:** Retrieve dashboard data for a teacher including class schedules, attendance statistics, and pending requests.

**Path Parameters:**
- `userId` (string, required): User ID of the teacher

**Request Headers:**
- `Authorization: Bearer {jwt_token}`

**Response:**
```json
{
  "success": true,
  "message": "Teacher dashboard retrieved successfully",
  "data": {
    "statistics": {
      "totalStudents": 150,
      "totalCourses": 5,
      "todayClasses": 3,
      "pendingLeaveRequests": 2
    },
    "todaySchedule": [
      {
        "id": "schedule-uuid",
        "course": {
          "id": "course-uuid",
          "name": "Data Structures",
          "code": "DS101"
        },
        "time": "09:00 - 10:30",
        "room": "Room 101",
        "batch": {
          "id": "batch-uuid",
          "name": "Batch 2024-2028"
        }
      }
    ],
    "recentAttendance": [
      {
        "id": "attendance-uuid",
        "date": "2024-12-19",
        "course": "Data Structures",
        "presentStudents": 45,
        "totalStudents": 50
      }
    ],
    "pendingLeaveRequests": [
      {
        "id": "leave-uuid",
        "student": {
          "id": "student-uuid",
          "name": "John Doe"
        },
        "startDate": "2024-12-20",
        "endDate": "2024-12-22",
        "reason": "Medical Leave"
      }
    ]
  }
}
```

### Get Teacher Profile
**Endpoint:** `GET /teacher/user/{userId}/profile`

**Description:** Retrieve profile information for the authenticated teacher.

**Path Parameters:**
- `userId` (string, required): User ID of the teacher

**Request Headers:**
- `Authorization: Bearer {jwt_token}`

**Response:**
```json
{
  "success": true,
  "message": "Teacher profile retrieved successfully",
  "data": {
    "id": "teacher-uuid",
    "userId": "user-uuid",
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "phone": "+1234567890",
    "designation": "Assistant Professor",
    "specialization": "Data Science",
    "departmentId": "dept-uuid",
    "department": {
      "id": "dept-uuid",
      "name": "Computer Science",
      "code": "CS"
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### Mark Attendance
**Endpoint:** `POST /teacher/{userId}/attendance/mark`

**Description:** Mark attendance for students in a specific course.

**Path Parameters:**
- `userId` (string, required): User ID of the teacher

**Request Headers:**
- `Authorization: Bearer {jwt_token}`

**Request Body:**
```json
{
  "courseId": "course-uuid",
  "date": "2024-12-19T10:00:00Z",
  "attendanceRecords": [
    {
      "studentId": "student-uuid-1",
      "status": "PRESENT"
    },
    {
      "studentId": "student-uuid-2",
      "status": "ABSENT"
    }
  ]
}
```

**Request Fields:**
- `courseId` (string, required): Course ID for which attendance is being marked
- `date` (string, required): Date and time of the class (ISO 8601 format)
- `attendanceRecords` (array, required): Array of attendance records
  - `studentId` (string, required): Student ID
  - `status` (string, required): Attendance status (PRESENT, ABSENT, LEAVE)

**Response:**
```json
{
  "success": true,
  "message": "Attendance marked successfully",
  "data": {
    "attendanceId": "attendance-uuid",
    "courseId": "course-uuid",
    "date": "2024-12-19T10:00:00Z",
    "markedBy": "teacher-uuid",
    "totalStudents": 2,
    "presentCount": 1,
    "absentCount": 1,
    "attendanceRecords": [
      {
        "studentId": "student-uuid-1",
        "status": "PRESENT"
      },
      {
        "studentId": "student-uuid-2",
        "status": "ABSENT"
      }
    ]
  }
}
```

### Bulk Mark Attendance
**Endpoint:** `POST /teacher/{userId}/attendance/bulk`

**Description:** Bulk mark attendance for multiple students in a course.

**Path Parameters:**
- `userId` (string, required): User ID of the teacher

**Request Headers:**
- `Authorization: Bearer {jwt_token}`

**Request Body:**
```json
{
  "courseId": "course-uuid",
  "date": "2024-12-19T10:00:00Z",
  "attendances": [
    {
      "studentId": "student-uuid-1",
      "status": "PRESENT"
    },
    {
      "studentId": "student-uuid-2",
      "status": "ABSENT"
    }
  ]
}
```

**Request Fields:**
- `courseId` (string, required): Course ID for which attendance is being marked
- `date` (string, required): Date and time of the class (ISO 8601 format)
- `attendances` (array, required): Array of attendance records
  - `studentId` (string, required): Student ID
  - `status` (string, required): Attendance status (PRESENT, ABSENT, LEAVE)

**Response:**
```json
{
  "success": true,
  "message": "Bulk attendance marked successfully",
  "data": {
    "attendanceId": "attendance-uuid",
    "courseId": "course-uuid",
    "date": "2024-12-19T10:00:00Z",
    "markedBy": "teacher-uuid",
    "totalStudents": 2,
    "presentCount": 1,
    "absentCount": 1,
    "attendances": [
      {
        "studentId": "student-uuid-1",
        "status": "PRESENT"
      },
      {
        "studentId": "student-uuid-2",
        "status": "ABSENT"
      }
    ]
  }
}
```

### Generate QR Code (Enhanced)
**Endpoint:** `POST /qr/generate`

**Description:** Generate a QR code for attendance marking with comprehensive validation and settings.

**Request Headers:**
- `Authorization: Bearer {jwt_token}`

**Request Body:**
```json
{
  "courseId": "course-uuid",
  "teacherId": "teacher-uuid",
  "validFrom": "2025-12-24T10:00:00Z",
  "validUntil": "2025-12-24T10:30:00Z",
  "maxUses": 50,
  "location": "Room 101",
  "description": "Lecture 5 - Data Structures"
}
```

**Request Fields:**
- `courseId` (string, required): Course ID for the QR code
- `teacherId` (string, required): Teacher ID generating the QR code
- `validFrom` (string, optional): Token activation timestamp (ISO 8601 format)
- `validUntil` (string, optional): Token expiration timestamp (ISO 8601 format, default: current time + 30 minutes)
- `maxUses` (number, optional): Maximum number of uses allowed (default: 1, max: 1000)
- `location` (string, optional): Optional location description (max 255 characters)
- `description` (string, optional): Optional description for the QR code (max 500 characters)

**Response:**
```json
{
  "success": true,
  "message": "QR token generated successfully",
  "data": {
    "id": "qr-token-uuid",
    "code": "qr-token-string",
    "courseId": "course-uuid",
    "teacherId": "teacher-uuid",
    "validFrom": "2025-12-24T10:00:00Z",
    "validUntil": "2025-12-24T10:30:00Z",
    "maxUses": 50,
    "usedCount": 0,
    "status": "ACTIVE",
    "location": "Room 101",
    "description": "Lecture 5 - Data Structures",
    "qrCodeUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "createdAt": "2025-12-24T10:00:00Z",
    "updatedAt": "2025-12-24T10:00:00Z"
  }
}
```

### Get Pending Leave Requests
**Endpoint:** `GET /teacher/{userId}/leaves/pending`

**Description:** Retrieve pending leave requests for the authenticated teacher to approve/reject.

**Path Parameters:**
- `userId` (string, required): User ID of the teacher

**Request Headers:**
- `Authorization: Bearer {jwt_token}`

**Query Parameters:**
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Number of items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "message": "Pending leave requests retrieved successfully",
  "data": {
    "leaveRequests": [
      {
        "id": "leave-uuid",
        "studentId": "student-uuid",
        "startDate": "2024-12-20",
        "endDate": "2024-12-22",
        "reason": "Medical Leave",
        "status": "PENDING",
        "student": {
          "id": "student-uuid",
          "name": "John Doe",
          "rollNumber": "CS2024001"
        },
        "createdAt": "2024-12-19T00:00:00Z",
        "updatedAt": "2024-12-19T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 2,
      "totalPages": 1
    }
  }
}
```

### Approve/Reject Leave Request
**Endpoint:** `PUT /teacher/{userId}/leaves/{leaveId}/approve`

**Description:** Approve or reject a leave request.

**Path Parameters:**
- `userId` (string, required): User ID of the teacher
- `leaveId` (string, required): Unique identifier of the leave request

**Request Headers:**
- `Authorization: Bearer {jwt_token}`

**Request Body:**
```json
{
  "status": "APPROVED",
  "rejectionReason": "Optional rejection reason"
}
```

**Request Fields:**
- `status` (string, required): New status (APPROVED or REJECTED)
- `rejectionReason` (string, optional): Reason for rejection (required if status is REJECTED)

**Response:**
```json
{
  "success": true,
  "message": "Leave request processed successfully",
  "data": {
    "id": "leave-uuid",
    "status": "APPROVED",
    "processedBy": "teacher-uuid",
    "processedAt": "2024-12-19T10:00:00Z",
    "rejectionReason": null
  }
}
```

### Get Today's Schedule
**Endpoint:** `GET /teacher/{userId}/schedules/today`

**Description:** Retrieve today's class schedule for the authenticated teacher.

**Path Parameters:**
- `userId` (string, required): User ID of the teacher

**Request Headers:**
- `Authorization: Bearer {jwt_token}`

**Response:**
```json
{
  "success": true,
  "message": "Today's schedule retrieved successfully",
  "data": {
    "schedules": [
      {
        "id": "schedule-uuid",
        "course": {
          "id": "course-uuid",
          "name": "Data Structures",
          "code": "DS101"
        },
        "batch": {
          "id": "batch-uuid",
          "name": "Batch 2024-2028"
        },
        "dayOfWeek": 4,
        "startTime": "09:00",
        "endTime": "10:30",
        "room": "Room 101",
        "semester": 1
      }
    ],
    "totalClasses": 3
  }
}
```

### Get Teacher Schedules
**Endpoint:** `GET /teacher/{userId}/schedules`

**Description:** Retrieve class schedules for the authenticated teacher within a date range.

**Path Parameters:**
- `userId` (string, required): User ID of the teacher

**Request Headers:**
- `Authorization: Bearer {jwt_token}`

**Query Parameters:**
- `startDate` (string, optional): Start date for schedules (YYYY-MM-DD)
- `endDate` (string, optional): End date for schedules (YYYY-MM-DD)
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Number of items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "message": "Teacher schedules retrieved successfully",
  "data": {
    "schedules": [
      {
        "id": "schedule-uuid",
        "course": {
          "id": "course-uuid",
          "name": "Data Structures",
          "code": "DS101"
        },
        "batch": {
          "id": "batch-uuid",
          "name": "Batch 2024-2028"
        },
        "dayOfWeek": 1,
        "startTime": "09:00",
        "endTime": "10:30",
        "room": "Room 101",
        "semester": 1
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 25,
      "totalPages": 2
    }
  }
}
```

### Create Class Schedule
**Endpoint:** `POST /teacher/{userId}/schedules`

**Description:** Create a new class schedule for the authenticated teacher.

**Path Parameters:**
- `userId` (string, required): User ID of the teacher

**Request Headers:**
- `Authorization: Bearer {jwt_token}`

**Request Body:**
```json
{
  "courseId": "course-uuid",
  "batchId": "batch-uuid",
  "dayOfWeek": 1,
  "startTime": "09:00",
  "endTime": "10:30",
  "room": "Room 101",
  "semester": 1
}
```

**Request Fields:**
- `courseId` (string, required): Course ID for the schedule
- `batchId` (string, required): Batch ID for the schedule
- `dayOfWeek` (number, required): Day of week (1=Monday, 7=Sunday)
- `startTime` (string, required): Start time (HH:MM format)
- `endTime` (string, required): End time (HH:MM format)
- `room` (string, required): Room number/location
- `semester` (number, required): Semester number

**Response:**
```json
{
  "success": true,
  "message": "Class schedule created successfully",
  "data": {
    "id": "schedule-uuid",
    "courseId": "course-uuid",
    "batchId": "batch-uuid",
    "teacherId": "teacher-uuid",
    "dayOfWeek": 1,
    "startTime": "09:00",
    "endTime": "10:30",
    "room": "Room 101",
    "semester": 1,
    "createdAt": "2024-12-19T00:00:00Z",
    "updatedAt": "2024-12-19T00:00:00Z"
  }
}
```

### Get Course Attendance
**Endpoint:** `GET /teacher/{userId}/courses/{courseId}/attendance`

**Description:** Retrieve attendance records for a specific course taught by the teacher.

**Path Parameters:**
- `userId` (string, required): User ID of the teacher
- `courseId` (string, required): Course ID

**Request Headers:**
- `Authorization: Bearer {jwt_token}`

**Query Parameters:**
- `startDate` (string, optional): Start date for attendance records (YYYY-MM-DD)
- `endDate` (string, optional): End date for attendance records (YYYY-MM-DD)
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Number of items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "message": "Course attendance retrieved successfully",
  "data": {
    "attendanceRecords": [
      {
        "id": "attendance-uuid",
        "date": "2024-12-19",
        "presentStudents": 45,
        "totalStudents": 50,
        "absentStudents": 5
      }
    ],
    "summary": {
      "totalClasses": 30,
      "averageAttendance": 90.0,
      "highestAttendance": 95.0,
      "lowestAttendance": 85.0
    },
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 30,
      "totalPages": 2
    }
  }
}
```

### Get Course Attendance Summary
**Endpoint:** `GET /teacher/{userId}/courses/{courseId}/attendance/summary`

**Description:** Retrieve attendance summary for a specific course taught by the teacher.

**Path Parameters:**
- `userId` (string, required): User ID of the teacher
- `courseId` (string, required): Course ID

**Request Headers:**
- `Authorization: Bearer {jwt_token}`

**Response:**
```json
{
  "success": true,
  "message": "Course attendance summary retrieved successfully",
  "data": {
    "totalClasses": 30,
    "totalStudents": 50,
    "averageAttendance": 90.0,
    "presentPercentage": 90.0,
    "absentPercentage": 8.0,
    "leavePercentage": 2.0,
    "byStudent": [
      {
        "studentId": "student-uuid",
        "studentName": "John Doe",
        "rollNumber": "CS2024001",
        "totalClasses": 30,
        "presentClasses": 28,
        "absentClasses": 2,
        "leaveClasses": 0,
        "attendancePercentage": 93.3
      }
    ],
    "byMonth": [
      {
        "month": "2024-12",
        "totalClasses": 10,
        "presentClasses": 9,
        "absentClasses": 1,
        "leaveClasses": 0,
        "attendancePercentage": 90.0
      }
    ]
  }
}
```

---

## Assignment Operations (Teacher)

### Enroll Student in Course
**Endpoint:** `POST /assignments/student-to-course`

**Description:** Enroll a student in a specific course.

**Request Headers:**
- `Authorization: Bearer {jwt_token}`

**Request Body:**
```json
{
  "studentId": "student-uuid",
  "courseId": "course-uuid"
}
```

**Request Fields:**
- `studentId` (string, required): Student ID to enroll
- `courseId` (string, required): Course ID to enroll in

**Response:**
```json
{
  "success": true,
  "message": "Student enrolled in course successfully",
  "data": {
    "id": "enrollment-uuid",
    "studentId": "student-uuid",
    "courseId": "course-uuid",
    "enrolledAt": "2024-12-19T00:00:00Z"
  }
}
```

### Unenroll Student from Course
**Endpoint:** `DELETE /assignments/student-from-course/{studentId}/{courseId}`

**Description:** Unenroll a student from a specific course.

**Path Parameters:**
- `studentId` (string, required): Student ID to unenroll
- `courseId` (string, required): Course ID to unenroll from

**Request Headers:**
- `Authorization: Bearer {jwt_token}`

**Response:**
```json
{
  "success": true,
  "message": "Student unenrolled from course successfully"
}
```

---

## Admin Basic Features

### Admin Login
**Endpoint:** `POST /admin/auth/login`

**Description:** Authenticate as an administrator to access admin features in the frontend.

**Request Body:**
```json
{
  "email": "admin@attendflow.com",
  "password": "admin123"
}
```

**Request Fields:**
- `email` (string, required): Administrator email address
- `password` (string, required): Administrator password

**Response:**
```json
{
  "success": true,
  "message": "Admin login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "admin-uuid",
      "name": "Admin User",
      "email": "admin@attendflow.com",
      "role": "ADMIN",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

---

## Common Features

### Get Notifications
**Endpoint:** `GET /notification`

**Description:** Retrieve notifications for the authenticated user with filtering.

**Request Headers:**
- `Authorization: Bearer {jwt_token}`

**Query Parameters:**
- `userId` (string, optional): Filter by user ID
- `type` (string, optional): Filter by notification type (GENERAL, SCHEDULE, ATTENDANCE, LEAVE)
- `isRead` (boolean, optional): Filter by read status
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Number of items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "message": "Notifications retrieved successfully",
  "data": {
    "notifications": [
      {
        "id": "notification-uuid",
        "title": "Class Schedule Change",
        "message": "Tomorrow's Data Structures class is moved to Room 102",
        "type": "SCHEDULE",
        "userId": "user-uuid",
        "isRead": false,
        "createdAt": "2024-12-19T10:00:00Z",
        "updatedAt": "2024-12-19T10:00:00Z"
      }
    ],
    "unreadCount": 5,
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

### Mark Notification as Read
**Endpoint:** `PATCH /notification/{notificationId}`

**Description:** Mark a notification as read.

**Path Parameters:**
- `notificationId` (string, required): Unique identifier of the notification

**Request Headers:**
- `Authorization: Bearer {jwt_token}`

**Request Body:**
```json
{
  "isRead": true
}
```

**Request Fields:**
- `isRead` (boolean, required): Read status to set

**Response:**
```json
{
  "success": true,
  "message": "Notification updated successfully",
  "data": {
    "id": "notification-uuid",
    "isRead": true,
    "updatedAt": "2024-12-19T11:00:00Z"
  }
}
```

### Get Single Notification
**Endpoint:** `GET /notification/{notificationId}`

**Description:** Retrieve a specific notification by ID.

**Path Parameters:**
- `notificationId` (string, required): Unique identifier of the notification

**Request Headers:**
- `Authorization: Bearer {jwt_token}`

**Response:**
```json
{
  "success": true,
  "message": "Notification retrieved successfully",
  "data": {
    "id": "notification-uuid",
    "title": "Class Schedule Change",
    "message": "Tomorrow's Data Structures class is moved to Room 102",
    "type": "SCHEDULE",
    "userId": "user-uuid",
    "isRead": false,
    "createdAt": "2024-12-19T10:00:00Z",
    "updatedAt": "2024-12-19T10:00:00Z"
  }
}
```

---

## QR Code Features

### QR Check-In (Enhanced)
**Endpoint:** `POST /qr/validate`

**Description:** Validate QR code and mark student attendance with comprehensive validation and automatic attendance creation.

**Request Headers:**
- `Authorization: Bearer {jwt_token}`

**Request Body:**
```json
{
  "token": "qr-token-here",
  "userId": "user-uuid",
  "location": "Room 101",
  "ipAddress": "192.168.1.100",
  "userAgent": "AttendFlow Mobile App 1.0"
}
```

**Request Fields:**
- `token` (string, required): QR token string
- `userId` (string, required): User ID of the student checking in
- `location` (string, optional): Location where QR code is being scanned (max 255 characters)
- `ipAddress` (string, optional): Client IP address (auto-captured by server if not provided)
- `userAgent` (string, optional): Client user agent string (auto-captured by server if not provided)

**Response:**
```json
{
  "success": true,
  "message": "QR code validated and check-in recorded successfully",
  "data": {
    "checkIn": {
      "id": "check-in-uuid",
      "qrCodeId": "qr-token-uuid",
      "userId": "user-uuid",
      "checkInTime": "2025-12-24T10:05:00Z",
      "location": "Room 101",
      "ipAddress": "192.168.1.100",
      "userAgent": "AttendFlow Mobile App 1.0",
      "isValid": true,
      "createdAt": "2025-12-24T10:05:00Z"
    },
    "attendance": {
      "id": "attendance-uuid",
      "userId": "user-uuid",
      "courseId": "course-uuid",
      "date": "2025-12-24T00:00:00Z",
      "status": "PRESENT",
      "checkIn": "2025-12-24T10:05:00Z",
      "qRCodeId": "qr-token-uuid",
      "markedBy": "teacher-uuid"
    },
    "message": "QR token validated successfully. Attendance has been recorded."
  }
}
```

### Get QR Tokens
**Endpoint:** `GET /qr`

**Description:** Retrieve list of QR tokens with filtering and pagination.

**Request Headers:**
- `Authorization: Bearer {jwt_token}`

**Query Parameters:**
- `courseId` (string, optional): Filter by course ID
- `teacherId` (string, optional): Filter by teacher ID
- `status` (string, optional): Filter by status (ACTIVE, EXPIRED, USED)
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Number of items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "message": "QR tokens retrieved successfully",
  "data": {
    "qrTokens": [
      {
        "id": "qr-token-uuid",
        "code": "qr-token-string",
        "courseId": "course-uuid",
        "teacherId": "teacher-uuid",
        "validFrom": "2025-12-24T10:00:00Z",
        "validUntil": "2025-12-24T10:30:00Z",
        "maxUses": 50,
        "usedCount": 12,
        "status": "ACTIVE",
        "location": "Room 101",
        "description": "Lecture 5 - Data Structures",
        "createdAt": "2025-12-24T10:00:00Z",
        "updatedAt": "2025-12-24T10:00:00Z",
        "course": {
          "id": "course-uuid",
          "name": "Data Structures",
          "code": "DS101"
        },
        "teacher": {
          "id": "teacher-uuid",
          "name": "Jane Smith"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

### Get QR Check-ins
**Endpoint:** `GET /qr/check-ins`

**Description:** Retrieve QR code check-in records with filtering and pagination.

**Request Headers:**
- `Authorization: Bearer {jwt_token}`

**Query Parameters:**
- `tokenId` (string, optional): Filter by QR token ID
- `userId` (string, optional): Filter by user ID
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Number of items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "message": "QR check-ins retrieved successfully",
  "data": {
    "checkIns": [
      {
        "id": "check-in-uuid",
        "qrCodeId": "qr-token-uuid",
        "userId": "user-uuid",
        "checkInTime": "2025-12-24T10:05:00Z",
        "location": "Room 101",
        "ipAddress": "192.168.1.100",
        "userAgent": "AttendFlow Mobile App 1.0",
        "isValid": true,
        "createdAt": "2025-12-24T10:05:00Z",
        "user": {
          "id": "user-uuid",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "qrCode": {
          "id": "qr-token-uuid",
          "code": "qr-token-string",
          "course": {
            "id": "course-uuid",
            "name": "Data Structures",
            "code": "DS101"
          }
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "totalPages": 8
    }
  }
}
```

### Get QR Statistics
**Endpoint:** `GET /qr/statistics`

**Description:** Retrieve comprehensive QR code usage statistics with filtering.

**Request Headers:**
- `Authorization: Bearer {jwt_token}`

**Query Parameters:**
- `courseId` (string, optional): Filter by course ID
- `teacherId` (string, optional): Filter by teacher ID
- `startDate` (string, optional): Start date for statistics (YYYY-MM-DD)
- `endDate` (string, optional): End date for statistics (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "message": "QR statistics retrieved successfully",
  "data": {
    "summary": {
      "totalTokens": 125,
      "activeTokens": 8,
      "expiredTokens": 95,
      "usedTokens": 117,
      "totalCheckIns": 156,
      "uniqueStudents": 89,
      "averageCheckInsPerToken": 1.25
    },
    "byDate": [
      {
        "date": "2025-12-24",
        "tokensGenerated": 12,
        "checkIns": 45,
        "uniqueStudents": 32
      }
    ],
    "byCourse": [
      {
        "courseId": "course-uuid",
        "courseName": "Data Structures",
        "tokensGenerated": 25,
        "totalCheckIns": 78,
        "uniqueStudents": 45,
        "averageUsage": 3.12
      }
    ],
    "byTeacher": [
      {
        "teacherId": "teacher-uuid",
        "teacherName": "Jane Smith",
        "tokensGenerated": 18,
        "totalCheckIns": 56,
        "uniqueStudents": 34,
        "averageUsage": 3.11
      }
    ]
  }
}
```

---

## Error Responses

All API endpoints return consistent error responses in the following format:

```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Detailed error information"
  }
}
```

### Common Error Codes

- `UNAUTHORIZED` (401): Authentication failed or token expired
- `FORBIDDEN` (403): User does not have permission to access this resource
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (400): Request validation failed
- `DUPLICATE_ENTRY` (409): Duplicate data entry (e.g., email already exists)
- `QR_CODE_EXPIRED` (410): QR code has expired
- `QR_CODE_USED` (409): QR code has already been used
- `INTERNAL_SERVER_ERROR` (500): Internal server error

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- Authentication endpoints: 5 requests per minute
- QR code validation: 10 requests per minute
- General endpoints: 100 requests per minute

Rate limit headers are included in all responses:
- `X-RateLimit-Limit`: Maximum requests per window
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Time when rate limit resets (Unix timestamp)

---

## Pagination

All list endpoints support pagination with the following query parameters:

- `page`: Page number (starting from 1)
- `limit`: Number of items per page (default: 10-20 depending on endpoint, maximum: 100)

Pagination response format:
```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "totalPages": 15
  }
}
```

---

## WebSocket Events (Real-time Updates)

The frontend application supports real-time updates via WebSocket connections for enhanced user experience.

### Connection Setup
```javascript
const ws = new WebSocket('ws://localhost:5000/ws');

// Authenticate with JWT token
ws.send(JSON.stringify({
  type: 'auth',
  token: 'your-jwt-token'
}));

// Listen for messages
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  handleRealtimeUpdate(data);
};
```

### Available Events

#### For Students
- `attendance_marked`: When your attendance is marked
- `leave_request_approved`: When your leave request is approved
- `leave_request_rejected`: When your leave request is rejected
- `schedule_updated`: When your class schedule is updated
- `notification_created`: When a new notification is created for you

#### For Teachers
- `leave_request_submitted`: When a student submits a leave request
- `attendance_marked`: When attendance is marked in your class
- `qr_code_scanned`: When a student scans your QR code
- `notification_created`: When a new notification is created for you

#### For All Users
- `system_maintenance`: When system maintenance is scheduled
- `feature_update`: When new features are available

### Event Payload Examples

```json
{
  "type": "attendance_marked",
  "data": {
    "attendanceId": "attendance-uuid",
    "courseId": "course-uuid",
    "studentId": "student-uuid",
    "status": "PRESENT",
    "timestamp": "2024-12-19T10:05:00Z"
  }
}

{
  "type": "leave_request_approved",
  "data": {
    "leaveId": "leave-uuid",
    "studentId": "student-uuid",
    "status": "APPROVED",
    "approvedBy": "teacher-uuid",
    "timestamp": "2024-12-19T10:00:00Z"
  }
}
```

---

## Mobile App Specific Features

### Push Notifications
For mobile applications, push notifications are supported through device tokens.

#### Register Device Token
**Endpoint:** `POST /notification/device-token`

**Description:** Register a device token for push notifications.

**Request Headers:**
- `Authorization: Bearer {jwt_token}`

**Request Body:**
```json
{
  "deviceToken": "device-token-here",
  "platform": "ios" // or "android"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Device token registered successfully"
}
```

#### Unregister Device Token
**Endpoint:** `DELETE /notification/device-token`

**Description:** Unregister a device token from push notifications.

**Request Headers:**
- `Authorization: Bearer {jwt_token}`

**Request Body:**
```json
{
  "deviceToken": "device-token-here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Device token unregistered successfully"
}
```

---

## File Upload Features

### Profile Picture Upload
**Endpoint:** `POST /auth/profile-picture`

**Description:** Upload a profile picture for the authenticated user.

**Request Headers:**
- `Authorization: Bearer {jwt_token}`
- `Content-Type: multipart/form-data`

**Request Body (FormData):**
- `file`: Image file (JPEG, PNG, max 5MB)

**Response:**
```json
{
  "success": true,
  "message": "Profile picture uploaded successfully",
  "data": {
    "profilePictureUrl": "https://example.com/uploads/profile-pictures/user-uuid.jpg"
  }
}
```

### Document Upload
**Endpoint:** `POST /student/{userId}/documents`

**Description:** Upload documents for a student (e.g., medical certificates, ID cards).

**Path Parameters:**
- `userId` (string, required): User ID of the student

**Request Headers:**
- `Authorization: Bearer {jwt_token}`
- `Content-Type: multipart/form-data`

**Request Body (FormData):**
- `file`: Document file (PDF, JPEG, PNG, max 10MB)
- `documentType`: Type of document (MEDICAL_CERTIFICATE, ID_CARD, etc.)

**Response:**
```json
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": {
    "documentId": "document-uuid",
    "documentUrl": "https://example.com/uploads/documents/document-uuid.pdf",
    "documentType": "MEDICAL_CERTIFICATE",
    "uploadedAt": "2024-12-19T00:00:00Z"
  }
}
```

---

## API Usage Examples

### Student Daily Workflow
```bash
# 1. Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123"
  }'

# 2. Get dashboard
curl -X GET http://localhost:5000/api/v1/student/dashboard/user-uuid \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 3. Check QR code for attendance
curl -X POST http://localhost:5000/api/v1/qr/validate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "qr-token-from-teacher",
    "userId": "user-uuid",
    "studentId": "student-uuid"
  }'

# 4. Submit leave request
curl -X POST http://localhost:5000/api/v1/student/user-uuid/leave-request \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "2024-12-20",
    "endDate": "2024-12-22",
    "reason": "Medical Leave"
  }'
```

### Teacher Daily Workflow
```bash
# 1. Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@example.com",
    "password": "password123"
  }'

# 2. Get today's schedule
curl -X GET http://localhost:5000/api/v1/teacher/user-uuid/schedules/today \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 3. Generate QR code for class
curl -X POST http://localhost:5000/api/v1/qr/generate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "courseId": "course-uuid",
    "teacherId": "user-uuid"
  }'

# 4. Mark attendance manually
curl -X POST http://localhost:5000/api/v1/teacher/user-uuid/attendance/mark \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "courseId": "course-uuid",
    "date": "2024-12-19T10:00:00Z",
    "attendanceRecords": [
      {
        "studentId": "student-uuid-1",
        "status": "PRESENT"
      },
      {
        "studentId": "student-uuid-2",
        "status": "ABSENT"
      }
    ]
  }'

# 5. Process leave requests
curl -X PUT http://localhost:5000/api/v1/teacher/user-uuid/leaves/leave-uuid/approve \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "APPROVED"
  }'
```

---

## Frontend Integration Guidelines

### Authentication Flow
1. Store JWT tokens securely (localStorage for web, AsyncStorage/keychain for mobile)
2. Implement automatic token refresh using refresh token
3. Handle token expiration and redirect to login
4. Clear tokens on logout

### Real-time Updates
1. Establish WebSocket connection after login
2. Reconnect on connection loss with exponential backoff
3. Handle different event types based on user role
4. Update UI immediately when real-time events received

### Error Handling
1. Display user-friendly error messages
2. Handle network errors gracefully
3. Implement retry logic for failed requests
4. Log errors for debugging

### Performance Optimization
1. Implement pagination for large data sets
2. Cache frequently accessed data
3. Use lazy loading for images and documents
4. Optimize API calls (batch requests when possible)

### Security Considerations
1. Never expose tokens in client-side code
2. Validate all user inputs
3. Use HTTPS in production
4. Implement proper logout functionality
5. Handle session timeout appropriately

---

## Testing and Development

### Frontend Testing
```javascript
// Example API service setup
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await api.post('/auth/refresh-token', { refreshToken });
      localStorage.setItem('accessToken', response.data.accessToken);
      return api.request(error.config);
    }
    return Promise.reject(error);
  }
);
```

### WebSocket Integration
```javascript
// Real-time notification service
class NotificationService {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect(token) {
    this.ws = new WebSocket(`ws://localhost:5000/ws`);

    this.ws.onopen = () => {
      this.ws.send(JSON.stringify({
        type: 'auth',
        token: token
      }));
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };

    this.ws.onclose = () => {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => {
          this.reconnectAttempts++;
          this.connect(token);
        }, 1000 * Math.pow(2, this.reconnectAttempts));
      }
    };
  }

  handleMessage(data) {
    switch (data.type) {
      case 'attendance_marked':
        this.updateAttendanceUI(data.data);
        break;
      case 'leave_request_approved':
        this.showLeaveNotification(data.data);
        break;
      case 'notification_created':
        this.addNotification(data.data);
        break;
    }
  }
}
```

---

## Support and Maintenance

### Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Mobile Support
- iOS Safari 13+
- Chrome Mobile 80+
- Samsung Internet 12+

### API Versioning
- Current version: `v1`
- Backward compatibility maintained for minor updates
- Breaking changes will increment version number

### Troubleshooting
- Check browser console for JavaScript errors
- Verify network requests in browser dev tools
- Ensure CORS is properly configured
- Test with different network conditions

For technical support, please contact the development team or refer to the project documentation repository.
