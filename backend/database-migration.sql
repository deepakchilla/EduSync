-- Database Migration Script for EduSync
-- No changes needed - keeping existing schema

USE edusyncupdated;

-- Verify the current schema
DESCRIBE resources;

-- Show sample data
SELECT id, title, description, file_name, file_size, file_type, uploaded_by, upload_date FROM resources LIMIT 5;
