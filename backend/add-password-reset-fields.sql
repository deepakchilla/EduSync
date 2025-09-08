-- Add password reset fields to users table
-- Run this script to add the necessary columns for forgot password functionality

ALTER TABLE users 
ADD COLUMN reset_token VARCHAR(255) NULL,
ADD COLUMN reset_token_expiry DATETIME NULL;

-- Add index for better performance on reset token lookups
CREATE INDEX idx_users_reset_token ON users(reset_token);

-- Add index for cleanup of expired tokens
CREATE INDEX idx_users_reset_token_expiry ON users(reset_token_expiry);
