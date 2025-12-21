# Notification Module

This module handles notifications for students, teachers, and admins via in-app messages and email using Nodemailer.

## Features

- Send in-app notifications
- Send email notifications with Nodemailer
- Send notifications to multiple users (bulk)
- Mark notifications as read/unread
- View notifications with filtering and pagination
- Resend failed email notifications
- Get notification statistics
- Support for scheduled notifications
- Email attachments support

## API Endpoints

### Send Notification

- **POST** `/notification/send`
- Send a notification to a single user (in-app, email, or both)

### Send Email Notification

- **POST** `/notification/send-email`
- Send an email notification with advanced options (CC, BCC, attachments)

### Send Bulk Notifications

- **POST** `/notification/send-bulk`
- Send notifications to multiple users at once

### Get All Notifications

- **GET** `/notification`
- Get notifications with filtering, sorting, and pagination

### Get Single Notification

- **GET** `/notification/:id`
- Get a specific notification by ID

### Update Notification

- **PATCH** `/notification/:id`
- Update notification details

### Mark Notification as Read/Unread

- **PATCH** `/notification/:id/read`
- Mark a notification as read or unread

### Delete Notification

- **DELETE** `/notification/:id`
- Delete a notification

### Resend Failed Email

- **POST** `/notification/:id/resend-email`
- Resend a failed email notification

### Get Notification Statistics

- **GET** `/notification/stats`
- Get notification statistics for a user or time period

### Mark All Notifications as Read

- **PATCH** `/notification/mark-all-read/:recipientId`
- Mark all notifications as read for a user

### Delete All Read Notifications

- **DELETE** `/notification/delete-all-read/:recipientId`
- Delete all read notifications for a user

## Integration with Other Modules

### Student Module Integration

```typescript
import { notificationServices } from '../notification/notification.service';

// Example: Send notification when student is enrolled
const sendEnrollmentNotification = async (studentId: string, courseName: string) => {
  await notificationServices.sendNotification({
    recipientId: studentId,
    title: 'Course Enrollment',
    message: `You have been successfully enrolled in ${courseName}`,
    type: 'BOTH',
  });
};
```

### Teacher Module Integration

```typescript
// Example: Send notification when teacher is assigned to a course
const sendAssignmentNotification = async (teacherId: string, courseName: string) => {
  await notificationServices.sendNotification({
    recipientId: teacherId,
    title: 'Course Assignment',
    message: `You have been assigned to teach ${courseName}`,
    type: 'BOTH',
  });
};
```

### Leave Module Integration

```typescript
// Example: Send notification when leave is approved
const sendLeaveApprovalNotification = async (userId: string, leaveType: string, status: string) => {
  await notificationServices.sendNotification({
    recipientId: userId,
    title: `Leave ${status}`,
    message: `Your ${leaveType} leave request has been ${status.toLowerCase()}`,
    type: 'BOTH',
  });
};
```

### Attendance Module Integration

```typescript
// Example: Send notification for low attendance
const sendLowAttendanceNotification = async (studentId: string, attendancePercentage: number) => {
  if (attendancePercentage < 75) {
    await notificationServices.sendNotification({
      recipientId: studentId,
      title: 'Low Attendance Warning',
      message: `Your attendance is ${attendancePercentage}%. Please maintain at least 75% attendance.`,
      type: 'BOTH',
      priority: 'HIGH',
    });
  }
};

// Example: Send notification for QR check-in
const sendQRCheckInNotification = async (userId: string, location: string) => {
  await notificationServices.sendNotification({
    recipientId: userId,
    title: 'Attendance Check-in',
    message: `You have successfully checked in at ${location}`,
    type: 'IN_APP',
  });
};
```

## Nodemailer Setup

### Environment Variables

Add these to your `.env` file:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=AttendFlow
```

### Gmail Setup

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for your application
3. Use the app password in the EMAIL_PASS environment variable

### Email Configuration

The notification service uses Nodemailer with the following default configuration:

```typescript
const emailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
};
```

## Notification Types

### IN_APP

- Stored in the database
- Visible in the user's notification center
- Can be marked as read/unread

### EMAIL

- Sent via Nodemailer
- Email delivery status is tracked
- Supports attachments, CC, BCC

### BOTH

- Creates both an in-app notification and sends an email
- Tracks email delivery status separately

## Email Status Tracking

- **PENDING**: Email is queued to be sent
- **SENT**: Email was successfully sent
- **FAILED**: Email delivery failed (can be retried)

## Error Handling

The notification service includes comprehensive error handling:

- Database operation errors
- Email sending failures
- Validation errors
- Network connectivity issues

Failed emails are marked with status 'FAILED' and can be resent using the resend endpoint.

## Example Usage

### Send a Simple Notification

```typescript
const notification = await notificationServices.sendNotification({
  recipientId: 'user-123',
  title: 'Welcome',
  message: 'Welcome to AttendFlow!',
  type: 'IN_APP',
});
```

### Send an Email with Attachments

```typescript
const emailNotification = await notificationServices.sendEmailNotification({
  recipientId: 'user-123',
  title: 'Monthly Report',
  message: 'Please find your monthly report attached.',
  type: 'EMAIL',
  emailOptions: {
    attachments: [
      {
        filename: 'report.pdf',
        path: '/path/to/report.pdf',
      },
    ],
  },
});
```

### Send Bulk Notifications

```typescript
const bulkNotifications = await notificationServices.sendBulkNotifications({
  recipientIds: ['user-1', 'user-2', 'user-3'],
  title: 'System Maintenance',
  message: 'The system will be under maintenance from 10 PM to 2 AM.',
  type: 'BOTH',
  priority: 'HIGH',
});
```

## Database Schema

The Notification model includes the following fields:

- `id`: Unique identifier
- `title`: Notification title
- `message`: Notification message
- `type`: IN_APP, EMAIL, or BOTH
- `readStatus`: Whether the notification has been read
- `emailStatus`: PENDING, SENT, or FAILED
- `recipientId`: ID of the recipient user
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp
