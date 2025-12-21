# AttendFlow - Two-Application Architecture

## 📐 Architecture Overview

AttendFlow uses a **two-application architecture** to separate user interactions from administrative management:

1. **Frontend Application** (User Portal) - `FRONTEND_PAGES.md`
2. **Dashboard Application** (Admin Panel) - `DASHBOARD_FEATURES.md`

---

## 🎯 Application Purposes

### 1️⃣ Frontend Application (User Portal)

**Primary Purpose**: View, interact, and consume information

**Target Users**: Students, Teachers, Admins (read-only)

**Key Features**:

- ✅ View dashboards and analytics
- ✅ QR code check-in (students)
- ✅ View attendance records
- ✅ Apply for leave
- ✅ View notifications
- ✅ View course schedules
- ✅ Mark attendance (teachers only)
- ✅ Generate QR codes (teachers only)
- ✅ Approve leave requests (teachers only)
- ❌ **NO CRUD operations** (no create, edit, delete for entities)
- ❌ **NO system configuration**
- ❌ **NO bulk operations**

**Technology**: React.js / Vue.js / Next.js (user-facing, responsive, mobile-friendly)

**See**: `FRONTEND_PAGES.md` for complete specifications

---

### 2️⃣ Dashboard Application (Admin Panel)

**Primary Purpose**: Manage, configure, and administer the system

**Target Users**: Admins (full access), Teachers (limited management)

**Key Features**:

- ✅ **CRUD operations** for all entities (Users, Students, Teachers, Departments, Batches, Subjects, Courses, etc.)
- ✅ **Bulk operations** (bulk enroll, bulk approve, CSV import)
- ✅ **System configuration** (settings, policies, thresholds)
- ✅ **Analytics and reports** (comprehensive dashboards, export reports)
- ✅ **User management** (create, edit, delete, role changes, status changes)
- ✅ **Organization management** (departments, batches, semesters, subjects)
- ✅ **Course management** (create courses, manage enrollments, class schedules)
- ✅ **System-wide attendance management** (view all, edit, bulk update)
- ✅ **System-wide leave management** (approve/reject, policies, bulk actions)
- ✅ **QR code management** (monitor, expire, statistics)
- ✅ **Notification management** (send bulk, templates, scheduling)
- ✅ **Reports generation** (attendance, leave, user, course reports)

**Technology**: React.js / Vue.js (admin-focused, desktop-optimized, data tables)

**See**: `DASHBOARD_FEATURES.md` for complete specifications

---

## 👥 Role-Based Access

### Student Role

| Feature             | Frontend App | Dashboard App |
| ------------------- | ------------ | ------------- |
| View Dashboard      | ✅ Yes       | ✅ Same view  |
| QR Check-In         | ✅ Yes       | ❌ N/A        |
| View Attendance     | ✅ Yes       | ❌ N/A        |
| Apply for Leave     | ✅ Yes       | ❌ N/A        |
| View Schedule       | ✅ Yes       | ❌ N/A        |
| View Notifications  | ✅ Yes       | ❌ N/A        |
| Management Features | ❌ No        | ❌ No access  |

**Students only use the Frontend App.**

---

### Teacher Role

| Feature          | Frontend App       | Dashboard App             |
| ---------------- | ------------------ | ------------------------- |
| View Dashboard   | ✅ Yes             | ✅ Enhanced analytics     |
| View My Courses  | ✅ Yes             | ✅ With management        |
| Mark Attendance  | ✅ Yes             | ✅ + Edit past records    |
| Generate QR Code | ✅ Yes             | ✅ + Monitor system-wide  |
| Approve Leave    | ✅ Yes             | ✅ + Bulk actions         |
| View Schedule    | ✅ Yes (read-only) | ⚠️ Limited (may edit own) |
| Manage Courses   | ❌ No              | ⚠️ If granted permission  |
| Manage Students  | ❌ No              | ❌ No                     |
| System Settings  | ❌ No              | ❌ No                     |

**Teachers primarily use Frontend App. Dashboard access is optional for enhanced analytics and limited management.**

---

### Admin Role

| Feature                     | Frontend App      | Dashboard App             |
| --------------------------- | ----------------- | ------------------------- |
| View Dashboard              | ✅ Basic overview | ✅ Full analytics         |
| View Notifications          | ✅ Yes            | ✅ + Send notifications   |
| **User Management**         | ❌ No             | ✅ Full CRUD              |
| **Student Management**      | ❌ No             | ✅ Full CRUD              |
| **Teacher Management**      | ❌ No             | ✅ Full CRUD              |
| **Department Management**   | ❌ No             | ✅ Full CRUD              |
| **Batch Management**        | ❌ No             | ✅ Full CRUD              |
| **Subject Management**      | ❌ No             | ✅ Full CRUD              |
| **Course Management**       | ❌ No             | ✅ Full CRUD              |
| **Enrollment Management**   | ❌ No             | ✅ Full CRUD + Bulk       |
| **Schedule Management**     | ❌ No             | ✅ Full CRUD + Conflicts  |
| **Attendance Management**   | ❌ No             | ✅ System-wide + Edit     |
| **Leave Management**        | ❌ No             | ✅ System-wide + Policies |
| **QR Management**           | ❌ No             | ✅ Monitor + Expire       |
| **Notification Management** | ❌ No             | ✅ Bulk Send + Templates  |
| **Reports**                 | ❌ No             | ✅ Generate + Export      |
| **System Settings**         | ❌ No             | ✅ Full Configuration     |

