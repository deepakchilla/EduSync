-- Database update script for EduSync profile picture changes
-- Run this after stopping your Spring Boot application

USE edusyncupdated;

-- Add new column for profile picture type
ALTER TABLE users ADD COLUMN profile_picture_type VARCHAR(100) DEFAULT NULL;

-- Rename old profile_picture column to backup
ALTER TABLE users CHANGE COLUMN profile_picture profile_picture_old VARCHAR(255);

-- Add new LONGBLOB column for profile picture
ALTER TABLE users ADD COLUMN profile_picture LONGBLOB DEFAULT NULL;

-- Note: You'll need to re-upload profile pictures after this change
-- The old profile_picture_old column can be dropped after confirming everything works

-- Optional: Drop the old column after testing (uncomment when ready)
-- ALTER TABLE users DROP COLUMN profile_picture_old;
