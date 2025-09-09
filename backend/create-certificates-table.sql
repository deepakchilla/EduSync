-- Create certificates table for user-specific certificate storage
CREATE TABLE IF NOT EXISTS certificates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50),
    file_path VARCHAR(500) NOT NULL,
    upload_date DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_upload_date (upload_date)
);

-- Create uploads/certificates directory if it doesn't exist
-- This is handled by the application code, but documented here for reference
