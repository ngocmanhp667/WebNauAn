-- =================================================================
-- DATABASE INITIALIZATION SCRIPT
-- =================================================================
-- Tạo database và bảng users cho hệ thống API
-- Chạy script này trước khi start server
-- =================================================================

-- Tạo database
CREATE DATABASE IF NOT EXISTS baitap2_canhan
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE baitap2_canhan;

-- Tạo bảng users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Thông tin đăng nhập
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    
    -- Thông tin cá nhân
    full_name VARCHAR(100) DEFAULT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    address VARCHAR(255) DEFAULT NULL,
    bio TEXT DEFAULT NULL,
    cuisine_preferences TEXT DEFAULT NULL,
    daily_budget DECIMAL(12,2) DEFAULT NULL,
    
    -- Phân quyền
    role ENUM('user', 'admin') DEFAULT 'user',
    
    -- Xác thực email
    is_verified TINYINT(1) DEFAULT 0,
    
    -- OTP
    otp_code VARCHAR(6) DEFAULT NULL,
    otp_expires_at DATETIME DEFAULT NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tạo tài khoản admin mặc định (password: admin123)
-- BCrypt hash của 'admin123'
INSERT INTO users (username, password_hash, email, full_name, role, is_verified)
VALUES (
    'admin',
    '$2a$10$8KzaN.XYL0E2YkD9qKbPCOxHjQ5EODANKFxPjxFv.4y6OywJwFBWa',
    'admin@example.com',
    'Administrator',
    'admin',
    1
) ON DUPLICATE KEY UPDATE username = username;