**Admins use Frontend App for quick overview, Dashboard App for all management tasks.**

---

## 🔀 Application Flow

### User Journey - Student

```
1. Login → Redirected to Frontend App (/student/dashboard)
2. View attendance percentage
3. Check today's schedule
4. Click "QR Check-In" → Scan QR code
5. Apply for leave → Fill form → Submit
6. View notifications
```

**Student never accesses Dashboard App.**

---

### User Journey - Teacher

```
1. Login → Redirected to Frontend App (/teacher/dashboard)
2. View today's classes
3. Click "Mark Attendance" → Select students → Save
4. Click "Generate QR" → QR code generated → Display to students
5. View pending leave requests → Approve/Reject
6. (Optional) Open Dashboard App for:
   - View detailed analytics
   - Edit past attendance records
   - Bulk approve leaves
```

**Teacher uses Frontend App daily, Dashboard App occasionally for management.**

---

### User Journey - Admin

```
1. Login → Redirected to Frontend App (/admin/dashboard)
2. View system overview (quick stats)
3. Click "Open Admin Panel" button → Redirected to Dashboard App
4. In Dashboard App:
   - Create new users (students, teachers)
   - Create departments, batches, subjects
   - Create courses and enroll students
   - Manage class schedules
   - View system-wide attendance
   - Approve/reject all leave requests
   - Send bulk notifications
   - Configure system settings
   - Generate reports
```

**Admin uses Dashboard App for all management tasks.**

---

## 🔗 Navigation Between Apps

### From Frontend App to Dashboard App

**For Admins**:

- Button in Frontend App: "Open Admin Panel"
- URL: `https://dashboard.attendflow.com` (or localhost:3001)
- Auto-login with same JWT token

**For Teachers** (if granted access):

- Button: "Open Management Dashboard"
- Limited permissions applied

**For Students**:

- No link/button (no access)

---

### From Dashboard App to Frontend App

- Link in Dashboard navbar: "View User Portal"
- URL: `https://app.attendflow.com` (or localhost:3000)

---

## 🌐 Deployment Scenarios

### Scenario 1: Separate Domains

```
Frontend App: https://app.attendflow.com
Dashboard App: https://admin.attendflow.com (or dashboard.attendflow.com)
Backend API: https://api.attendflow.com
```

**Pros**: Clear separation, better security, different scaling
**Cons**: Separate deployments, shared JWT/session management needed

---

### Scenario 2: Same Domain, Different Paths

```
Frontend App: https://attendflow.com/
Dashboard App: https://attendflow.com/admin/
Backend API: https://attendflow.com/api/
```

**Pros**: Easier shared authentication, single domain
**Cons**: Routing complexity, bundling considerations

---

### Scenario 3: Localhost Development

```
Frontend App: http://localhost:3000
Dashboard App: http://localhost:3001
Backend API: http://localhost:5000
```

---

## 🛠️ Technical Implementation

### Shared Dependencies

- Same backend API (`http://localhost:5000/api/v1`)
- Same authentication (JWT tokens)
- Same state management approach (Redux/Zustand)
- Same API client (Axios)
- Can share common components library (npm package or monorepo)

### Differences

| Aspect          | Frontend App                              | Dashboard App                 |
| --------------- | ----------------------------------------- | ----------------------------- |
| **UI Library**  | Material-UI / Ant Design                  | Ant Design Pro / React Admin  |
| **Focus**       | Mobile-responsive                         | Desktop-optimized             |
| **Components**  | Cards, QR Scanner, Notifications          | Data Tables, Forms, Charts    |
| **Routing**     | Public + Student + Teacher + Admin (view) | Admin + (Teacher) management  |
| **Bundle Size** | Smaller (less features)                   | Larger (more features)        |
| **Performance** | Optimized for mobile                      | Optimized for data operations |

---

## 📂 Project Structure Recommendation

### Option 1: Separate Repositories

```
attendflow-frontend/        (User Portal)
attendflow-dashboard/       (Admin Panel)
attendflow-server/          (Backend API)
```

### Option 2: Monorepo (Recommended)

```
attendflow/
├── packages/
│   ├── frontend/          (User Portal)
│   ├── dashboard/         (Admin Panel)
│   ├── server/            (Backend API)
│   └── shared/            (Shared components, utils, types)
├── package.json           (Root workspace)
└── README.md
```

**Tools**: Nx, Turborepo, Lerna

---

## 🔐 Authentication & Authorization

### Shared JWT Token

- Both apps use the same JWT access token
- Stored in localStorage/cookies
- Backend validates token and role for each request

