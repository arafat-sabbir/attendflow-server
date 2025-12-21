# Auth Module Documentation

## Overview

The Auth module provides comprehensive authentication and authorization functionality for the AttendFlow application. It handles user registration, login, logout, password management, and role-based access control.

## Features

- User registration and login
- JWT token generation and verification
- Refresh token mechanism
- Password reset functionality
- Email verification
- Role-based access control (RBAC)
- Profile management

## API Endpoints

### Public Routes (No Authentication Required)

#### POST /auth/register

Register a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "name": "John Doe",
  "password": "password123",
  "role": "STUDENT" // Optional, defaults to STUDENT
}
```

**Response:**

```json
{
  "statusCode": 201,
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "username": "johndoe",
      "name": "John Doe",
      "role": "STUDENT",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

#### POST /auth/login

Authenticate a user and return tokens.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "STUDENT",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

#### POST /auth/forgot-password

Request a password reset email.

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Password reset email sent",
  "data": null
}
```

#### POST /auth/reset-password

Reset password using a reset token.

**Request Body:**

```json
{
  "token": "reset_token",
  "newPassword": "new_password123"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Password reset successfully",
  "data": null
}
```

#### POST /auth/verify-email

Verify user email using a verification token.

**Request Body:**

```json
{
  "token": "verification_token"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Email verified successfully",
  "data": null
}
```

### Protected Routes (Authentication Required)

#### POST /auth/refresh-token

Refresh an access token using a refresh token.

**Request Body:**

```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Access token refreshed successfully",
  "data": {
    "accessToken": "new_jwt_access_token"
  }
}
```

#### POST /auth/logout

Logout a user by invalidating their refresh token.

**Request Body:**

```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "User logged out successfully",
  "data": null
}
```

#### POST /auth/change-password

Change the authenticated user's password.

**Request Headers:**

```
Authorization: Bearer jwt_access_token
```

**Request Body:**

```json
{
  "currentPassword": "current_password123",
  "newPassword": "new_password123"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Password changed successfully",
  "data": null
}
```

#### GET /auth/profile

Get the authenticated user's profile.

**Request Headers:**

```
Authorization: Bearer jwt_access_token
```

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "id": "user_id",
    "role": "STUDENT"
  }
}
```

#### PATCH /auth/profile

Update the authenticated user's profile.

**Request Headers:**

```
Authorization: Bearer jwt_access_token
```

**Request Body:**

```json
{
  "name": "John Updated",
  "username": "johnupdated",
  "email": "johnupdated@example.com"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Profile updated successfully",
  "data": null
}
```

## User Roles

The system supports the following user roles:

1. **SUPER_ADMIN** - Has full system access
2. **ADMIN** - Has administrative privileges
3. **TEACHER** - Can manage classes and attendance
4. **STUDENT** - Can view and manage their own attendance

## Middleware Usage

### Authentication Middleware

To protect routes, use the `authenticate` middleware:

```typescript
import { AuthMiddleware } from '../modules/auth/auth.middleware';

router.get('/protected-route', AuthMiddleware.authenticate, (req, res) => {
  // req.user contains the authenticated user's information
  res.json({ message: 'Protected data', user: req.user });
});
```

### Authorization Middleware

To restrict access based on user roles:

```typescript
// Only allow teachers and admins
router.get('/teacher-route', AuthMiddleware.authorize('TEACHER', 'ADMIN'), (req, res) => {
  res.json({ message: 'Teacher or admin only data' });
});

// Only allow super admins
router.get('/admin-route', AuthMiddleware.isSuperAdmin, (req, res) => {
  res.json({ message: 'Super admin only data' });
});
```

### Ownership or Admin Access

To allow users to access their own resources or admins to access any resource:

```typescript
router.get(
  '/user/:userId',
  AuthMiddleware.authenticate,
  AuthMiddleware.authorizeOwnerOrAdmin('userId'),
  (req, res) => {
    // User can access their own data or admins can access any user's data
    res.json({ message: 'User data' });
  }
);
```

## Integration with Other Modules

### User Module

The Auth module integrates with the User module for user management:

```typescript
import { UserModel } from '../modules/user/user.model';
import { AuthService } from '../modules/auth/auth.service';

// Get user details
const user = await UserModel.findUnique({
  where: { id: userId },
});

// Check user role
const hasAccess = await AuthService.checkUserRole(userId, ['TEACHER', 'ADMIN']);
```

### Teacher Module

For teacher-specific endpoints, use the teacher role check:

```typescript
import { AuthMiddleware } from '../modules/auth/auth.middleware';

// Protect teacher routes
router.get(
  '/teacher/classes',
  AuthMiddleware.authenticate,
  AuthMiddleware.isTeacher,
  teacherController.getClasses
);
```

### Student Module

For student-specific endpoints, use the student role check:

```typescript
import { AuthMiddleware } from '../modules/auth/auth.middleware';

// Protect student routes
router.get(
  '/student/attendance',
  AuthMiddleware.authenticate,
  AuthMiddleware.isStudent,
  studentController.getAttendance
);
```

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# JWT Configuration
JWT_ACCESS_SECRET=your_access_secret_key
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRES=30d
JWT_RESET_SECRET=your_reset_secret_key
JWT_EMAIL_SECRET=your_email_secret_key
```

## Security Considerations

1. Always use HTTPS in production
2. Store JWT secrets securely
3. Implement rate limiting for auth endpoints
4. Use strong password policies
5. Consider implementing 2FA for sensitive operations
6. Regularly rotate JWT secrets
7. Implement proper session management

## Error Handling

The auth module uses standard HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict

All error responses follow the standard format:

```json
{
  "statusCode": 401,
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```
