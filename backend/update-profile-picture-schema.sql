-- Database Migration: Update Profile Picture Schema
-- Run this script to update existing databases to match the new User entity

-- Add profile_picture_type column if it doesn't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS profile_picture_type VARCHAR(100) AFTER profile_picture;

-- Update existing profile_picture column to LONGBLOB if it's currently VARCHAR
-- First, backup existing profile picture data (if any)
-- Then modify the column type
ALTER TABLE users 
MODIFY COLUMN profile_picture LONGBLOB;

-- Verify the schema update
DESCRIBE users;