### Role-Based Access Control (Backend)

```javascript
// Example: Auth middleware checks role for endpoints

// Frontend App - Mark attendance (Teacher only)
POST /api/v1/teacher/:teacherId/attendance/mark
→ Middleware: isTeacher || isAdmin

// Dashboard App - Create user (Admin only)
POST /api/v1/user/create-user
→ Middleware: isAdmin
```

### Frontend Route Guards

```javascript
// Frontend App
<ProtectedRoute path="/student/*" allowedRoles={['STUDENT']} />
<ProtectedRoute path="/teacher/*" allowedRoles={['TEACHER']} />

// Dashboard App
<ProtectedRoute path="/admin/*" allowedRoles={['ADMIN']} />
<ProtectedRoute path="/teacher/*" allowedRoles={['TEACHER', 'ADMIN']} />
```

---

## 📊 API Endpoint Distribution

### Endpoints Used by Frontend App

- `POST /api/v1/auth/login`
- `GET /api/v1/student/dashboard/:id`
- `POST /api/v1/qr/validate`
- `POST /api/v1/teacher/:id/attendance/mark`
- `POST /api/v1/qr/generate`
- `GET /api/v1/notification`
- `POST /api/v1/student/:id/leave-request`
- `PATCH /api/v1/leave/:id/approve`

**Total**: ~50 endpoints (read-heavy, limited writes)

---

### Endpoints Used by Dashboard App

- All Frontend endpoints +
- `POST /api/v1/user/create-user`
- `POST /api/v1/student/create-student`
- `POST /api/v1/organization/departments`
- `POST /api/v1/course/courses`
- `POST /api/v1/course/enrollments/bulk`
- `PATCH /api/v1/attendance/:id` (edit)
- `DELETE /api/v1/user/:id`
- `POST /api/v1/notification/send-bulk`
- `GET /api/v1/leave/stats`
- ... and all other CRUD endpoints

**Total**: ~120 endpoints (read + write heavy, CRUD focus)

---

## 🎨 UI/UX Differences

### Frontend App (User Portal)

- **Design**: Clean, minimal, card-based
- **Navigation**: Bottom tabs (mobile), sidebar (desktop)
- **Colors**: Bright, friendly, engaging
- **Focus**: Quick actions, notifications, at-a-glance info
- **Target Device**: Mobile-first, responsive

### Dashboard App (Admin Panel)

- **Design**: Data-dense, table-heavy, professional
- **Navigation**: Sidebar menu with nested items
- **Colors**: Neutral, professional (gray/blue tones)
- **Focus**: Data management, bulk operations, detailed reports
- **Target Device**: Desktop-optimized, tablet support

---

## ✅ Development Checklist

### Phase 1: Frontend App (User Portal)

- [ ] Setup project (React/Vue)
- [ ] Authentication (login, register, JWT)
- [ ] Student pages (dashboard, QR check-in, attendance, leave)
- [ ] Teacher pages (dashboard, mark attendance, QR generate, leave approve)
- [ ] Admin overview page (read-only dashboard)
- [ ] Shared components (navbar, notifications)

### Phase 2: Dashboard App (Admin Panel)

- [ ] Setup project (React Admin / separate React app)
- [ ] Authentication (shared JWT from Frontend)
- [ ] User management (CRUD)
- [ ] Organization management (departments, batches, subjects, semesters)
- [ ] Course management (courses, enrollments, schedules)
- [ ] Attendance management (system-wide view, edit)
- [ ] Leave management (system-wide, bulk actions)
- [ ] QR management (monitor, expire)
- [ ] Notification management (bulk send, templates)
- [ ] Reports (generate, export)
- [ ] System settings

### Phase 3: Integration & Polish

- [ ] Cross-app navigation (buttons, links)
- [ ] Shared authentication (token passing)
- [ ] Consistent API client
- [ ] Shared component library
- [ ] Mobile responsiveness (Frontend App)
- [ ] Desktop optimization (Dashboard App)
- [ ] Testing (E2E, unit tests)
- [ ] Deployment (CI/CD for both apps)

---

## 📚 Documentation Reference

- **`FRONTEND_PAGES.md`** - Complete Frontend App (User Portal) specifications
- **`DASHBOARD_FEATURES.md`** - Complete Dashboard App (Admin Panel) specifications
- **`APPLICATION_ARCHITECTURE.md`** - This document (two-app architecture overview)

---

## 🚀 Quick Start

### For Frontend Developers (User Portal)

1. Read `FRONTEND_PAGES.md`
2. Focus on: Student Portal, Teacher Portal, Basic Admin view
3. Implement: QR scanner, attendance views, leave forms, notifications
4. Test on: Mobile devices, responsive design

### For Dashboard Developers (Admin Panel)

1. Read `DASHBOARD_FEATURES.md`
2. Focus on: CRUD operations, data tables, bulk actions, reports
3. Implement: User management, organization management, course management, system settings
4. Test on: Desktop browsers, large datasets, complex filters

---

**This completes the application architecture documentation. Both apps share the same backend but serve different purposes.**
