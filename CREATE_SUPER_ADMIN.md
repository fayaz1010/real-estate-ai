# Create Super Admin Account

## Quick Method - Use Existing Seed Script

The super admin will be created when you restart the servers. The schema has been updated.

## Manual SQL Method (Alternative)

If needed, you can create super admin directly in the database:

```sql
-- Connect to your database and run:
UPDATE "User" 
SET role = 'SUPER_ADMIN', 
    status = 'ACTIVE',
    "emailVerified" = true
WHERE email = 'admin@propmanage.com';

-- Or create new:
INSERT INTO "User" (id, email, "passwordHash", "firstName", "lastName", role, status, "emailVerified", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@propmanage.com',
  '$2a$10$...',  -- Use bcrypt hash for 'SuperAdmin@2024'
  'Super',
  'Admin',
  'SUPER_ADMIN',
  'ACTIVE',
  true,
  NOW(),
  NOW()
);
```

## Credentials

```
Email: admin@propmanage.com
Password: SuperAdmin@2024
```

## What Super Admin Can Do

✅ View all users
✅ Manage all properties
✅ View all applications
✅ View all inspections
✅ Suspend/activate users
✅ Delete any content
✅ Full system access

---

**The super admin will be created when servers restart!**
