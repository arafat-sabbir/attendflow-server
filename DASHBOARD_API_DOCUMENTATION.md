# AttendFlow Dashboard API Documentation

## Overview

This document provides comprehensive API documentation for the AttendFlow Dashboard Application (Admin Panel). The dashboard is designed for administrators and teachers with enhanced permissions to manage the complete AttendFlow system.

**Base URL:** `http://localhost:5000/api/v1`
**Authentication:** Bearer Token (JWT)

## Authentication

### Admin Login
**Endpoint:** `POST /admin/auth/login`

**Description:** Authenticate as an administrator to access the dashboard with full system permissions.

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

**Response Fields:**
- `success` (boolean): Request success status
- `message` (string): Response message
- `data.accessToken` (string): JWT access token for API calls
- `data.refreshToken` (string): JWT refresh token for token renewal
- `data.user` (object): User information
  - `id` (string): Unique user identifier
  - `name` (string): User's full name
  - `email` (string): User's email address
  - `role` (string): User role (always "ADMIN" for this endpoint)
  - `createdAt` (string): Account creation timestamp
  - `updatedAt` (string): Last update timestamp

---

## Organization Management

### Departments

#### Create Department
**Endpoint:** `POST /organization/departments`

**Description:** Create a new academic department in the system.

**Request Body:**
```json
{
  "name": "Computer Science",
  "code": "CS",
  "description": "Department of Computer Science and Engineering"
}
```

**Request Fields:**
- `name` (string, required): Full name of the department
- `code` (string, required): Short code/abbreviation for the department
- `description` (string, optional): Detailed description of the department

