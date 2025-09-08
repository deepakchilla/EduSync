-- Fix the resources table by removing the file_data field and fixing field name mismatches
-- This field is not needed since files are stored on the filesystem

-- Option 1: Drop the file_data column (recommended)
ALTER TABLE resources DROP COLUMN file_data;

-- Option 2: If you want to keep the column but make it nullable with default value
-- ALTER TABLE resources MODIFY COLUMN file_data LONGBLOB NULL;

-- Fix the upload_date field to have a default value
ALTER TABLE resources MODIFY COLUMN upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Alternative: Rename upload_date to uploaded_at to match the entity
-- ALTER TABLE resources CHANGE upload_date uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Verify the table structure
DESCRIBE resources;
