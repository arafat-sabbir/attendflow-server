# QR Code Attendance System - Complete Implementation Guide

## Overview
This document describes the complete QR code journey for the AttendFlow attendance management system. The QR code system now includes comprehensive validation, date/time checks, and automatic attendance record creation.

## Features Implemented

### 1. QR Token Generation with Validation
- **Date/Time Validation**: Tokens have `validFrom` and `validUntil` timestamps
- **Usage Limits**: Tokens can be configured with `maxUses` (default: 1)
- **Security Measures**: 
  - Maximum 24-hour validity period
  - Automatic expiration after max uses reached
  - 5-minute clock sync buffer for past dates
- **Location & Description**: Optional fields for better tracking

### 2. QR Token Validation with Attendance Integration
- **Comprehensive Checks**: Validates token existence, status, date/time, and usage limits
- **Duplicate Prevention**: Prevents users from checking in multiple times with same token
- **Automatic Attendance**: Creates or updates attendance records upon successful validation
- **Client Tracking**: Captures IP address and user agent for security auditing

### 3. Enhanced Error Handling
- **Specific Error Messages**: Clear feedback for different failure scenarios
- **Graceful Degradation**: Attendance creation failures don't break check-in process
- **Validation Errors**: Comprehensive input validation with meaningful messages

## API Endpoints

### 1. Generate QR Token
```http
POST /api/qr/generate
Authorization: Bearer <teacher_or_admin_token>
Content-Type: application/json

{
  "courseId": "course_id",
  "teacherId": "teacher_id",
  "validFrom": "2025-12-24T10:00:00Z",  // Optional
  "validUntil": "2025-12-24T10:30:00Z", // Optional (default: 30 min)
  "maxUses": 50,                        // Optional (default: 1, max: 1000)
  "location": "Room 101",               // Optional
  "description": "Lecture 5"             // Optional
}
```

**Response:**
```json
{
  "statusCode": 201,
  "message": "QR token generated successfully",
  "data": {
    "id": "qr_token_id",
    "code": "generated_token_string",
    "courseId": "course_id",
    "teacherId": "user_id",
    "validFrom": "2025-12-24T10:00:00Z",
    "validUntil": "2025-12-24T10:30:00Z",
    "maxUses": 50,
    "usedCount": 0,
    "status": "ACTIVE",
    "location": "Room 101",
    "description": "Lecture 5",
    "createdAt": "2025-12-24T09:55:00Z",
    "updatedAt": "2025-12-24T09:55:00Z"
  }
}
```

### 2. Validate QR Token (Check-in)
```http
POST /api/qr/validate
Authorization: Bearer <student_teacher_or_admin_token>
Content-Type: application/json

{
  "token": "generated_token_string",
  "userId": "student_user_id",
  "location": "Room 101",           // Optional
  "ipAddress": "192.168.1.100",     // Optional (auto-captured)
  "userAgent": "Mozilla/5.0..."      // Optional (auto-captured)
}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "QR token validated and check-in recorded successfully",
  "data": {
    "checkIn": {
      "id": "check_in_id",
      "qrCodeId": "qr_token_id",
      "userId": "student_user_id",
      "checkInTime": "2025-12-24T10:15:00Z",
      "location": "Room 101",
      "ipAddress": "192.168.1.100",
      "userAgent": "Mozilla/5.0...",
      "isValid": true,
      "createdAt": "2025-12-24T10:15:00Z"
    },
    "attendance": {
      "id": "attendance_id",
      "userId": "student_user_id",
      "courseId": "course_id",
      "date": "2025-12-24T00:00:00Z",
      "status": "PRESENT",
      "checkIn": "2025-12-24T10:15:00Z",
      "qRCodeId": "qr_token_id",
      "markedBy": "teacher_user_id"
    },
    "message": "QR token validated successfully. Attendance has been recorded."
  }
}
```

### 3. Get QR Tokens
```http
GET /api/qr/?courseId=course_id&status=ACTIVE&page=1&limit=10
Authorization: Bearer <teacher_or_admin_token>
```

### 4. Get QR Check-ins
```http
GET /api/qr/check-ins?tokenId=qr_token_id&userId=student_id&page=1&limit=10
Authorization: Bearer <teacher_or_admin_token>
```

## Validation Rules

### QR Token Generation
1. **Course Validation**: Course must exist
2. **Teacher Validation**: Teacher must exist and be associated with user account
3. **Date/Time Validation**:
   - `validFrom` cannot be more than 5 minutes in the past
   - `validUntil` must be after `validFrom`
   - `validUntil` cannot be more than 24 hours from now
