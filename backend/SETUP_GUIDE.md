# EduSync Backend Setup Guide

## 🚨 **CRITICAL: Database Schema Mismatch Fixed**

Your backend had several critical database schema mismatches that have now been resolved:

### **Issues Fixed:**
1. ✅ **file_data field mismatch** - Removed unnecessary BLOB field
2. ✅ **upload_date vs uploaded_at** - Fixed field name mapping
3. ✅ **Missing column definitions** - Added proper @Column annotations
4. ✅ **Schema inconsistencies** - Created proper schema.sql file

## **Setup Steps (IMPORTANT - Follow Exactly)**

### **Step 1: Database Setup**
```bash
# Connect to MySQL
mysql -u root -p

# Create/use database
CREATE DATABASE IF NOT EXISTS edusyncupdated;
USE edusyncupdated;

# Run the migration script
source /path/to/your/project/backend/database-migration.sql;
```

### **Step 2: Application Configuration**
The `application.properties` has been updated to:
- Use `create-drop` mode for development (creates fresh tables each time)
- Load schema.sql automatically
- Defer datasource initialization

### **Step 3: Restart Application**
```bash
# Stop the current application
# Then restart
mvn spring-boot:run
```

## **Database Schema (Now Matches Entities Exactly)**

### **Users Table:**
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'FACULTY') NOT NULL,
    profile_picture VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE
);
```

### **Resources Table:**
```sql
CREATE TABLE resources (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    uploaded_by BIGINT NOT NULL,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE
);
```

## **Entity Mapping (Now 100% Accurate)**

### **Resource Entity:**
- `title` → `title` (VARCHAR(255), NOT NULL)
- `description` → `description` (TEXT)
- `fileName` → `file_name` (VARCHAR(255), NOT NULL)
- `fileSize` → `file_size` (BIGINT, NOT NULL)
- `fileType` → `file_type` (VARCHAR(100), NOT NULL)
- `uploadedBy` → `uploaded_by` (BIGINT, NOT NULL, FK)
- `uploadedAt` → `upload_date` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

### **User Entity:**
- `firstName` → `first_name` (VARCHAR(50), NOT NULL)
- `lastName` → `last_name` (VARCHAR(50), NOT NULL)
- `email` → `email` (VARCHAR(255), NOT NULL, UNIQUE)
- `password` → `password` (VARCHAR(255), NOT NULL)
- `role` → `role` (ENUM, NOT NULL)
- `profilePicture` → `profile_picture` (VARCHAR(255))
- `createdAt` → `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
- `updatedAt` → `updated_at` (TIMESTAMP, ON UPDATE CURRENT_TIMESTAMP)
- `lastLogin` → `last_login` (TIMESTAMP)
- `isActive` → `is_active` (BOOLEAN, DEFAULT TRUE)

## **Testing the Fix**

### **1. Health Check:**
```bash
GET http://localhost:9090/api/resources/health
```

### **2. Test Upload:**
- Use the frontend ResourceUpload component
- Check backend logs for success messages
- Verify file appears in `uploads/resources/` directory

### **3. Database Verification:**
```sql
-- Check table structure
DESCRIBE users;
DESCRIBE resources;

-- Check for any data
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM resources;
```

## **Prevention of Future Mismatches**

### **Development Mode:**
- Use `spring.jpa.hibernate.ddl-auto=create-drop` for development
- This ensures tables are recreated from entities each time

### **Production Mode:**
- Use `spring.jpa.hibernate.ddl-auto=validate`
- This validates entities against existing database schema
- Will fail fast if there are mismatches

### **Schema Management:**
- Always update `schema.sql` when changing entities
- Use `@Column` annotations with explicit names
- Test database operations after entity changes

## **Troubleshooting**

### **If uploads still fail:**
1. Check the health endpoint: `/api/resources/health`
2. Verify database connection in logs
3. Check if tables were created correctly
4. Ensure upload directories exist and are writable

### **If database errors persist:**
1. Run the migration script again
2. Check MySQL error logs
3. Verify user permissions on database
4. Ensure MySQL version compatibility (8.0+)

## **Next Steps**

1. **Run the migration script** to fix your database
2. **Restart the application** to apply new configuration
3. **Test file uploads** to verify the fix
4. **Monitor logs** for any remaining issues

Your upload functionality should now work perfectly with no more field mismatches!
