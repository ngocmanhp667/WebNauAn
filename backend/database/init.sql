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
    avatar_url VARCHAR(255) DEFAULT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    address VARCHAR(255) DEFAULT NULL,
    bio TEXT DEFAULT NULL,
    facebook_url VARCHAR(255) DEFAULT NULL,
    instagram_username VARCHAR(100) DEFAULT NULL,
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

-- Nếu database đã tồn tại từ phiên bản cũ, nâng schema lên đúng profile
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(255) DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS facebook_url VARCHAR(255) DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS instagram_username VARCHAR(100) DEFAULT NULL;

-- Tạo bảng products (mon an)
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT DEFAULT NULL,
    category VARCHAR(60) NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    rating DECIMAL(3,1) DEFAULT 0,
    stock INT DEFAULT 0,
    sold INT DEFAULT 0,
    is_promo TINYINT(1) DEFAULT 0,
    is_new TINYINT(1) DEFAULT 0,
    is_best_seller TINYINT(1) DEFAULT 0,
    images TEXT DEFAULT NULL,
    tags TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_products_name (name),
    INDEX idx_products_category (category),
    INDEX idx_products_price (price),
    INDEX idx_products_rating (rating)
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

-- Seed data cho products
INSERT INTO products (name, description, category, price, rating, stock, sold, is_promo, is_new, is_best_seller, images, tags)
VALUES
    (
        'Com ga nuong mat ong',
        'Ga nuong mat ong thom mem, an kem com nong.',
        'Mon chinh',
        65000,
        4.6,
        25,
        180,
        1,
        0,
        1,
        '["https://images.unsplash.com/photo-1604908176997-125f25cc6f3d","https://images.unsplash.com/photo-1525755662778-989d0524087e"]',
        '["ga","nuong","mon chinh"]'
    ),
    (
        'Bun bo Hue',
        'Nuoc dung dam da, thit bo mem, sa ot cay nhe.',
        'Mon chinh',
        55000,
        4.4,
        40,
        140,
        0,
        1,
        0,
        '["https://images.unsplash.com/photo-1604908554025-e4775d24af9e","https://images.unsplash.com/photo-1543353071-873f17a7a088"]',
        '["bun","bo","cay nhe"]'
    ),
    (
        'Lau nam hai san',
        'Nuoc lau thanh ngot, nhieu nam tuoi va hai san.',
        'Lau',
        189000,
        4.7,
        10,
        75,
        1,
        0,
        1,
        '["https://images.unsplash.com/photo-1504674900247-0877df9cc836","https://images.unsplash.com/photo-1467003909585-2f8a72700288"]',
        '["lau","hai san","nam"]'
    ),
    (
        'Goi cuon tom thit',
        'Goi cuon thanh mat, cham nuoc mam chua ngot.',
        'Khai vi',
        35000,
        4.2,
        60,
        210,
        0,
        1,
        0,
        '["https://images.unsplash.com/photo-1550304943-4f24f54ddde9","https://images.unsplash.com/photo-1504674900247-0877df9cc836"]',
        '["goi cuon","tom","khai vi"]'
    ),
    (
        'Che dua nong',
        'Che dua beo, thom, an nong am bung.',
        'Trang mieng',
        25000,
        4.0,
        35,
        95,
        0,
        0,
        0,
        '["https://images.unsplash.com/photo-1505253216365-0fbc1f4c2e7b","https://images.unsplash.com/photo-1481391032119-d89fee407e44"]',
        '["che","dua","ngot"]'
    ),
    (
        'Tra dao cam sa',
        'Tra thanh mat, vi chua ngot de uong.',
        'Do uong',
        28000,
        4.3,
        80,
        260,
        1,
        1,
        1,
        '["https://images.unsplash.com/photo-1461023058943-07fcbe16d735","https://images.unsplash.com/photo-1497534446932-c925b458314e"]',
        '["tra","dao","do uong"]'
    ),
    (
        'Com tam suon nuong',
        'Suon nuong thom, bi cha day du, nuoc mam vua mieng.',
        'Mon chinh',
        60000,
        4.5,
        20,
        165,
        0,
        0,
        1,
        '["https://images.unsplash.com/photo-1504674900247-0877df9cc836","https://images.unsplash.com/photo-1525755662778-989d0524087e"]',
        '["com tam","suon","mon chinh"]'
    ),
    (
        'Banh flan caramen',
        'Banh flan mem min, vi caramen ngot diu.',
        'Trang mieng',
        22000,
        4.1,
        50,
        120,
        0,
        1,
        0,
        '["https://images.unsplash.com/photo-1505253216365-0fbc1f4c2e7b","https://images.unsplash.com/photo-1481391032119-d89fee407e44"]',
        '["flan","caramen","trang mieng"]'
    );
