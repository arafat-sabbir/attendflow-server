# AttendFlow Server Authentication APIs Documentation

This document provides a comprehensive overview of all authentication-related APIs in the AttendFlow server, categorized for admin panel and frontend usage.

## Table of Contents
- [Admin Panel Auth APIs](#admin-panel-auth-apis)
- [Frontend Auth APIs](#frontend-auth-apis)
- [Authentication Flow](#authentication-flow)
- [Middleware Usage](#middleware-usage)

---

## Admin Panel Auth APIs

These APIs are primarily used by the admin dashboard for user management, authentication control, and administrative operations.

### Base URL: `/api/v1`

### 1. User Management APIs (`/user`)
All these endpoints require admin privileges (`ADMIN` or `SUPER_ADMIN` role).

| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|--------------|
| POST | `/user/create-user` | Create a new user account | ADMIN |
| GET | `/user/stats` | Get user statistics for dashboard | ADMIN |
| PATCH | `/user/:id/role` | Change user role | ADMIN |
| PATCH | `/user/:id/status` | Change user status (active/inactive) | ADMIN |
| PATCH | `/user/:id/deactivate` | Soft delete user | ADMIN |
| PATCH | `/user/bulk/status` | Bulk update user status | ADMIN |
| GET | `/user/role/:role` | Get users by specific role | ADMIN |
| GET | `/user/search` | Search users with filters | ADMIN |

### 2. Teacher Management APIs (`/teacher`)
Endpoints for managing teacher profiles and related administrative functions.

| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|--------------|
| POST | `/teacher/` | Create teacher profile | TEACHER, ADMIN |
| GET | `/teacher/` | Get all teachers | TEACHER, ADMIN |
| DELETE | `/teacher/:teacherId` | Delete teacher profile | TEACHER, ADMIN |
| GET | `/teacher/stats` | Get teacher statistics | TEACHER, ADMIN |
| PUT | `/teacher/:teacherId/leaves/:leaveId/approve` | Process leave requests | TEACHER, ADMIN |
| POST | `/teacher/subjects` | Create subject | TEACHER, ADMIN |
| DELETE | `/teacher/subjects/:subjectId` | Delete subject | TEACHER, ADMIN |

### 3. Student Management APIs (`/student`)
Endpoints for managing student profiles and administrative oversight.

| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|--------------|
| POST | `/student/create-student` | Create student profile | ADMIN |
| PATCH | `/student/:id` | Update student information | ADMIN |
| DELETE | `/student/:id` | Delete student profile | ADMIN |

### 4. Organization Management APIs (`/organization`)
Administrative endpoints for organization settings.

| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|--------------|
| *(Various)* | `/organization/*` | Organization management | ADMIN, SUPER_ADMIN |

### 5. Course Management APIs (`/course`)
Endpoints for course administration.

| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|--------------|
| *(Various)* | `/course/*` | Course management | ADMIN, TEACHER |

---

## Frontend Auth APIs

These APIs are used by the frontend applications (student portal, teacher portal, and general authentication).

### Base URL: `/api/v1`

### 1. Core Authentication APIs (`/auth`)
Public and protected endpoints for user authentication flows.

| Method | Endpoint | Description | Protection |
|--------|----------|-------------|------------|
| POST | `/auth/register` | User registration | Public |
| POST | `/auth/login` | User login | Public |
| POST | `/auth/forgot-password` | Request password reset | Public |
| POST | `/auth/reset-password` | Reset password with token | Public |
| POST | `/auth/verify-email` | Verify email address | Public |
| POST | `/auth/refresh-token` | Refresh access token | Refresh Token Required |
| POST | `/auth/logout` | User logout | Refresh Token Required |
| POST | `/auth/change-password` | Change password | Access Token Required |
| GET | `/auth/profile` | Get current user profile | Access Token Required |
| PATCH | `/auth/profile` | Update user profile | Access Token Required |

### 2. Student Portal APIs (`/student`)
Endpoints for student self-service operations.

| Method | Endpoint | Description | Protection |
|--------|----------|-------------|------------|
| GET | `/student/:id` | Get student information | Access Token Required |
| GET | `/student/user/:userId` | Get student by user ID | Access Token Required |
| GET | `/student/` | Get all students (filtered) | Access Token Required |
| GET | `/student/profile/:id` | Get student profile | Access Token Required |
| GET | `/student/:id/attendance` | Get attendance records | Access Token Required |
| GET | `/student/:id/attendance-summary` | Get attendance summary | Access Token Required |
| POST | `/student/:id/leave-request` | Submit leave request | Access Token Required |
| PATCH | `/student/profile/:id` | Update student profile | Access Token Required |
| GET | `/student/dashboard/:id` | Get dashboard data | Access Token Required |

### 3. Teacher Portal APIs (`/teacher`)
Endpoints for teacher self-service operations.

| Method | Endpoint | Description | Protection |
|--------|----------|-------------|------------|
| GET | `/teacher/:teacherId` | Get teacher profile | Access Token Required |
| PUT | `/teacher/:teacherId` | Update teacher profile | Access Token Required |
| GET | `/teacher/:teacherId/dashboard` | Get teacher dashboard | Access Token Required |
| POST | `/teacher/:teacherId/schedules` | Create class schedule | Access Token Required |
| GET | `/teacher/:teacherId/schedules` | Get teacher schedules | Access Token Required |
| GET | `/teacher/:teacherId/schedules/today` | Get today's schedule | Access Token Required |
| PUT | `/teacher/:teacherId/schedules/:scheduleId` | Update schedule | Access Token Required |
| DELETE | `/teacher/:teacherId/schedules/:scheduleId` | Delete schedule | Access Token Required |
| GET | `/teacher/subjects` | Get all subjects | Access Token Required |
| GET | `/teacher/subjects/:subjectId` | Get subject by ID | Access Token Required |
| PUT | `/teacher/subjects/:subjectId` | Update subject | Access Token Required |
| GET | `/teacher/user/:userId/profile` | Get profile by user ID | Access Token Required |

### 4. Attendance APIs (`/attendance`)
Endpoints for attendance operations (used by both frontend and admin).

| Method | Endpoint | Description | Protection |
|--------|----------|-------------|------------|
| GET | `/attendance/*` | Various attendance endpoints | Access Token Required |

### 5. QR Code APIs (`/qr`)
Endpoints for QR-based attendance system.

| Method | Endpoint | Description | Protection |
|--------|----------|-------------|------------|
| GET | `/qr/*` | QR code generation/validation | Access Token Required |

---

## Authentication Flow

### 1. Registration & Login Flow
```
1. POST /auth/register → User account creation
2. POST /auth/verify-email → Email verification
3. POST /auth/login → Get access & refresh tokens
4. POST /auth/refresh-token → Refresh access token
```

### 2. Password Reset Flow
```
1. POST /auth/forgot-password → Send reset email
2. POST /auth/reset-password → Reset with token
```

### 3. Profile Management Flow
```
1. GET /auth/profile → Get current user info
2. PATCH /auth/profile → Update profile
3. POST /auth/change-password → Change password
```

---

## Middleware Usage

### Authentication Middleware
- **`AuthMiddleware.authenticate`**: Validates access token
- **`AuthMiddleware.verifyRefreshToken`**: Validates refresh token
- **`AuthMiddleware.authorize(roles)`**: Role-based authorization
- **`AuthMiddleware.isAdmin`**: Admin-only access
- **`AuthMiddleware.isTeacher`**: Teacher-only access
- **`AuthMiddleware.isStudent`**: Student-only access
- **`AuthMiddleware.isTeacherOrAdmin`**: Teacher or Admin access

### Role Hierarchy
1. **SUPER_ADMIN**: Full system access
2. **ADMIN**: Administrative functions
3. **TEACHER**: Teaching and attendance management
4. **STUDENT**: Self-service operations

### Token Types
- **Access Token**: Short-lived (15 minutes), used for API requests
- **Refresh Token**: Long-lived (7 days), used to obtain new access tokens

---

## API Response Format

### Success Response
```json
{
  "statusCode": 200,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "statusCode": 401,
  "message": "Unauthorized Access",
  "error": { ... }
}
```

---

## Security Notes

1. **Token Storage**: Store tokens securely on client-side
2. **HTTPS**: Always use HTTPS in production
3. **Rate Limiting**: Implement rate limiting for auth endpoints
4. **Password Policies**: Enforce strong password requirements
5. **Session Management**: Properly handle logout and token invalidation

---

## Postman Collection

A complete Postman collection is available at:
`attendflow-server/AttendFlow_API_Collection.postman_collection.json`

This collection contains all the authentication endpoints with proper headers and example requests for testing purposes.
