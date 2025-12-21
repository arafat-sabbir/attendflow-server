# Prisma Multi-Schema Setup

This project uses a **multi-schema approach** for better organization and maintainability of the Prisma schema.

## Structure

```
prisma/
├── schema.base.prisma       # Base config (generator, datasource, enums)
├── schema.prisma            # Generated/merged file (DO NOT EDIT DIRECTLY)
├── user.prisma              # User, Student, Teacher models
├── organization.prisma      # Department, Batch, Course, Semester, Subject models
├── attendance.prisma        # Attendance, QRCode, AttendanceSession models
├── leave.prisma             # LeaveRequest, LeaveBalance, LeavePolicy models
├── notification.prisma      # Notification models
└── auth.prisma              # RefreshToken, PasswordResetToken models
```

## How It Works

1. **Edit individual `.prisma` files** - Each module has its own file
2. **Run merge script** - Combines all files into `schema.prisma`
3. **Prisma commands** - Use the merged `schema.prisma`

## Important Rules

### ✅ DO:

- Edit `schema.base.prisma` for generator, datasource, or enum changes
- Edit individual module files (`user.prisma`, `organization.prisma`, etc.) for models
- Run `npm run schema:merge` before any Prisma command
- Use the npm scripts provided (they auto-merge)

### ❌ DON'T:

- **Never edit `schema.prisma` directly** - it gets overwritten by the merge script
- Don't duplicate datasource/generator in module files
- Don't define the same model in multiple files

## Available Scripts

All Prisma commands automatically merge schemas before execution:

```bash
# Merge schema files manually
npm run schema:merge

# Generate Prisma Client (auto-merges)
npm run prisma:generate

# Create and apply migrations (auto-merges)
npm run prisma:migrate

# Open Prisma Studio (auto-merges)
npm run prisma:studio

# Format schema files (auto-merges)
npm run prisma:format

# Push schema to database (auto-merges)
npm run db:push

# Pull schema from database
npm run db:pull
```

## Adding a New Model

1. Decide which module file it belongs to (or create a new one)
2. Add the model to the appropriate `.prisma` file
3. Update `scripts/merge-schemas.js` if you created a new file
4. Run `npm run schema:merge` to test
5. Run `npm run prisma:generate` to generate the client

## Adding a New Schema File

1. Create `prisma/newmodule.prisma`
2. Add only models (no datasource/generator/enums)
3. Edit `scripts/merge-schemas.js`:
   ```js
   const schemaFiles = [
     'user.prisma',
     'organization.prisma',
     'attendance.prisma',
     'leave.prisma',
     'notification.prisma',
     'auth.prisma',
     'newmodule.prisma', // Add here
   ];
   ```
4. Run `npm run schema:merge`

## Benefits

- **Better Organization**: Models grouped by domain
- **Easier Navigation**: Find models quickly
- **Team Collaboration**: Reduced merge conflicts
- **Maintainability**: Clear separation of concerns
- **Scalability**: Easy to add new modules

## Troubleshooting

### Error: "model already exists"

- Make sure you're not editing `schema.prisma` directly
- Check that models aren't duplicated across files
- Run `npm run schema:merge` to regenerate

### Merge script fails

- Ensure all `.prisma` files exist
- Check file permissions
- Verify `schema.base.prisma` has correct syntax

### Prisma commands fail

- Always use npm scripts (`npm run prisma:generate` not `prisma generate`)
- Or manually run `npm run schema:merge` first
- Check that `schema.base.prisma` exists

## Version

- Prisma: 7.1.0
- @prisma/client: 7.1.0
