-- Create Database
CREATE DATABASE IF NOT EXISTS document_management_db;
USE document_management_db;

-- Documents Table
CREATE TABLE IF NOT EXISTS documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    upload_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    file_path VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_upload_date (upload_date)
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_is_read (is_read),
    INDEX idx_timestamp (timestamp)
);

-- Sample data for testing (optional)
-- INSERT INTO documents (file_name, file_size, file_type, status, file_path) VALUES
-- ('sample.pdf', 1024000, 'application/pdf', 'ACTIVE', 'uploads/sample.pdf');

-- INSERT INTO notifications (message, type, is_read) VALUES
-- ('Welcome to Document Management Dashboard!', 'info', FALSE);