4. **Usage Limits**: `maxUses` must be between 1 and 1000
5. **String Limits**: Location (max 255 chars), Description (max 500 chars)

### QR Token Validation
1. **Token Existence**: Token must exist in database
2. **Status Check**: Token must be ACTIVE
3. **Date/Time Check**: Current time must be between `validFrom` and `validUntil`
4. **Usage Check**: Token must not have reached `maxUses`
5. **Duplicate Prevention**: User cannot check in twice with same token

## Error Scenarios

### Token Not Found
```json
{
  "statusCode": 404,
  "message": "QR token not found"
}
```

### Token Expired
```json
{
  "statusCode": 410,
  "message": "Token has expired"
}
```

### Token Not Yet Valid
```json
{
  "statusCode": 410,
  "message": "Token is not yet valid"
}
```

### Maximum Usage Reached
```json
{
  "statusCode": 410,
  "message": "Token has reached maximum usage limit"
}
```

### Duplicate Check-in
```json
{
  "statusCode": 409,
  "message": "User has already checked in with this QR token"
}
```

## Security Features

1. **Token Expiration**: Automatic expiration based on time and usage
2. **Rate Limiting**: Tokens have maximum usage limits
3. **Audit Trail**: IP address and user agent tracking
4. **Access Control**: Role-based access to different endpoints
5. **Input Validation**: Comprehensive server-side validation

## Database Schema

### QRCode Table
- `id`: Primary key
- `code`: Unique token string (32 characters)
- `courseId`: Foreign key to courses table
- `teacherId`: Foreign key to users table
- `validFrom`: Token activation timestamp
- `validUntil`: Token expiration timestamp
- `maxUses`: Maximum number of uses allowed
- `usedCount`: Current usage count
- `status`: ACTIVE/EXPIRED/USED
- `location`: Optional location description
- `description`: Optional description
- `createdAt/updatedAt`: Timestamps

### QRCheckIn Table
- `id`: Primary key
- `qrCodeId`: Foreign key to QR codes table
- `userId`: Foreign key to users table
- `checkInTime`: Check-in timestamp
- `location`: Optional location at check-in
- `ipAddress`: Client IP address
- `userAgent`: Client user agent string
- `isValid`: Validation status
- `createdAt`: Creation timestamp

## Usage Flow

1. **Teacher generates QR token** with specific parameters (course, validity, usage limits)
2. **System validates inputs** and creates token with 32-character unique code
3. **Teacher shares QR code** containing the token with students
4. **Student scans QR code** and sends validation request with token and user ID
5. **System validates token** (existence, status, time, usage limits)
6. **System checks for duplicates** (prevents multiple check-ins)
7. **System creates check-in record** with location, IP, and user agent
8. **System creates/updates attendance record** automatically
9. **System updates token usage** and expires if max uses reached
10. **System returns success response** with check-in and attendance details

## Best Practices

1. **Token Generation**:
   - Use appropriate validity periods (15-60 minutes for typical classes)
   - Set reasonable usage limits based on class size
   - Include location and description for better tracking

2. **Client Implementation**:
   - Automatically capture IP address and user agent
   - Handle network errors gracefully
   - Provide clear feedback to users
   - Store token securely (if needed)

3. **Security Considerations**:
   - Use HTTPS for all API calls
   - Implement proper authentication/authorization
   - Monitor for unusual usage patterns
   - Regular cleanup of old tokens

## Testing Scenarios

### Positive Cases
- [ ] Generate token with all parameters
- [ ] Generate token with default parameters
- [ ] Validate token within validity period
- [ ] Validate token at exact start time
- [ ] Validate token at exact end time
- [ ] Multiple successful validations (within maxUses)
- [ ] Automatic attendance record creation

### Negative Cases
- [ ] Validate expired token
- [ ] Validate token before start time
- [ ] Validate non-existent token
- [ ] Duplicate check-in attempt
- [ ] Token usage limit exceeded
- [ ] Invalid course/teacher IDs
- [ ] Invalid date ranges

### Edge Cases
- [ ] Token with very short validity (1 minute)
- [ ] Token with maximum validity (24 hours)
- [ ] Token with maximum usage limit (1000)
- [ ] Concurrent validation attempts
- [ ] Network failures during validation

This implementation provides a complete, secure, and robust QR code attendance system with comprehensive validation and automatic attendance tracking.