**Response:**
```json
{
  "success": true,
  "message": "Department created successfully",
  "data": {
    "id": "dept-uuid",
    "name": "Computer Science",
    "code": "CS",
    "description": "Department of Computer Science and Engineering",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### Get All Departments
**Endpoint:** `GET /organization/departments`

**Description:** Retrieve a paginated list of all departments with optional search functionality.

**Query Parameters:**
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Number of items per page (default: 20)
- `search` (string, optional): Search term to filter departments by name or code

**Response:**
```json
{
  "success": true,
  "message": "Departments retrieved successfully",
  "data": {
    "departments": [
      {
        "id": "dept-uuid",
        "name": "Computer Science",
        "code": "CS",
        "description": "Department of Computer Science and Engineering",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

#### Get Single Department
**Endpoint:** `GET /organization/departments/{departmentId}`

**Path Parameters:**
- `departmentId` (string, required): Unique identifier of the department

**Response:**
```json
{
  "success": true,
  "message": "Department retrieved successfully",
  "data": {
    "id": "dept-uuid",
    "name": "Computer Science",
    "code": "CS",
    "description": "Department of Computer Science and Engineering",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### Update Department
**Endpoint:** `PATCH /organization/departments/{departmentId}`

**Description:** Update department information. Only provided fields will be updated.

**Path Parameters:**
- `departmentId` (string, required): Unique identifier of the department

**Request Body:**
```json
{
  "name": "Computer Science & Engineering",
  "description": "Updated department description"
}
```

**Request Fields:**
- `name` (string, optional): Updated department name
- `code` (string, optional): Updated department code
- `description` (string, optional): Updated department description

**Response:**
```json
{
  "success": true,
  "message": "Department updated successfully",
  "data": {
    "id": "dept-uuid",
    "name": "Computer Science & Engineering",
    "code": "CS",
    "description": "Updated department description",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-02T00:00:00Z"
  }
}
```

#### Delete Department
**Endpoint:** `DELETE /organization/departments/{departmentId}`

**Description:** Permanently delete a department from the system.

**Path Parameters:**
- `departmentId` (string, required): Unique identifier of the department

**Response:**
```json
{
  "success": true,
  "message": "Department deleted successfully"
}
```

### Semesters

#### Create Semester
**Endpoint:** `POST /organization/semesters`

**Description:** Create a new academic semester.

**Request Body:**
```json
{
  "name": "Fall 2024",
  "year": 2024,
  "departmentId": "dept-uuid",
  "startDate": "2024-09-01",
  "endDate": "2024-12-31"
}
```

**Request Fields:**
- `name` (string, required): Semester name (e.g., "Fall 2024")
- `year` (number, required): Academic year
- `departmentId` (string, required): Department ID this semester belongs to
- `startDate` (string, required): Semester start date (YYYY-MM-DD format)
- `endDate` (string, required): Semester end date (YYYY-MM-DD format)

**Response:**
```json
{
  "success": true,
  "message": "Semester created successfully",
  "data": {
    "id": "semester-uuid",
    "name": "Fall 2024",
    "year": 2024,
    "departmentId": "dept-uuid",
    "startDate": "2024-09-01",
    "endDate": "2024-12-31",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### Get All Semesters
**Endpoint:** `GET /organization/semesters`

**Description:** Retrieve a paginated list of semesters with optional filtering.

**Query Parameters:**
- `departmentId` (string, optional): Filter by department ID
- `year` (number, optional): Filter by academic year
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Number of items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "message": "Semesters retrieved successfully",
  "data": {
    "semesters": [
      {
        "id": "semester-uuid",
        "name": "Fall 2024",
        "year": 2024,
        "departmentId": "dept-uuid",
        "startDate": "2024-09-01",
        "endDate": "2024-12-31",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### Batches

#### Create Batch
**Endpoint:** `POST /organization/batches`

**Description:** Create a new student batch.

**Request Body:**
```json
{
  "name": "Batch 2024-2028",
  "year": 2024,
  "description": "Undergraduate batch 2024-2028",
  "startDate": "2024-09-01",
  "endDate": "2028-06-30"
}
```

**Request Fields:**
- `name` (string, required): Batch name
- `year` (number, required): Starting year of the batch
- `description` (string, optional): Batch description
- `startDate` (string, required): Batch start date (YYYY-MM-DD format)
- `endDate` (string, required): Batch end date (YYYY-MM-DD format)

**Response:**
```json
{
  "success": true,
  "message": "Batch created successfully",
  "data": {
    "id": "batch-uuid",
    "name": "Batch 2024-2028",
    "year": 2024,
    "description": "Undergraduate batch 2024-2028",
    "startDate": "2024-09-01",
    "endDate": "2028-06-30",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### Subjects

#### Create Subject
**Endpoint:** `POST /organization/subjects`

**Description:** Create a new academic subject/course.

**Request Body:**
```json
{
  "name": "Data Structures",
  "code": "DS101",
  "description": "Introduction to Data Structures and Algorithms",
  "credits": 3,
  "departmentId": "dept-uuid"
}
```

**Request Fields:**
- `name` (string, required): Subject name
- `code` (string, required): Subject code
- `description` (string, optional): Subject description
- `credits` (number, required): Credit hours for the subject
- `departmentId` (string, required): Department ID this subject belongs to

**Response:**
```json
{
  "success": true,
  "message": "Subject created successfully",
  "data": {
    "id": "subject-uuid",
    "name": "Data Structures",
    "code": "DS101",
    "description": "Introduction to Data Structures and Algorithms",
    "credits": 3,
    "departmentId": "dept-uuid",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

## User Management

### Create User
**Endpoint:** `POST /user/create-user`

**Description:** Create a new user account in the system.

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
- `password` (string, required): User's password
- `role` (string, required): User role (STUDENT, TEACHER, ADMIN)

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
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

### Get All Users
**Endpoint:** `GET /user`

**Description:** Retrieve a paginated list of users with optional filtering.

**Query Parameters:**
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Number of items per page (default: 20)
- `role` (string, optional): Filter by user role (STUDENT, TEACHER, ADMIN)
- `search` (string, optional): Search term to filter users by name or email

**Response:**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "id": "user-uuid",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "role": "STUDENT",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### Update User
**Endpoint:** `PATCH /user/{userId}`

**Description:** Update user information.

**Path Parameters:**
- `userId` (string, required): Unique identifier of the user

**Request Body:**
```json
{
  "name": "John Smith"
}
```

**Request Fields:**
- `name` (string, optional): Updated user name
- `email` (string, optional): Updated email address
- `role` (string, optional): Updated user role

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "user-uuid",
    "name": "John Smith",
    "email": "john.doe@example.com",
    "role": "STUDENT",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-02T00:00:00Z"
  }
}
```

### Delete User
**Endpoint:** `DELETE /user/{userId}`

**Description:** Permanently delete a user from the system.

**Path Parameters:**
- `userId` (string, required): Unique identifier of the user

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Student Management

### Create Student
**Endpoint:** `POST /student/create-student`

**Description:** Create a new student profile.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com"
}
```

**Request Fields:**
- `name` (string, required): Student's full name
- `email` (string, required): Student's email address
- `phone` (string, optional): Student's phone number
- `address` (string, optional): Student's address
- `semester` (number, optional): Current semester number
- `rollNumber` (string, optional): Roll number
- `registrationNumber` (string, optional): Registration number

**Response:**
```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "id": "student-uuid",
    "userId": "user-uuid",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "semester": 1,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### Get All Students
**Endpoint:** `GET /student`

**Description:** Retrieve a paginated list of students with optional filtering.

**Query Parameters:**
- `departmentId` (string, optional): Filter by department ID
- `batchId` (string, optional): Filter by batch ID
- `semester` (number, optional): Filter by semester
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Number of items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "message": "Students retrieved successfully",
  "data": {
    "students": [
      {
        "id": "student-uuid",
        "userId": "user-uuid",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "semester": 1,
        "departmentId": "dept-uuid",
        "batchId": "batch-uuid",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### Get Student Profile
**Endpoint:** `GET /student/profile/{studentId}`

**Description:** Retrieve detailed profile information for a specific student.

**Path Parameters:**
- `studentId` (string, required): Unique identifier of the student

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

### Get Student Dashboard
**Endpoint:** `GET /student/dashboard/{studentId}`

**Description:** Retrieve dashboard data for a student including attendance summary, recent activities, and notifications.

**Path Parameters:**
- `studentId` (string, required): Unique identifier of the student

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

### Get Student Attendance
**Endpoint:** `GET /student/{studentId}/attendance`

**Description:** Retrieve attendance records for a student within a date range.

**Path Parameters:**
- `studentId` (string, required): Unique identifier of the student

**Query Parameters:**
- `startDate` (string, required): Start date for attendance records (YYYY-MM-DD)
- `endDate` (string, required): End date for attendance records (YYYY-MM-DD)
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

### Submit Leave Request
**Endpoint:** `POST /student/{studentId}/leave-request`

**Description:** Submit a leave request for a student.

**Path Parameters:**
- `studentId` (string, required): Unique identifier of the student

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

## Teacher Management

### Create Teacher
**Endpoint:** `POST /teacher/`

**Description:** Create a new teacher profile.

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com"
}
```

**Request Fields:**
- `name` (string, required): Teacher's full name
- `email` (string, required): Teacher's email address
- `phone` (string, optional): Teacher's phone number
- `designation` (string, optional): Teacher's designation (e.g., "Assistant Professor")
- `specialization` (string, optional): Teacher's specialization area
- `departmentId` (string, optional): Department ID the teacher belongs to

**Response:**
```json
{
  "success": true,
  "message": "Teacher created successfully",
  "data": {
    "id": "teacher-uuid",
    "userId": "user-uuid",
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "phone": "+1234567890",
    "designation": "Assistant Professor",
    "specialization": "Data Science",
    "departmentId": "dept-uuid",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### Get All Teachers
**Endpoint:** `GET /teacher/`

**Description:** Retrieve a paginated list of teachers with optional filtering.

**Query Parameters:**
- `departmentId` (string, optional): Filter by department ID
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Number of items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "message": "Teachers retrieved successfully",
  "data": {
    "teachers": [
      {
        "id": "teacher-uuid",
        "userId": "user-uuid",
        "name": "Jane Smith",
        "email": "jane.smith@example.com",
        "phone": "+1234567890",
        "designation": "Assistant Professor",
        "specialization": "Data Science",
        "departmentId": "dept-uuid",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### Get Teacher Dashboard
**Endpoint:** `GET /teacher/{teacherId}/dashboard`

**Description:** Retrieve dashboard data for a teacher including class schedules, attendance statistics, and pending requests.

**Path Parameters:**
- `teacherId` (string, required): Unique identifier of the teacher

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

### Assign Teacher to Department
**Endpoint:** `POST /teacher/{teacherId}/assign-department`

**Description:** Assign a teacher to a specific department.

**Path Parameters:**
- `teacherId` (string, required): Unique identifier of the teacher

**Request Body:**
```json
{
  "departmentId": "dept-uuid"
}
```

**Request Fields:**
- `departmentId` (string, required): Department ID to assign the teacher to

**Response:**
```json
{
  "success": true,
  "message": "Teacher assigned to department successfully",
  "data": {
    "teacherId": "teacher-uuid",
    "departmentId": "dept-uuid",
    "assignmentDate": "2024-12-19T00:00:00Z"
  }
}
```

### Get Unassigned Teachers
**Endpoint:** `GET /teacher/unassigned`

**Description:** Retrieve list of teachers who are not assigned to any department.

**Response:**
```json
{
  "success": true,
  "message": "Unassigned teachers retrieved successfully",
  "data": {
    "teachers": [
      {
        "id": "teacher-uuid",
        "userId": "user-uuid",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "designation": "Assistant Professor",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "total": 1
  }
}
```

---

## Assignment Management

### Assign Teacher to Department
**Endpoint:** `POST /assignments/teacher-to-department`

**Description:** Create a relationship between a teacher and a department.

**Request Body:**
```json
{
  "teacherId": "teacher-uuid",
  "departmentId": "dept-uuid"
}
```

**Request Fields:**
- `teacherId` (string, required): Teacher ID to assign
- `departmentId` (string, required): Department ID to assign to

**Response:**
```json
{
  "success": true,
  "message": "Teacher assigned to department successfully",
  "data": {
    "id": "assignment-uuid",
    "teacherId": "teacher-uuid",
    "departmentId": "dept-uuid",
    "assignedAt": "2024-12-19T00:00:00Z",
    "assignedBy": "admin-uuid"
  }
}
```

### Assign Student to Batch
**Endpoint:** `POST /assignments/student-to-batch`

**Description:** Enroll a student in a specific batch.

**Request Body:**
```json
{
  "studentId": "student-uuid",
  "batchId": "batch-uuid"
}
```

**Request Fields:**
- `studentId` (string, required): Student ID to enroll
- `batchId` (string, required): Batch ID to enroll in

**Response:**
```json
{
  "success": true,
  "message": "Student enrolled in batch successfully",
  "data": {
    "id": "enrollment-uuid",
    "studentId": "student-uuid",
    "batchId": "batch-uuid",
    "enrolledAt": "2024-12-19T00:00:00Z"
  }
}
```

### Enroll Student in Course
**Endpoint:** `POST /assignments/student-to-course`

**Description:** Enroll a student in a specific course.

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

---

## Course Management

### Create Course
**Endpoint:** `POST /course/courses`

**Description:** Create a new course in the system.

**Request Body:**
```json
{
  "name": "Data Structures",
  "code": "DS101",
  "description": "Introduction to Data Structures and Algorithms",
  "credits": 3,
  "departmentId": "dept-uuid",
  "teacherId": "teacher-uuid",
  "batchId": "batch-uuid",
  "semesterId": "semester-uuid"
}
```

**Request Fields:**
- `name` (string, required): Course name
- `code` (string, required): Course code
- `description` (string, optional): Course description
- `credits` (number, required): Credit hours for the course
- `departmentId` (string, required): Department ID this course belongs to
- `teacherId` (string, optional): Teacher ID assigned to the course
- `batchId` (string, optional): Batch ID for the course
- `semesterId` (string, optional): Semester ID for the course

**Response:**
```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "id": "course-uuid",
    "name": "Data Structures",
    "code": "DS101",
    "description": "Introduction to Data Structures and Algorithms",
    "credits": 3,
    "departmentId": "dept-uuid",
    "teacherId": "teacher-uuid",
    "batchId": "batch-uuid",
    "semesterId": "semester-uuid",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### Get All Courses
**Endpoint:** `GET /course/courses`

**Description:** Retrieve a paginated list of courses with optional filtering.

**Query Parameters:**
- `departmentId` (string, optional): Filter by department ID
- `teacherId` (string, optional): Filter by teacher ID
- `batchId` (string, optional): Filter by batch ID
- `semesterId` (string, optional): Filter by semester ID
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Number of items per page (default: 20)
- `search` (string, optional): Search term to filter courses by name or code

**Response:**
```json
{
  "success": true,
  "message": "Courses retrieved successfully",
  "data": {
    "courses": [
      {
        "id": "course-uuid",
        "name": "Data Structures",
        "code": "DS101",
        "description": "Introduction to Data Structures and Algorithms",
        "credits": 3,
        "departmentId": "dept-uuid",
        "teacherId": "teacher-uuid",
        "batchId": "batch-uuid",
        "semesterId": "semester-uuid",
        "department": {
          "id": "dept-uuid",
          "name": "Computer Science",
          "code": "CS"
        },
        "teacher": {
          "id": "teacher-uuid",
          "name": "Jane Smith"
        },
        "batch": {
          "id": "batch-uuid",
          "name": "Batch 2024-2028"
        },
        "semester": {
          "id": "semester-uuid",
          "name": "Fall 2024"
        },
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### Get Course by ID
**Endpoint:** `GET /course/courses/{courseId}`

**Description:** Retrieve detailed information for a specific course.

**Path Parameters:**
- `courseId` (string, required): Unique identifier of the course

**Response:**
```json
{
  "success": true,
  "message": "Course retrieved successfully",
  "data": {
    "id": "course-uuid",
    "name": "Data Structures",
    "code": "DS101",
    "description": "Introduction to Data Structures and Algorithms",
    "credits": 3,
    "departmentId": "dept-uuid",
    "teacherId": "teacher-uuid",
    "batchId": "batch-uuid",
    "semesterId": "semester-uuid",
    "department": {
      "id": "dept-uuid",
      "name": "Computer Science",
      "code": "CS"
    },
    "teacher": {
      "id": "teacher-uuid",
      "name": "Jane Smith",
      "email": "jane.smith@example.com"
    },
    "batch": {
      "id": "batch-uuid",
      "name": "Batch 2024-2028",
      "year": 2024
    },
    "semester": {
      "id": "semester-uuid",
      "name": "Fall 2024",
      "year": 2024
    },
    "enrolledStudents": 45,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### Update Course
**Endpoint:** `PATCH /course/courses/{courseId}`

**Description:** Update course information. Only provided fields will be updated.

**Path Parameters:**
- `courseId` (string, required): Unique identifier of the course

**Request Body:**
```json
{
  "name": "Advanced Data Structures",
  "description": "Updated course description"
}
```

**Request Fields:**
- `name` (string, optional): Updated course name
- `code` (string, optional): Updated course code
- `description` (string, optional): Updated course description
- `credits` (number, optional): Updated credit hours
- `teacherId` (string, optional): Updated teacher ID

**Response:**
```json
{
  "success": true,
  "message": "Course updated successfully",
  "data": {
    "id": "course-uuid",
    "name": "Advanced Data Structures",
    "code": "DS101",
    "description": "Updated course description",
    "credits": 3,
    "departmentId": "dept-uuid",
    "teacherId": "teacher-uuid",
    "batchId": "batch-uuid",
    "semesterId": "semester-uuid",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-02T00:00:00Z"
  }
}
```

### Delete Course
**Endpoint:** `DELETE /course/courses/{courseId}`

**Description:** Permanently delete a course from the system.

**Path Parameters:**
- `courseId` (string, required): Unique identifier of the course

**Response:**
```json
{
  "success": true,
  "message": "Course deleted successfully"
}
```

### Get Course Statistics
**Endpoint:** `GET /course/courses/stats`

**Description:** Retrieve comprehensive course statistics.

**Response:**
```json
{
  "success": true,
  "message": "Course statistics retrieved successfully",
  "data": {
    "totalCourses": 50,
    "activeCourses": 45,
    "completedCourses": 5,
    "coursesByDepartment": [
      {
        "departmentId": "dept-uuid",
        "departmentName": "Computer Science",
        "courseCount": 25
      }
    ],
    "averageCredits": 3.2,
    "totalEnrollments": 1250,
    "coursesByTeacher": [
      {
        "teacherId": "teacher-uuid",
        "teacherName": "Jane Smith",
        "courseCount": 5
      }
    ]
  }
}
```

### Course Enrollment Management

#### Enroll Student in Course
**Endpoint:** `POST /course/enrollments`

**Description:** Enroll a student in a specific course.

**Request Body:**
```json
{
  "studentId": "student-uuid",
  "courseId": "course-uuid",
  "enrollmentDate": "2024-09-01"
}
```

**Request Fields:**
- `studentId` (string, required): Student ID to enroll
- `courseId` (string, required): Course ID to enroll in
- `enrollmentDate` (string, optional): Enrollment date (YYYY-MM-DD format)

**Response:**
```json
{
  "success": true,
  "message": "Student enrolled in course successfully",
  "data": {
    "id": "enrollment-uuid",
    "studentId": "student-uuid",
    "courseId": "course-uuid",
    "enrollmentDate": "2024-09-01",
    "status": "ACTIVE",
    "createdAt": "2024-09-01T00:00:00Z"
  }
}
```

#### Get Course Enrollments
**Endpoint:** `GET /course/enrollments`

**Description:** Retrieve course enrollments with filtering and pagination.

**Query Parameters:**
- `courseId` (string, optional): Filter by course ID
- `studentId` (string, optional): Filter by student ID
- `status` (string, optional): Filter by enrollment status (ACTIVE, COMPLETED, DROPPED)
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Number of items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "message": "Course enrollments retrieved successfully",
  "data": {
    "enrollments": [
      {
        "id": "enrollment-uuid",
        "studentId": "student-uuid",
        "courseId": "course-uuid",
        "enrollmentDate": "2024-09-01",
        "status": "ACTIVE",
        "student": {
          "id": "student-uuid",
          "name": "John Doe",
          "email": "john.doe@example.com"
        },
        "course": {
          "id": "course-uuid",
          "name": "Data Structures",
          "code": "DS101"
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

#### Get Course Enrollment by ID
**Endpoint:** `GET /course/enrollments/{enrollmentId}`

**Description:** Retrieve detailed information for a specific course enrollment.

**Path Parameters:**
- `enrollmentId` (string, required): Unique identifier of the enrollment

**Response:**
```json
{
  "success": true,
  "message": "Course enrollment retrieved successfully",
  "data": {
    "id": "enrollment-uuid",
    "studentId": "student-uuid",
    "courseId": "course-uuid",
    "enrollmentDate": "2024-09-01",
    "status": "ACTIVE",
    "student": {
      "id": "student-uuid",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "rollNumber": "CS2024001"
    },
    "course": {
      "id": "course-uuid",
      "name": "Data Structures",
      "code": "DS101",
      "credits": 3
    },
    "attendanceSummary": {
      "totalClasses": 30,
      "presentClasses": 25,
      "absentClasses": 3,
      "leaveClasses": 2,
      "attendancePercentage": 83.3
    },
    "createdAt": "2024-09-01T00:00:00Z",
    "updatedAt": "2024-12-19T00:00:00Z"
  }
}
```

#### Remove Student from Course
**Endpoint:** `DELETE /course/enrollments/{enrollmentId}`

**Description:** Remove a student from a course.

**Path Parameters:**
- `enrollmentId` (string, required): Unique identifier of the enrollment

**Response:**
```json
{
  "success": true,
  "message": "Student removed from course successfully",
  "data": {
    "id": "enrollment-uuid",
    "status": "DROPPED",
    "removedAt": "2024-12-19T00:00:00Z"
  }
}
```

#### Get Course Enrollment Statistics
**Endpoint:** `GET /course/enrollments/stats`

**Description:** Retrieve comprehensive course enrollment statistics.

**Response:**
```json
{
  "success": true,
  "message": "Course enrollment statistics retrieved successfully",
  "data": {
    "totalEnrollments": 1250,
    "activeEnrollments": 1180,
    "completedEnrollments": 60,
    "droppedEnrollments": 10,
    "averageEnrollmentPerCourse": 25.0,
    "enrollmentsByDepartment": [
      {
        "departmentId": "dept-uuid",
        "departmentName": "Computer Science",
        "enrollmentCount": 500
      }
    ],
    "enrollmentsByBatch": [
      {
        "batchId": "batch-uuid",
        "batchName": "Batch 2024-2028",
        "enrollmentCount": 300
      }
    ]
  }
}
```

### Course Schedule Management

#### Create Class Schedule
**Endpoint:** `POST /course/schedules`

**Description:** Create a new class schedule for a course.

**Request Body:**
```json
{
  "courseId": "course-uuid",
  "teacherId": "teacher-uuid",
  "batchId": "batch-uuid",
  "roomId": "Room 101",
  "dayOfWeek": "MONDAY",
  "startTime": "09:00",
  "endTime": "10:30",
  "startDate": "2024-09-01",
  "endDate": "2024-12-31",
  "recurring": true
}
```

**Request Fields:**
- `courseId` (string, required): Course ID for the schedule
- `teacherId` (string, required): Teacher ID for the schedule
- `batchId` (string, required): Batch ID for the schedule
- `roomId` (string, required): Room ID or room name
- `dayOfWeek` (string, required): Day of the week (MONDAY, TUESDAY, etc.)
- `startTime` (string, required): Start time (HH:MM format)
- `endTime` (string, required): End time (HH:MM format)
- `startDate` (string, required): Schedule start date (YYYY-MM-DD)
- `endDate` (string, required): Schedule end date (YYYY-MM-DD)
- `recurring` (boolean, optional): Whether the schedule is recurring (default: true)

**Response:**
```json
{
  "success": true,
  "message": "Class schedule created successfully",
  "data": {
    "id": "schedule-uuid",
    "courseId": "course-uuid",
    "teacherId": "teacher-uuid",
    "batchId": "batch-uuid",
    "roomId": "Room 101",
    "dayOfWeek": "MONDAY",
    "startTime": "09:00",
    "endTime": "10:30",
    "startDate": "2024-09-01",
    "endDate": "2024-12-31",
    "recurring": true,
    "status": "ACTIVE",
    "createdAt": "2024-09-01T00:00:00Z",
    "updatedAt": "2024-09-01T00:00:00Z"
  }
}
```

#### Get All Class Schedules
**Endpoint:** `GET /course/schedules`

**Description:** Retrieve class schedules with filtering and pagination.

**Query Parameters:**
- `courseId` (string, optional): Filter by course ID
- `teacherId` (string, optional): Filter by teacher ID
- `batchId` (string, optional): Filter by batch ID
- `roomId` (string, optional): Filter by room ID
- `dayOfWeek` (string, optional): Filter by day of week
- `startDate` (string, optional): Filter by start date (YYYY-MM-DD)
- `endDate` (string, optional): Filter by end date (YYYY-MM-DD)
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Number of items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "message": "Class schedules retrieved successfully",
  "data": {
    "schedules": [
      {
        "id": "schedule-uuid",
        "courseId": "course-uuid",
        "teacherId": "teacher-uuid",
        "batchId": "batch-uuid",
        "roomId": "Room 101",
        "dayOfWeek": "MONDAY",
        "startTime": "09:00",
        "endTime": "10:30",
        "startDate": "2024-09-01",
        "endDate": "2024-12-31",
        "recurring": true,
        "status": "ACTIVE",
        "course": {
          "id": "course-uuid",
          "name": "Data Structures",
          "code": "DS101"
        },
        "teacher": {
          "id": "teacher-uuid",
          "name": "Jane Smith"
        },
        "batch": {
          "id": "batch-uuid",
          "name": "Batch 2024-2028"
        },
        "createdAt": "2024-09-01T00:00:00Z",
        "updatedAt": "2024-09-01T00:00:00Z"
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

#### Get Class Schedule by ID
**Endpoint:** `GET /course/schedules/{scheduleId}`

**Description:** Retrieve detailed information for a specific class schedule.

**Path Parameters:**
- `scheduleId` (string, required): Unique identifier of the schedule

**Response:**
```json
{
  "success": true,
  "message": "Class schedule retrieved successfully",
  "data": {
    "id": "schedule-uuid",
    "courseId": "course-uuid",
    "teacherId": "teacher-uuid",
    "batchId": "batch-uuid",
    "roomId": "Room 101",
    "dayOfWeek": "MONDAY",
    "startTime": "09:00",
    "endTime": "10:30",
    "startDate": "2024-09-01",
    "endDate": "2024-12-31",
    "recurring": true,
    "status": "ACTIVE",
    "course": {
      "id": "course-uuid",
      "name": "Data Structures",
      "code": "DS101",
      "credits": 3
    },
    "teacher": {
      "id": "teacher-uuid",
      "name": "Jane Smith",
      "email": "jane.smith@example.com"
    },
    "batch": {
      "id": "batch-uuid",
      "name": "Batch 2024-2028",
      "year": 2024
    },
    "enrolledStudents": 45,
    "createdAt": "2024-09-01T00:00:00Z",
    "updatedAt": "2024-09-01T00:00:00Z"
  }
}
```

#### Update Class Schedule
**Endpoint:** `PATCH /course/schedules/{scheduleId}`

**Description:** Update class schedule information. Only provided fields will be updated.

**Path Parameters:**
- `scheduleId` (string, required): Unique identifier of the schedule

**Request Body:**
```json
{
  "roomId": "Room 102",
  "startTime": "10:00",
  "endTime": "11:30"
}
```

**Request Fields:**
- `roomId` (string, optional): Updated room ID
- `dayOfWeek` (string, optional): Updated day of week
- `startTime` (string, optional): Updated start time
- `endTime` (string, optional): Updated end time
- `startDate` (string, optional): Updated start date
- `endDate` (string, optional): Updated end date
- `status` (string, optional): Updated status (ACTIVE, INACTIVE, CANCELLED)

**Response:**
```json
{
  "success": true,
  "message": "Class schedule updated successfully",
  "data": {
    "id": "schedule-uuid",
    "roomId": "Room 102",
    "startTime": "10:00",
    "endTime": "11:30",
    "updatedAt": "2024-12-19T00:00:00Z"
  }
}
```

#### Delete Class Schedule
**Endpoint:** `DELETE /course/schedules/{scheduleId}`

**Description:** Permanently delete a class schedule from the system.

**Path Parameters:**
- `scheduleId` (string, required): Unique identifier of the schedule

**Response:**
```json
{
  "success": true,
  "message": "Class schedule deleted successfully"
}
```

#### Get Class Schedule Statistics
**Endpoint:** `GET /course/schedules/stats`

**Description:** Retrieve comprehensive class schedule statistics.

**Response:**
```json
{
  "success": true,
  "message": "Class schedule statistics retrieved successfully",
  "data": {
    "totalSchedules": 100,
    "activeSchedules": 95,
    "cancelledSchedules": 5,
    "schedulesByDay": [
      {
        "dayOfWeek": "MONDAY",
        "scheduleCount": 25
      },
      {
        "dayOfWeek": "TUESDAY",
        "scheduleCount": 20
      }
    ],
    "schedulesByRoom": [
      {
        "roomId": "Room 101",
        "scheduleCount": 30
      },
      {
        "roomId": "Room 102",
        "scheduleCount": 25
      }
    ],
    "averageClassesPerDay": 14.3,
    "mostActiveRoom": "Room 101"
  }
}
```

---

## Attendance Management

### Get All Attendance Records
**Endpoint:** `GET /attendance`

**Description:** Retrieve attendance records with filtering and pagination.

**Query Parameters:**
- `courseId` (string, optional): Filter by course ID
- `date` (string, optional): Filter by specific date (YYYY-MM-DD)
- `status` (string, optional): Filter by attendance status (PRESENT, ABSENT, LEAVE)
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Number of items per page (default: 50)

**Response:**
```json
{
  "success": true,
  "message": "Attendance records retrieved successfully",
  "data": {
    "attendanceRecords": [
      {
        "id": "attendance-uuid",
        "date": "2024-12-19",
        "status": "PRESENT",
        "checkInTime": "09:05:00",
        "checkOutTime": "10:30:00",
        "student": {
          "id": "student-uuid",
          "name": "John Doe",
          "rollNumber": "CS2024001"
        },
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
      "totalRecords": 100,
      "presentCount": 85,
      "absentCount": 10,
      "leaveCount": 5
    },
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 100,
      "totalPages": 2
    }
  }
}
```

### Mark Attendance
**Endpoint:** `POST /teacher/{teacherId}/attendance/mark`

**Description:** Mark attendance for students in a specific course.

**Path Parameters:**
- `teacherId` (string, required): Unique identifier of the teacher

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

---

## Leave Management

### Get All Leave Requests
**Endpoint:** `GET /leave`

**Description:** Retrieve leave requests with filtering and pagination.

**Query Parameters:**
- `status` (string, optional): Filter by leave status (PENDING, APPROVED, REJECTED)
- `startDate` (string, optional): Filter by start date (YYYY-MM-DD)
- `endDate` (string, optional): Filter by end date (YYYY-MM-DD)
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Number of items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "message": "Leave requests retrieved successfully",
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
    "summary": {
      "totalRequests": 10,
      "pendingCount": 3,
      "approvedCount": 6,
      "rejectedCount": 1
    },
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 10,
      "totalPages": 1
    }
  }
}
```

### Approve/Reject Leave Request
**Endpoint:** `PUT /teacher/{teacherId}/leaves/{leaveId}/approve`

**Description:** Approve or reject a leave request.

**Path Parameters:**
- `teacherId` (string, required): Unique identifier of the teacher
- `leaveId` (string, required): Unique identifier of the leave request

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

---

## QR Code Management

### Generate QR Token
**Endpoint:** `POST /qr/generate`

**Description:** Generate a new QR token for attendance marking with advanced options.

**Request Body:**
```json
{
  "courseId": "course-uuid",
  "teacherId": "teacher-uuid",
  "validFrom": "2024-12-19T10:00:00Z",
  "validUntil": "2024-12-19T10:10:00Z",
  "maxUses": 50,
  "location": "Room 101",
  "description": "Data Structures Class Attendance"
}
```

**Request Fields:**
- `courseId` (string, required): Course ID for the QR token
- `teacherId` (string, required): Teacher ID generating the QR token
- `validFrom` (string, optional): Valid from timestamp (ISO 8601 format)
- `validUntil` (string, optional): Valid until timestamp (ISO 8601 format)
- `maxUses` (number, optional): Maximum number of uses for this QR token
- `location` (string, optional): Physical location where QR is valid
- `description` (string, optional): Description of the QR token purpose

**Response:**
```json
{
  "success": true,
  "message": "QR token generated successfully",
  "data": {
    "id": "qr-token-uuid",
    "token": "qr-token-string",
    "courseId": "course-uuid",
    "teacherId": "teacher-uuid",
    "validFrom": "2024-12-19T10:00:00Z",
    "validUntil": "2024-12-19T10:10:00Z",
    "maxUses": 50,
    "currentUses": 0,
    "location": "Room 101",
    "description": "Data Structures Class Attendance",
    "status": "ACTIVE",
    "qrCodeUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "createdAt": "2024-12-19T10:00:00Z"
  }
}
```

### Validate QR Token
**Endpoint:** `POST /qr/validate`

**Description:** Validate QR token for check-in and record attendance.

**Request Body:**
```json
{
  "token": "qr-token-string",
  "userId": "user-uuid",
  "location": "Room 101"
}
```

**Request Fields:**
- `token` (string, required): QR token string to validate
- `userId` (string, required): User ID attempting to check in
- `location` (string, optional): Physical location of check-in

**Response:**
```json
{
  "success": true,
  "message": "QR token validated and check-in recorded successfully",
  "data": {
    "checkInId": "check-in-uuid",
    "tokenId": "qr-token-uuid",
    "userId": "user-uuid",
    "checkInTime": "2024-12-19T10:05:00Z",
    "location": "Room 101",
    "status": "SUCCESS",
    "attendanceRecord": {
      "id": "attendance-uuid",
      "status": "PRESENT",
      "courseId": "course-uuid"
    }
  }
}
```

### Get All QR Tokens
**Endpoint:** `GET /qr/`

**Description:** Retrieve QR tokens with advanced filtering and pagination.

**Query Parameters:**
- `courseId` (string, optional): Filter by course ID
- `teacherId` (string, optional): Filter by teacher ID
- `status` (string, optional): Filter by status (ACTIVE, EXPIRED, USED)
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Number of items per page (default: 10)
- `sortBy` (string, optional): Field to sort by (default: createdAt)
- `sortOrder` (string, optional): Sort order (asc, desc) (default: desc)

**Response:**
```json
{
  "success": true,
  "message": "QR tokens retrieved successfully",
  "data": {
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    },
    "data": [
      {
        "id": "qr-token-uuid",
        "token": "qr-token-string",
        "courseId": "course-uuid",
        "teacherId": "teacher-uuid",
        "status": "ACTIVE",
        "validFrom": "2024-12-19T10:00:00Z",
        "validUntil": "2024-12-19T10:10:00Z",
        "maxUses": 50,
        "currentUses": 15,
        "location": "Room 101",
        "description": "Data Structures Class Attendance",
        "createdAt": "2024-12-19T10:00:00Z",
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
    ]
  }
}
```

### Get QR Check-ins
**Endpoint:** `GET /qr/check-ins`

**Description:** Retrieve QR check-in records with filtering and pagination.

**Query Parameters:**
- `tokenId` (string, optional): Filter by QR token ID
- `userId` (string, optional): Filter by user ID
- `courseId` (string, optional): Filter by course ID
- `date` (string, optional): Filter by date (YYYY-MM-DD)
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Number of items per page (default: 10)
- `sortBy` (string, optional): Field to sort by (default: checkInTime)
- `sortOrder` (string, optional): Sort order (asc, desc) (default: desc)

**Response:**
```json
{
  "success": true,
  "message": "QR check-ins retrieved successfully",
  "data": {
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "totalPages": 5
    },
    "data": [
      {
        "id": "check-in-uuid",
        "tokenId": "qr-token-uuid",
        "userId": "user-uuid",
        "checkInTime": "2024-12-19T10:05:00Z",
        "location": "Room 101",
        "status": "SUCCESS",
        "ipAddress": "192.168.1.100",
        "userAgent": "Mozilla/5.0...",
        "user": {
          "id": "user-uuid",
          "name": "John Doe",
          "email": "john.doe@example.com"
        },
        "token": {
          "id": "qr-token-uuid",
          "course": {
            "name": "Data Structures",
            "code": "DS101"
          }
        }
      }
    ]
  }
}
```

### Get QR Token by ID
**Endpoint:** `GET /qr/{id}`

**Description:** Retrieve detailed information for a specific QR token.

**Path Parameters:**
- `id` (string, required): Unique identifier of the QR token

**Response:**
```json
{
  "success": true,
  "message": "QR token retrieved successfully",
  "data": {
    "id": "qr-token-uuid",
    "token": "qr-token-string",
    "courseId": "course-uuid",
    "teacherId": "teacher-uuid",
    "validFrom": "2024-12-19T10:00:00Z",
    "validUntil": "2024-12-19T10:10:00Z",
    "maxUses": 50,
    "currentUses": 15,
    "location": "Room 101",
    "description": "Data Structures Class Attendance",
    "status": "ACTIVE",
    "qrCodeUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "createdAt": "2024-12-19T10:00:00Z",
    "updatedAt": "2024-12-19T10:05:00Z",
    "course": {
      "id": "course-uuid",
      "name": "Data Structures",
      "code": "DS101",
      "credits": 3
    },
    "teacher": {
      "id": "teacher-uuid",
      "name": "Jane Smith",
      "email": "jane.smith@example.com"
    }
  }
}
```

### Get QR Check-in by ID
**Endpoint:** `GET /qr/check-ins/{id}`

**Description:** Retrieve detailed information for a specific QR check-in.

**Path Parameters:**
- `id` (string, required): Unique identifier of the check-in record

**Response:**
```json
{
  "success": true,
  "message": "QR check-in retrieved successfully",
  "data": {
    "id": "check-in-uuid",
    "tokenId": "qr-token-uuid",
    "userId": "user-uuid",
    "checkInTime": "2024-12-19T10:05:00Z",
    "location": "Room 101",
    "status": "SUCCESS",
    "ipAddress": "192.168.1.100",
    "userAgent": "Mozilla/5.0...",
    "createdAt": "2024-12-19T10:05:00Z",
    "user": {
      "id": "user-uuid",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "STUDENT"
    },
    "token": {
      "id": "qr-token-uuid",
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
  }
}
```

### Update QR Token Status
**Endpoint:** `PATCH /qr/{id}/status`

**Description:** Update the status of a QR token.

**Path Parameters:**
- `id` (string, required): Unique identifier of the QR token

**Request Body:**
```json
{
  "status": "EXPIRED"
}
```

**Request Fields:**
- `status` (string, required): New status (ACTIVE, EXPIRED, USED)

**Response:**
```json
{
  "success": true,
  "message": "QR token status updated successfully",
  "data": {
    "id": "qr-token-uuid",
    "status": "EXPIRED",
    "updatedAt": "2024-12-19T10:15:00Z"
  }
}
```

### Expire QR Tokens
**Endpoint:** `POST /qr/expire`

**Description:** Manually expire multiple QR tokens based on filters.

**Query Parameters:**
- `courseId` (string, optional): Filter by course ID
- `teacherId` (string, optional): Filter by teacher ID

**Response:**
```json
{
  "success": true,
  "message": "5 QR tokens expired successfully",
  "data": {
    "count": 5
  }
}
```

### Get QR Statistics
**Endpoint:** `GET /qr/statistics`

**Description:** Retrieve comprehensive QR usage statistics.

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
    "totalTokens": 150,
    "activeTokens": 25,
    "expiredTokens": 100,
    "usedTokens": 25,
    "totalCheckIns": 1250,
    "successfulCheckIns": 1200,
    "failedCheckIns": 50,
    "averageCheckInsPerToken": 8.33,
    "mostActiveCourse": {
      "courseId": "course-uuid",
      "courseName": "Data Structures",
      "tokenCount": 15,
      "checkInCount": 150
    },
    "dailyUsage": [
      {
        "date": "2024-12-19",
        "tokensGenerated": 5,
        "checkIns": 45
      }
    ],
    "topUsers": [
      {
        "userId": "user-uuid",
        "userName": "John Doe",
        "checkInCount": 25
      }
    ]
  }
}
```

### Delete QR Token
**Endpoint:** `DELETE /qr/{id}`

**Description:** Permanently delete a QR token (Admin only).

**Path Parameters:**
- `id` (string, required): Unique identifier of the QR token

**Response:**
```json
{
  "success": true,
  "message": "QR token deleted successfully",
  "data": {
    "id": "qr-token-uuid",
    "deletedAt": "2024-12-19T10:20:00Z"
  }
}
```

### Delete QR Check-in
**Endpoint:** `DELETE /qr/check-ins/{id}`

**Description:** Permanently delete a QR check-in record (Admin only).

**Path Parameters:**
- `id` (string, required): Unique identifier of the check-in record

**Response:**
```json
{
  "success": true,
  "message": "QR check-in deleted successfully",
  "data": {
    "id": "check-in-uuid",
    "deletedAt": "2024-12-19T10:20:00Z"
  }
}
```

---

## Dashboard Analytics and Statistics

### Get Dashboard Overview
**Endpoint:** `GET /dashboard/overview`

**Description:** Retrieve comprehensive dashboard overview data including key metrics and statistics.

**Response:**
```json
{
  "success": true,
  "message": "Dashboard overview retrieved successfully",
  "data": {
    "summary": {
      "totalStudents": 1250,
      "totalTeachers": 85,
      "totalCourses": 150,
      "totalDepartments": 12,
      "activeSemesters": 8,
      "todayClasses": 45,
      "todayAttendance": 1850
    },
    "attendanceStats": {
      "averageAttendanceRate": 87.5,
      "presentToday": 1850,
      "absentToday": 265,
      "leaveToday": 85,
      "monthlyTrend": [
        {
          "month": "2024-12",
          "attendanceRate": 88.2
        },
        {
          "month": "2024-11",
          "attendanceRate": 86.7
        }
      ]
    },
    "recentActivities": [
      {
        "type": "COURSE_CREATED",
        "message": "New course 'Machine Learning' created",
        "timestamp": "2024-12-19T09:30:00Z",
        "user": "Admin User"
      }
    ]
  }
}
```

### Get Class Level Statistics
**Endpoint:** `GET /dashboard/stats/class-level`

**Description:** Retrieve class-level attendance statistics and performance metrics.

**Query Parameters:**
- `departmentId` (string, optional): Filter by department ID
- `batchId` (string, optional): Filter by batch ID
- `semesterId` (string, optional): Filter by semester ID
- `startDate` (string, optional): Start date for statistics (YYYY-MM-DD)
- `endDate` (string, optional): End date for statistics (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "message": "Class level statistics retrieved successfully",
  "data": {
    "overview": {
      "totalClasses": 2500,
      "averageClassSize": 25.5,
      "attendanceRate": 87.5,
      "completionRate": 94.2
    },
    "byDepartment": [
      {
        "departmentId": "dept-uuid",
        "departmentName": "Computer Science",
        "classCount": 1200,
        "averageAttendance": 89.1
      }
    ],
    "byBatch": [
      {
        "batchId": "batch-uuid",
        "batchName": "Batch 2024-2028",
        "classCount": 800,
        "averageAttendance": 86.8
      }
    ],
    "performanceMetrics": {
      "bestPerformingClass": {
        "courseName": "Data Structures",
        "attendanceRate": 95.2
      },
      "lowestPerformingClass": {
        "courseName": "Advanced Algorithms",
        "attendanceRate": 78.5
      }
    }
  }
}
```

### Get Subject Level Statistics
**Endpoint:** `GET /dashboard/stats/subject-level`

**Description:** Retrieve subject-level statistics and performance data.

**Query Parameters:**
- `departmentId` (string, optional): Filter by department ID
- `semesterId` (string, optional): Filter by semester ID
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Number of items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "message": "Subject level statistics retrieved successfully",
  "data": {
    "subjects": [
      {
        "subjectId": "subject-uuid",
        "name": "Data Structures",
        "code": "DS101",
        "totalEnrollments": 150,
        "averageAttendance": 89.5,
        "passRate": 92.1,
        "departmentName": "Computer Science"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    },
    "summary": {
      "totalSubjects": 45,
      "averageAttendance": 87.2,
      "averagePassRate": 88.9
    }
  }
}
```

### Get Teacher Performance Data
**Endpoint:** `GET /dashboard/stats/teacher-performance`

**Description:** Retrieve teacher performance metrics and analytics.

**Query Parameters:**
- `departmentId` (string, optional): Filter by department ID
- `startDate` (string, optional): Start date for analysis (YYYY-MM-DD)
- `endDate` (string, optional): End date for analysis (YYYY-MM-DD)
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Number of items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "message": "Teacher performance data retrieved successfully",
  "data": {
    "teachers": [
      {
        "teacherId": "teacher-uuid",
        "name": "Jane Smith",
        "email": "jane.smith@example.com",
        "departmentName": "Computer Science",
        "totalClasses": 150,
        "totalStudents": 450,
        "averageClassSize": 30,
        "averageAttendanceRate": 91.2,
        "coursesTaught": 5,
        "performanceScore": 88.5,
        "rank": 3
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 85,
      "totalPages": 5
    },
    "summary": {
      "totalTeachers": 85,
      "averageAttendanceRate": 87.8,
      "averagePerformanceScore": 85.2,
      "topPerformer": {
        "name": "John Doe",
        "performanceScore": 94.5
      }
    }
  }
}
```

### Get Low Attendance Alerts
**Endpoint:** `GET /dashboard/alerts`

**Description:** Retrieve alerts for students with low attendance rates.

**Query Parameters:**
- `threshold` (number, optional): Attendance threshold percentage (default: 75)
- `departmentId` (string, optional): Filter by department ID
- `batchId` (string, optional): Filter by batch ID
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Number of items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "message": "Low attendance alerts retrieved successfully",
  "data": {
    "alerts": [
      {
        "studentId": "student-uuid",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "rollNumber": "CS2024001",
        "attendanceRate": 68.5,
        "totalClasses": 40,
        "presentClasses": 27,
        "absentClasses": 10,
        "leaveClasses": 3,
        "departmentName": "Computer Science",
        "batchName": "Batch 2024-2028",
        "courses": [
          {
            "courseName": "Data Structures",
            "attendanceRate": 65.0
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 125,
      "totalPages": 7
    },
    "summary": {
      "totalAlerts": 125,
      "thresholdUsed": 75,
      "averageAttendanceRate": 68.2,
      "mostAffectedDepartment": "Computer Science",
      "mostAffectedBatch": "Batch 2024-2028"
    }
  }
}
```

### Get Attendance Report
**Endpoint:** `GET /dashboard/attendance-report`

**Description:** Generate comprehensive attendance reports with filtering options.

**Query Parameters:**
- `startDate` (string, required): Start date for report (YYYY-MM-DD)
- `endDate` (string, required): End date for report (YYYY-MM-DD)
- `departmentId` (string, optional): Filter by department ID
- `batchId` (string, optional): Filter by batch ID
- `courseId` (string, optional): Filter by course ID
- `teacherId` (string, optional): Filter by teacher ID
- `format` (string, optional): Report format (json, csv, excel) (default: json)

**Response:**
```json
{
  "success": true,
  "message": "Attendance report generated successfully",
  "data": {
    "reportInfo": {
      "generatedAt": "2024-12-19T10:00:00Z",
      "period": "2024-12-01 to 2024-12-19",
      "totalRecords": 5000,
      "filters": {
        "departmentId": "dept-uuid",
        "batchId": "batch-uuid"
      }
    },
    "summary": {
      "totalStudents": 1250,
      "totalClasses": 2500,
      "overallAttendanceRate": 87.5,
      "presentCount": 4375,
      "absentCount": 875,
      "leaveCount": 250
    },
    "byDepartment": [
      {
        "departmentName": "Computer Science",
        "studentCount": 450,
        "attendanceRate": 89.2,
        "presentCount": 1605,
        "absentCount": 270,
        "leaveCount": 75
      }
    ],
    "byCourse": [
      {
        "courseName": "Data Structures",
        "enrolledStudents": 150,
        "attendanceRate": 91.5,
        "presentCount": 550,
        "absentCount": 45,
        "leaveCount": 10
      }
    ],
    "trends": [
      {
        "date": "2024-12-01",
        "attendanceRate": 88.1
      },
      {
        "date": "2024-12-02",
        "attendanceRate": 87.3
      }
    ],
    "records": [
      {
        "studentId": "student-uuid",
        "studentName": "John Doe",
        "rollNumber": "CS2024001",
        "departmentName": "Computer Science",
        "batchName": "Batch 2024-2028",
        "totalClasses": 40,
        "presentClasses": 35,
        "absentClasses": 4,
        "leaveClasses": 1,
        "attendanceRate": 87.5,
        "courseBreakdown": [
          {
            "courseName": "Data Structures",
            "attendanceRate": 90.0
          }
        ]
      }
    ]
  }
}
```

---

## Notification Management

### Get All Notifications
**Endpoint:** `GET /notification`

**Description:** Retrieve notifications with filtering and pagination.

**Query Parameters:**
- `userId` (string, optional): Filter by user ID
- `type` (string, optional): Filter by notification type (GENERAL, SCHEDULE, ATTENDANCE, LEAVE)
- `isRead` (boolean, optional): Filter by read status
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Number of items per page (default: 50)

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
      "limit": 50,
      "total": 25,
      "totalPages": 1
    }
  }
}
```

### Mark Notification as Read
**Endpoint:** `PATCH /notification/{notificationId}`

**Description:** Mark a notification as read.

**Path Parameters:**
- `notificationId` (string, required): Unique identifier of the notification

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

---

## System Settings

### Get System Settings
**Endpoint:** `GET /settings`

**Description:** Retrieve system-wide settings.

**Response:**
```json
{
  "success": true,
  "message": "System settings retrieved successfully",
  "data": {
    "attendanceThreshold": 75,
    "qrCodeDuration": 300,
    "maxLeaveDays": 7,
    "automaticAttendanceMarking": true,
    "emailNotifications": true,
    "smsNotifications": false,
    "timezone": "Asia/Dhaka",
    "academicYear": "2024-2025"
  }
}
```

### Update System Settings
**Endpoint:** `PATCH /settings`

**Description:** Update system-wide settings.

**Request Body:**
```json
{
  "attendanceThreshold": 75,
  "qrCodeDuration": 300
}
```

**Request Fields:**
- `attendanceThreshold` (number, optional): Minimum attendance percentage required
- `qrCodeDuration` (number, optional): QR code validity duration in seconds
- `maxLeaveDays` (number, optional): Maximum leave days allowed per student
- `automaticAttendanceMarking` (boolean, optional): Enable automatic attendance marking
- `emailNotifications` (boolean, optional): Enable email notifications
- `smsNotifications` (boolean, optional): Enable SMS notifications
- `timezone` (string, optional): System timezone
- `academicYear` (string, optional): Current academic year

**Response:**
```json
{
  "success": true,
  "message": "System settings updated successfully",
  "data": {
    "attendanceThreshold": 75,
    "qrCodeDuration": 300,
    "maxLeaveDays": 7,
    "automaticAttendanceMarking": true,
    "emailNotifications": true,
    "smsNotifications": false,
    "timezone": "Asia/Dhaka",
    "academicYear": "2024-2025",
    "updatedAt": "2024-12-19T11:00:00Z"
  }
}
```

---

## Import/Export Management

### Validate Import Data
**Endpoint:** `POST /import/validate`

**Description:** Validate import data before execution to check for errors and conflicts.

**Request Body:**
```json
{
  "dataType": "STUDENTS",
  "data": [
    {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "rollNumber": "CS2024001",
      "departmentId": "dept-uuid",
      "batchId": "batch-uuid"
    }
  ],
  "options": {
    "skipDuplicates": false,
    "validateEmails": true,
    "validateRollNumbers": true
  }
}
```

**Request Fields:**
- `dataType` (string, required): Type of data being imported (STUDENTS, TEACHERS, COURSES, etc.)
- `data` (array, required): Array of data records to validate
- `options` (object, optional): Validation options
  - `skipDuplicates` (boolean): Skip duplicate records during validation
  - `validateEmails` (boolean): Validate email format and uniqueness
  - `validateRollNumbers` (boolean): Validate roll number format and uniqueness

**Response:**
```json
{
  "success": true,
  "message": "Import data validation completed",
  "data": {
    "validationSummary": {
      "totalRecords": 100,
      "validRecords": 95,
      "invalidRecords": 5,
      "duplicateRecords": 2,
      "errors": [
        {
          "rowIndex": 15,
          "field": "email",
          "value": "invalid-email",
          "error": "Invalid email format"
        }
      ]
    },
    "warnings": [
      {
        "rowIndex": 25,
        "message": "Department ID not found, will be skipped during import"
      }
    ],
    "estimatedImportTime": "2 minutes",
    "canProceed": true
  }
}
```

### Execute Import Data
**Endpoint:** `POST /import/execute`

**Description:** Execute import data after successful validation.

**Request Body:**
```json
{
  "importId": "import-uuid",
  "validationId": "validation-uuid",
  "confirmExecution": true
}
```

**Request Fields:**
- `importId` (string, required): Unique identifier for the import operation
- `validationId` (string, required): Validation ID from previous validation step
- `confirmExecution` (boolean, required): Confirmation that user wants to proceed with import

**Response:**
```json
{
  "success": true,
  "message": "Import executed successfully",
  "data": {
    "importId": "import-uuid",
    "status": "COMPLETED",
    "summary": {
      "totalRecords": 100,
      "successfulImports": 95,
      "failedImports": 5,
      "duplicatesSkipped": 2,
      "executionTime": "2 minutes 15 seconds",
      "importedAt": "2024-12-19T10:30:00Z"
    },
    "details": {
      "studentsImported": 50,
      "teachersImported": 30,
      "coursesImported": 15,
      "errors": [
        {
          "rowIndex": 15,
          "error": "Email already exists in system"
        }
      ]
    }
  }
}
```

---

## Admin Management

### Get Admin Users
**Endpoint:** `GET /admin/users`

**Description:** Retrieve all admin users with pagination.

**Query Parameters:**
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Number of items per page (default: 20)
- `status` (string, optional): Filter by status (ACTIVE, INACTIVE)
- `search` (string, optional): Search term to filter users by name or email

**Response:**
```json
{
  "success": true,
  "message": "Admin users retrieved successfully",
  "data": {
    "admins": [
      {
        "id": "admin-uuid",
        "userId": "user-uuid",
        "name": "Admin User",
        "email": "admin@attendflow.com",
        "role": "SUPER_ADMIN",
        "status": "ACTIVE",
        "lastLoginAt": "2024-12-19T09:00:00Z",
        "permissions": [
          "USER_MANAGEMENT",
          "COURSE_MANAGEMENT",
          "SYSTEM_SETTINGS"
        ],
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-12-19T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

### Create Admin User
**Endpoint:** `POST /admin/users`

**Description:** Create a new admin user with specified permissions.

**Request Body:**
```json
{
  "name": "New Admin",
  "email": "newadmin@attendflow.com",
  "password": "password123",
  "role": "ADMIN",
  "permissions": [
    "USER_MANAGEMENT",
    "COURSE_MANAGEMENT",
    "ATTENDANCE_VIEW"
  ]
}
```

**Request Fields:**
- `name` (string, required): Admin user's full name
- `email` (string, required): Admin user's email address (must be unique)
- `password` (string, required): Admin user's password
- `role` (string, required): Admin role (ADMIN, SUPER_ADMIN)
- `permissions` (array, required): List of permissions to grant

**Response:**
```json
{
  "success": true,
  "message": "Admin user created successfully",
  "data": {
    "id": "admin-uuid",
    "userId": "user-uuid",
    "name": "New Admin",
    "email": "newadmin@attendflow.com",
    "role": "ADMIN",
    "status": "ACTIVE",
    "permissions": [
      "USER_MANAGEMENT",
      "COURSE_MANAGEMENT",
      "ATTENDANCE_VIEW"
    ],
    "createdAt": "2024-12-19T10:00:00Z",
    "updatedAt": "2024-12-19T10:00:00Z"
  }
}
```

### Update Admin User
**Endpoint:** `PATCH /admin/users/{adminId}`

**Description:** Update admin user information and permissions.

**Path Parameters:**
- `adminId` (string, required): Unique identifier of the admin user

**Request Body:**
```json
{
  "name": "Updated Admin Name",
  "permissions": [
    "USER_MANAGEMENT",
    "COURSE_MANAGEMENT",
    "SYSTEM_SETTINGS"
  ]
}
```

**Request Fields:**
- `name` (string, optional): Updated admin name
- `email` (string, optional): Updated email address
- `role` (string, optional): Updated admin role
- `permissions` (array, optional): Updated list of permissions
- `status` (string, optional): Updated status (ACTIVE, INACTIVE)

**Response:**
```json
{
  "success": true,
  "message": "Admin user updated successfully",
  "data": {
    "id": "admin-uuid",
    "name": "Updated Admin Name",
    "permissions": [
      "USER_MANAGEMENT",
      "COURSE_MANAGEMENT",
      "SYSTEM_SETTINGS"
    ],
    "updatedAt": "2024-12-19T10:30:00Z"
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
- `INTERNAL_SERVER_ERROR` (500): Internal server error

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- Authentication endpoints: 5 requests per minute
- General endpoints: 100 requests per minute
- File upload endpoints: 10 requests per minute

Rate limit headers are included in all responses:
- `X-RateLimit-Limit`: Maximum requests per window
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Time when rate limit resets (Unix timestamp)

---

## Pagination

All list endpoints support pagination with the following query parameters:

- `page`: Page number (starting from 1)
- `limit`: Number of items per page (default: 20, maximum: 100)

Pagination response format:
```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

## Search and Filtering

Many endpoints support search and filtering capabilities:

- **Text Search**: Use `search` parameter for text-based search
- **Date Range**: Use `startDate` and `endDate` for date filtering
- **Status Filtering**: Use `status` parameter for status-based filtering
- **ID Filtering**: Use specific ID parameters (e.g., `departmentId`, `courseId`)

---

## WebSocket Events (Real-time Updates)

The dashboard supports real-time updates via WebSocket connections:

### Connection
```javascript
const ws = new WebSocket('ws://localhost:5000/ws');
ws.send(JSON.stringify({
  type: 'auth',
  token: 'your-jwt-token'
}));
```

### Events
- `attendance_marked`: When attendance is marked
- `leave_request_submitted`: When a new leave request is submitted
- `notification_created`: When a new notification is created
- `qr_code_generated`: When a QR code is generated

### Event Payload
```json
{
  "type": "attendance_marked",
  "data": {
    "courseId": "course-uuid",
    "teacherId": "teacher-uuid",
    "timestamp": "2024-12-19T10:00:00Z"
  }
}
```

---

## API Usage Examples

### Complete Student Onboarding Flow
```bash
# 1. Create user account
curl -X POST http://localhost:5000/api/v1/user/create-user \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123",
    "role": "STUDENT"
  }'

# 2. Create student profile
curl -X POST http://localhost:5000/api/v1/student/create-student \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "semester": 1,
    "rollNumber": "CS2024001"
  }'

# 3. Assign to batch
curl -X POST http://localhost:5000/api/v1/assignments/student-to-batch \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "student-uuid",
    "batchId": "batch-uuid"
  }'

# 4. Enroll in course
curl -X POST http://localhost:5000/api/v1/course/enrollments \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "student-uuid",
    "courseId": "course-uuid"
  }'
```

### Daily Attendance Marking
```bash
# 1. Generate QR code
curl -X POST http://localhost:5000/api/v1/qr/generate \
  -H "Authorization: Bearer YOUR_TEACHER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "courseId": "course-uuid",
    "teacherId": "teacher-uuid",
    "validUntil": "2024-12-19T10:10:00Z",
    "maxUses": 50,
    "location": "Room 101"
  }'

# 2. Mark attendance manually (backup method)
curl -X POST http://localhost:5000/api/v1/teacher/teacher-uuid/attendance/mark \
  -H "Authorization: Bearer YOUR_TEACHER_TOKEN" \
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
```

### Import Students Data
```bash
# 1. Validate import data
curl -X POST http://localhost:5000/api/v1/import/validate \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "dataType": "STUDENTS",
    "data": [
      {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "rollNumber": "CS2024001",
        "departmentId": "dept-uuid",
        "batchId": "batch-uuid"
      }
    ],
    "options": {
      "skipDuplicates": false,
      "validateEmails": true
    }
  }'

# 2. Execute import
curl -X POST http://localhost:5000/api/v1/import/execute \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "importId": "import-uuid",
    "validationId": "validation-uuid",
    "confirmExecution": true
  }'
```

---

## Testing and Development

### Local Development Setup
1. Install dependencies: `npm install`
2. Set up environment variables: Copy `.env.example` to `.env`
3. Start development server: `npm run dev`
4. Run tests: `npm test`

### API Testing Tools
- **Postman**: Use the provided Postman collections
- **Swagger UI**: Access at `http://localhost:5000/api-docs`
- **Curl**: Command-line testing examples provided above

### Mock Data
Use the seed script to populate the database with sample data:
```bash
npm run seed
```

---

## Support and Maintenance

### API Versioning
- Current version: `v1`
- Version included in URL: `/api/v1/`
- Backward compatibility maintained for minor version updates

### Monitoring
- API response times monitored
- Error rates tracked
- Usage analytics available

### Backup and Recovery
- Daily database backups
- Automated testing of backup integrity
- Recovery procedures documented

For any issues or questions, please contact the development team or create an issue in the project repository.
