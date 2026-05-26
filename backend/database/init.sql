-- =================================================================
-- DATABASE INITIALIZATION SCRIPT (CulinShare / MâmNgon)
-- =================================================================

-- Xóa database cũ nếu tồn tại để reset dữ liệu sạch
DROP DATABASE IF EXISTS CulinShare;

-- Tạo database mới
CREATE DATABASE CulinShare
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE CulinShare;

-- =================================================================
-- DROP TABLES (IN CORRECT ORDER FOR FOREIGN KEYS)
-- =================================================================
DROP TABLE IF EXISTS follows;
DROP TABLE IF EXISTS saved_recipes;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS recipe_images;
DROP TABLE IF EXISTS recipe_steps;
DROP TABLE IF EXISTS recipe_ingredients;
DROP TABLE IF EXISTS recipe_categories;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS recipes;
DROP TABLE IF EXISTS users;

-- =================================================================
-- CREATE TABLES
-- =================================================================

-- 1. Table: users
CREATE TABLE users (
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
    role VARCHAR(20) DEFAULT 'user',
    
    -- Xác thực email
    is_verified TINYINT(1) DEFAULT 0,
    
    -- OTP
    otp_code VARCHAR(6) DEFAULT NULL,
    otp_expires_at DATETIME DEFAULT NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_users_username (username),
    INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table: recipes
CREATE TABLE recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    description TEXT DEFAULT NULL,
    cover_image_url VARCHAR(255) DEFAULT NULL,
    video_url VARCHAR(255) DEFAULT NULL,
    prep_time_minutes INT DEFAULT 0,
    cook_time_minutes INT DEFAULT 0,
    servings INT DEFAULT 0,
    calories INT DEFAULT 0,
    difficulty ENUM('dễ', 'trung bình', 'khó') DEFAULT 'dễ',
    status ENUM('draft', 'published') DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_recipes_author_id (author_id),
    INDEX idx_recipes_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table: categories
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT DEFAULT NULL,
    image_url VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_categories_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Table: recipe_categories
CREATE TABLE recipe_categories (
    recipe_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (recipe_id, category_id),
    CONSTRAINT uq_recipe_category UNIQUE (recipe_id, category_id),

    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    INDEX idx_recipe_categories_recipe_id (recipe_id),
    INDEX idx_recipe_categories_category_id (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Table: recipe_ingredients
CREATE TABLE recipe_ingredients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    quantity VARCHAR(50) DEFAULT NULL,
    unit VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    INDEX idx_recipe_ingredients_recipe_id (recipe_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Table: recipe_steps
CREATE TABLE recipe_steps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_id INT NOT NULL,
    step_number INT NOT NULL,
    instruction TEXT NOT NULL,
    image_url VARCHAR(255) DEFAULT NULL,
    timer_seconds INT DEFAULT 0,

    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    INDEX idx_recipe_steps_recipe_id (recipe_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Table: recipe_images
CREATE TABLE recipe_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    INDEX idx_recipe_images_recipe_id (recipe_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Table: reviews
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL,
    comment TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 1 AND 5),
    CONSTRAINT uq_reviews_user_recipe UNIQUE (user_id, recipe_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_reviews_recipe_id (recipe_id),
    INDEX idx_reviews_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Table: comments
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_id INT NOT NULL,
    user_id INT NOT NULL,
    parent_id INT DEFAULT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
    INDEX idx_comments_recipe_id (recipe_id),
    INDEX idx_comments_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Table: saved_recipes
CREATE TABLE saved_recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_saved_recipes_user_recipe UNIQUE (user_id, recipe_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    INDEX idx_saved_recipes_user_id (user_id),
    INDEX idx_saved_recipes_recipe_id (recipe_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Table: follows
CREATE TABLE follows (
    id INT AUTO_INCREMENT PRIMARY KEY,
    follower_id INT NOT NULL,
    following_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_follows_follower_following UNIQUE (follower_id, following_id),
    CONSTRAINT chk_follows_prevent_self_follow CHECK (follower_id <> following_id),
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_follows_follower_id (follower_id),
    INDEX idx_follows_following_id (following_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =================================================================
-- SEED DATA
-- =================================================================

-- 1. Seed users
-- - 1 Admin (password: admin123)
-- - 1 Chef Hoàng Anh (password: admin123)
-- - 3 Normal users (password: admin123)
INSERT INTO users (id, username, password_hash, email, full_name, role, is_verified, bio, avatar_url)
VALUES
(1, 'admin', '$2a$10$0FGPq/9.5sY6AiO3SkFLFuvguPCR1kFyZld/kWxkwzhSv3010KFru', 'admin@culinshare.com', 'Hệ thống Admin', 'admin', 1, 'Tài khoản quản trị viên tối cao của hệ thống.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'),
(2, 'hoanganh', '$2a$10$0FGPq/9.5sY6AiO3SkFLFuvguPCR1kFyZld/kWxkwzhSv3010KFru', 'chef.hoanganh@culinshare.com', 'Chef Hoàng Anh', 'chef', 1, 'Đầu bếp chuyên nghiệp với hơn 10 năm kinh nghiệm trong ẩm thực truyền thống Việt Nam. Đam mê gìn giữ hương vị cội nguồn.', 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c'),
(3, 'nguyenvana', '$2a$10$0FGPq/9.5sY6AiO3SkFLFuvguPCR1kFyZld/kWxkwzhSv3010KFru', 'nguyenvana@gmail.com', 'Nguyễn Văn A', 'user', 1, 'Yêu thích nấu ăn và khám phá ẩm thực vùng miền.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'),
(4, 'tranthib', '$2a$10$0FGPq/9.5sY6AiO3SkFLFuvguPCR1kFyZld/kWxkwzhSv3010KFru', 'tranthib@gmail.com', 'Trần Thị B', 'user', 1, 'Người nội trợ gia đình luôn tìm kiếm công thức lành mạnh cho con cái.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'),
(5, 'levanc', '$2a$10$0FGPq/9.5sY6AiO3SkFLFuvguPCR1kFyZld/kWxkwzhSv3010KFru', 'levanc@gmail.com', 'Lê Văn C', 'user', 1, 'Học sinh sinh viên tập tành nấu ăn, thích các món chay và nhanh gọn.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e');

-- 2. Seed categories
-- - Món Việt
-- - Món chay
-- - Món tráng miệng
-- - Món ăn sáng
INSERT INTO categories (id, name, slug, description, image_url)
VALUES
(1, 'Món Việt', 'mon-viet', 'Những món ăn truyền thống đậm đà bản sắc Việt Nam.', 'https://images.unsplash.com/photo-1596797038530-2c107229654b'),
(2, 'Món chay', 'mon-chay', 'Các món ăn chay thanh tịnh, tốt cho sức khỏe và vóc dáng.', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd'),
(3, 'Món tráng miệng', 'mon-trang-mieng', 'Chè, bánh ngọt, hoa quả dầm và các món giải nhiệt ngọt ngào.', 'https://images.unsplash.com/photo-1587314168485-3236d6710814'),
(4, 'Món ăn sáng', 'mon-an-sang', 'Các món ăn nhiều dưỡng chất khởi đầu ngày mới tràn đầy năng lượng.', 'https://images.unsplash.com/photo-1496042404852-93ec3627a0de');

-- 3. Seed recipes
-- - Bún chả Hà Nội (Tác giả: Chef Hoàng Anh)
INSERT INTO recipes (id, author_id, title, slug, description, cover_image_url, video_url, prep_time_minutes, cook_time_minutes, servings, calories, difficulty, status)
VALUES
(1, 2, 'Bún chả Hà Nội', 'bun-cha-ha-noi', 'Bún chả Hà Nội là một trong những món ăn đặc sản nổi tiếng nhất của thủ đô Việt Nam, được kết hợp hài hòa giữa chả thịt nướng thơm nức mũi trên than hoa, bún tươi sợi nhỏ thanh mát và bát nước chấm chua ngọt đu đủ giòn giòn cùng đĩa rau sống đa dạng hương vị.', 'https://images.unsplash.com/photo-1596797038530-2c107229654b', 'https://www.youtube.com/watch?v=48S43D_h1yM', 30, 20, 4, 550, 'trung bình', 'published');

-- 4. Seed recipe_categories
INSERT INTO recipe_categories (recipe_id, category_id)
VALUES
(1, 1), -- Bún chả thuộc Món Việt
(1, 4); -- Bún chả thuộc Món ăn sáng

-- 5. Seed recipe_ingredients
INSERT INTO recipe_ingredients (recipe_id, name, quantity, unit)
VALUES
(1, 'Thịt ba chỉ thái mỏng (làm chả miếng)', '500', 'g'),
(1, 'Thịt nạc vai xay nhuyễn (làm chả viên)', '500', 'g'),
(1, 'Bún tươi', '1', 'kg'),
(1, 'Đu đủ xanh nhỏ', '1', 'quả'),
(1, 'Cà rốt', '1', 'củ'),
(1, 'Mật ong nguyên chất', '2', 'thìa canh'),
(1, 'Hành khô băm nhuyễn', '3', 'củ'),
(1, 'Tỏi băm nhuyễn', '2', 'củ'),
(1, 'Ớt tươi băm nhuyễn', '2', 'quả'),
(1, 'Rau sống ăn kèm (xà lách, tía tô, kinh giới, giá đỗ)', '1', 'đĩa lớn'),
(1, 'Nước mắm ngon', '150', 'ml'),
(1, 'Dấm gạo hoặc nước cốt chanh', '50', 'ml'),
(1, 'Đường cát', '100', 'g'),
(1, 'Gia vị cơ bản (muối, tiêu, bột nêm, dầu hào)', 'vừa đủ', '');

-- 6. Seed recipe_steps
INSERT INTO recipe_steps (recipe_id, step_number, instruction, image_url, timer_seconds)
VALUES
(1, 1, 'Sơ chế nguyên liệu: Rửa sạch thịt ba chỉ, thái miếng mỏng vừa ăn. Băm nhỏ hành khô, tỏi và ớt. Rau sống nhặt sạch, ngâm nước muối loãng 15 phút rồi vẩy ráo nước.', 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d', 600),
(1, 2, 'Ướp thịt: Chia đôi lượng hành, tỏi băm. Ướp riêng thịt ba chỉ thái miếng và thịt nạc vai xay với: nước mắm, đường, dầu hào, tiêu, hành tỏi băm và mật ong. Trộn đều và ướp trong ngăn mát tủ lạnh ít nhất 30 phút cho ngấm gia vị.', 'https://images.unsplash.com/photo-1543353071-873f17a7a088', 1800),
(1, 3, 'Làm dưa góp: Đu đủ xanh và cà rốt gọt vỏ, thái mỏng hoa hoặc lát vuông nhỏ. Bóp đều với chút muối rồi rửa sạch cho giòn. Trộn nước cốt chanh/dấm, đường, chút tỏi ớt băm để có vị chua ngọt hài hòa.', 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9', 600),
(1, 4, 'Nướng chả: Thịt nạc vai xay viên thành những viên tròn dẹt vừa ăn. Xếp chả miếng và chả viên lên vỉ nướng. Nướng trên bếp than hoa, lật đều tay và quét thêm chút dầu ăn/nước ướp để chả không bị khô. Nướng đến khi chín vàng sậm, thơm phức.', 'https://images.unsplash.com/photo-1525755662778-989d0524087e', 900),
(1, 5, 'Pha nước chấm: Pha nước mắm, nước lọc, đường và dấm theo tỷ lệ 1:5:1:1 (điều chỉnh tùy khẩu vị). Đun ấm nước chấm trên bếp, sau đó múc ra bát, thêm tỏi ớt băm và thả dưa góp vào.', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288', 300),
(1, 6, 'Thưởng thức: Bày bún tươi, rau sống ra đĩa sạch. Gắp chả miếng và chả viên nóng hổi thả trực tiếp vào bát nước chấm ấm nóng, ăn kèm bún tươi và rau sống thanh mát.', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', 0);

-- 7. Seed recipe_images
INSERT INTO recipe_images (recipe_id, image_url)
VALUES
(1, 'https://images.unsplash.com/photo-1596797038530-2c107229654b'),
(1, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836');

-- 8. Seed reviews
-- - User 3 (Nguyễn Văn A) đánh giá 5 sao
-- - User 4 (Trần Thị B) đánh giá 4 sao
INSERT INTO reviews (recipe_id, user_id, rating, comment)
VALUES
(1, 3, 5, 'Món bún chả thơm nức mùi than hoa, nước chấm pha rất vừa miệng, đu đủ giòn ngọt chuẩn vị Hà Nội. Cảm ơn Chef Hoàng Anh nhiều!'),
(1, 4, 4, 'Ướp thịt theo tỉ lệ này rất đậm đà, cả nhà mình đều thích. Mình bớt ớt đi một chút cho con ăn được.');

-- 9. Seed comments
-- - User 5 (Lê Văn C) hỏi
-- - Chef Hoàng Anh (User 2) trả lời (reply)
INSERT INTO comments (id, recipe_id, user_id, parent_id, content)
VALUES
(1, 1, 5, NULL, 'Chef ơi, nếu không có bếp than hoa thì mình nướng bằng nồi chiên không dầu có được không ạ? Set nhiệt độ bao nhiêu là vừa?'),
(2, 1, 2, 1, 'Chào em, nướng nồi chiên không dầu hoàn toàn được nhé. Em set lần 1 khoảng 180 độ C trong 10 phút, sau đó lật mặt quét mỡ hành nướng tiếp lần 2 khoảng 160 độ C trong 5 phút để thịt mềm không bị khô nhé!');

-- 10. Seed saved_recipes
-- - User 3 và User 4 lưu công thức Bún chả
INSERT INTO saved_recipes (user_id, recipe_id)
VALUES
(3, 1),
(4, 1);

-- 11. Seed follows
-- - Các user khác theo dõi Chef Hoàng Anh (User 2)
-- - Chef Hoàng Anh theo dõi lại Nguyễn Văn A (User 3)
INSERT INTO follows (follower_id, following_id)
VALUES
(3, 2), -- Nguyễn Văn A theo dõi Chef Hoàng Anh
(4, 2), -- Trần Thị B theo dõi Chef Hoàng Anh
(5, 2), -- Lê Văn C theo dõi Chef Hoàng Anh
(2, 3); -- Chef Hoàng Anh theo dõi Nguyễn Văn A

-- =================================================================
-- EXTENDED DEMO CATALOGUE
-- 52 recipes total, with dish-specific seeded image searches.
-- LoremFlickr locks each keyword query so demo cards remain stable.
-- =================================================================

-- Use an image query matching the existing Bun cha recipe instead of a generic food photo.
UPDATE recipes
SET cover_image_url = 'https://loremflickr.com/1200/800/bun-cha,vietnamese,grilled-pork?lock=1'
WHERE id = 1;

UPDATE recipe_images
SET image_url = 'https://loremflickr.com/1200/800/bun-cha,vietnamese,grilled-pork?lock=1'
WHERE recipe_id = 1;

-- Additional authors and community members (all demo accounts use password: admin123).
INSERT INTO users (id, username, password_hash, email, full_name, role, is_verified, bio, avatar_url)
VALUES
(6, 'cheflan', '$2a$10$0FGPq/9.5sY6AiO3SkFLFuvguPCR1kFyZld/kWxkwzhSv3010KFru', 'chef.lan@culinshare.com', 'Chef Minh Lan', 'chef', 1, 'Chuyên món Việt gia đình và các món vùng miền.', 'https://loremflickr.com/300/300/chef,woman?lock=6'),
(7, 'chefquang', '$2a$10$0FGPq/9.5sY6AiO3SkFLFuvguPCR1kFyZld/kWxkwzhSv3010KFru', 'chef.quang@culinshare.com', 'Chef Quốc Quang', 'chef', 1, 'Yêu thích hải sản, món nướng và bếp hiện đại.', 'https://loremflickr.com/300/300/chef,man?lock=7'),
(8, 'maihealthy', '$2a$10$0FGPq/9.5sY6AiO3SkFLFuvguPCR1kFyZld/kWxkwzhSv3010KFru', 'maihealthy@gmail.com', 'Ngọc Mai', 'user', 1, 'Ưu tiên món chay, salad và khẩu phần cân bằng.', 'https://loremflickr.com/300/300/woman,portrait?lock=8'),
(9, 'foodiephuong', '$2a$10$0FGPq/9.5sY6AiO3SkFLFuvguPCR1kFyZld/kWxkwzhSv3010KFru', 'foodiephuong@gmail.com', 'Thu Phương', 'user', 1, 'Thích thử món mới và chia sẻ đánh giá thật.', 'https://loremflickr.com/300/300/woman,smile?lock=9'),
(10, 'anvaobep', '$2a$10$0FGPq/9.5sY6AiO3SkFLFuvguPCR1kFyZld/kWxkwzhSv3010KFru', 'anvaobep@gmail.com', 'Gia An', 'user', 1, 'Tập nấu bữa cơm ngon mỗi ngày cho gia đình.', 'https://loremflickr.com/300/300/man,portrait?lock=10');

-- Expanded categories covering regions, meal types, ingredients and international dishes.
INSERT INTO categories (id, name, slug, description, image_url)
VALUES
(5, 'Món miền Bắc', 'mon-mien-bac', 'Hương vị thanh tao, cân bằng của ẩm thực miền Bắc.', 'https://loremflickr.com/900/600/vietnamese,noodles?lock=105'),
(6, 'Món miền Trung', 'mon-mien-trung', 'Các món đậm vị, cay thơm của dải đất miền Trung.', 'https://loremflickr.com/900/600/spicy,noodles?lock=106'),
(7, 'Món miền Nam', 'mon-mien-nam', 'Món miền Nam phong phú với vị ngọt dịu và rau tươi.', 'https://loremflickr.com/900/600/rice,grilled-pork?lock=107'),
(8, 'Hải sản', 'hai-san', 'Công thức từ tôm, cua, cá, mực và hải sản tươi.', 'https://loremflickr.com/900/600/seafood,shrimp?lock=108'),
(9, 'Món thịt', 'mon-thit', 'Các món chế biến từ bò và heo giàu năng lượng.', 'https://loremflickr.com/900/600/meat,stew?lock=109'),
(10, 'Món gia cầm', 'mon-gia-cam', 'Món ngon từ gà và vịt cho bữa ăn gia đình.', 'https://loremflickr.com/900/600/chicken,roasted?lock=110'),
(11, 'Món nước', 'mon-nuoc', 'Phở, bún, mì và các món có nước dùng nóng hổi.', 'https://loremflickr.com/900/600/noodle,soup?lock=111'),
(12, 'Cơm và xôi', 'com-va-xoi', 'Những món no bụng từ cơm và nếp.', 'https://loremflickr.com/900/600/rice,bowl?lock=112'),
(13, 'Bánh và món cuốn', 'banh-va-mon-cuon', 'Bánh truyền thống và các món cuốn ăn kèm rau.', 'https://loremflickr.com/900/600/spring-rolls?lock=113'),
(14, 'Món lành mạnh', 'mon-lanh-manh', 'Món ăn nhẹ nhàng, nhiều rau củ và ít dầu.', 'https://loremflickr.com/900/600/salad,vegetables?lock=114'),
(15, 'Món quốc tế', 'mon-quoc-te', 'Công thức được yêu thích từ nhiều nền ẩm thực.', 'https://loremflickr.com/900/600/pasta,pizza?lock=115'),
(16, 'Đồ uống', 'do-uong', 'Thức uống giải khát và cà phê Việt.', 'https://loremflickr.com/900/600/iced,drink?lock=116');

-- Additional recipes: the keyword-based cover URLs are tailored to each recipe.
INSERT INTO recipes (id, author_id, title, slug, description, cover_image_url, prep_time_minutes, cook_time_minutes, servings, calories, difficulty, status)
VALUES
(2, 2, 'Phở bò Hà Nội', 'pho-bo-ha-noi', 'Nước dùng trong ngọt xương, bánh phở mềm và thịt bò thái mỏng.', 'https://loremflickr.com/1200/800/pho,beef,noodle-soup?lock=2', 35, 180, 4, 480, 'khó', 'published'),
(3, 6, 'Phở gà', 'pho-ga', 'Tô phở thơm mùi gừng nướng với thịt gà mềm ngọt.', 'https://loremflickr.com/1200/800/chicken,pho,noodle-soup?lock=3', 25, 90, 4, 420, 'trung bình', 'published'),
(4, 6, 'Bún bò Huế', 'bun-bo-hue', 'Bún bò đậm vị sả ớt, giò heo và thịt bắp bò.', 'https://loremflickr.com/1200/800/spicy,beef,noodle-soup?lock=4', 40, 150, 5, 560, 'khó', 'published'),
(5, 2, 'Mì Quảng gà', 'mi-quang-ga', 'Mì vàng, gà rim và nước nhân sánh thơm nghệ.', 'https://loremflickr.com/1200/800/chicken,noodles,turmeric?lock=5', 30, 45, 4, 510, 'trung bình', 'published'),
(6, 2, 'Cao lầu Hội An', 'cao-lau-hoi-an', 'Sợi cao lầu dai, thịt xá xíu và rau sống giòn mát.', 'https://loremflickr.com/1200/800/pork,noodles,greens?lock=6', 35, 50, 4, 500, 'khó', 'published'),
(7, 7, 'Hủ tiếu Nam Vang', 'hu-tieu-nam-vang', 'Hủ tiếu với tôm, thịt bằm và nước dùng thanh ngọt.', 'https://loremflickr.com/1200/800/shrimp,pork,noodle-soup?lock=7', 30, 75, 4, 490, 'trung bình', 'published'),
(8, 6, 'Cơm tấm sườn bì chả', 'com-tam-suon-bi-cha', 'Cơm tấm ăn cùng sườn nướng, bì, chả trứng và mỡ hành.', 'https://loremflickr.com/1200/800/grilled-pork,rice,egg?lock=8', 35, 30, 4, 690, 'trung bình', 'published'),
(9, 6, 'Cơm gà Hội An', 'com-ga-hoi-an', 'Cơm vàng thơm nghệ với gà xé, rau răm và hành tây.', 'https://loremflickr.com/1200/800/chicken,rice,salad?lock=9', 25, 45, 4, 540, 'trung bình', 'published'),
(10, 7, 'Cơm chiên hải sản', 'com-chien-hai-san', 'Cơm chiên tơi hạt với tôm mực và rau củ nhiều màu.', 'https://loremflickr.com/1200/800/seafood,fried-rice,shrimp?lock=10', 15, 15, 3, 520, 'dễ', 'published'),
(11, 6, 'Bánh xèo miền Tây', 'banh-xeo-mien-tay', 'Bánh xèo vàng giòn nhân tôm thịt giá, cuốn rau xanh.', 'https://loremflickr.com/1200/800/crispy,pancake,shrimp?lock=11', 30, 25, 4, 450, 'trung bình', 'published'),
(12, 2, 'Bánh cuốn nóng', 'banh-cuon-nong', 'Lớp bánh mỏng mềm cuộn thịt mộc nhĩ, ăn với chả lụa.', 'https://loremflickr.com/1200/800/rice-roll,pork,vietnamese?lock=12', 35, 25, 4, 380, 'khó', 'published'),
(13, 7, 'Bánh mì thịt nướng', 'banh-mi-thit-nuong', 'Bánh mì giòn kẹp thịt nướng, đồ chua và rau thơm.', 'https://loremflickr.com/1200/800/banh-mi,grilled-pork,sandwich?lock=13', 25, 15, 4, 470, 'dễ', 'published'),
(14, 6, 'Gỏi cuốn tôm thịt', 'goi-cuon-tom-thit', 'Cuốn bánh tráng trong mát với tôm, thịt, bún và rau.', 'https://loremflickr.com/1200/800/spring-rolls,shrimp,vietnamese?lock=14', 25, 10, 4, 250, 'dễ', 'published'),
(15, 7, 'Chả giò giòn rụm', 'cha-gio-gion-rum', 'Chả giò chiên vàng nhân thịt củ sắn và mộc nhĩ.', 'https://loremflickr.com/1200/800/fried,spring-rolls?lock=15', 30, 15, 4, 390, 'trung bình', 'published'),
(16, 2, 'Cá kho tộ', 'ca-kho-to', 'Cá kho nước màu sóng sánh, tiêu cay và vị mặn ngọt hài hòa.', 'https://loremflickr.com/1200/800/braised,fish,claypot?lock=16', 20, 40, 4, 360, 'trung bình', 'published'),
(17, 6, 'Thịt kho trứng', 'thit-kho-trung', 'Thịt ba chỉ mềm béo kho cùng trứng và nước dừa.', 'https://loremflickr.com/1200/800/braised,pork,egg?lock=17', 20, 75, 5, 580, 'trung bình', 'published'),
(18, 7, 'Canh chua cá lóc', 'canh-chua-ca-loc', 'Canh chua dịu với cá lóc, thơm, bạc hà và giá.', 'https://loremflickr.com/1200/800/fish,soup,pineapple?lock=18', 20, 25, 4, 240, 'dễ', 'published'),
(19, 7, 'Bò lúc lắc', 'bo-luc-lac', 'Thịt bò áp chảo mềm mọng cùng ớt chuông và hành tây.', 'https://loremflickr.com/1200/800/beef,stir-fry,pepper?lock=19', 20, 12, 3, 430, 'trung bình', 'published'),
(20, 6, 'Gà kho gừng', 'ga-kho-gung', 'Gà kho thấm vị, thơm ấm gừng thái sợi.', 'https://loremflickr.com/1200/800/braised,chicken,ginger?lock=20', 15, 30, 4, 370, 'dễ', 'published'),
(21, 7, 'Gà nướng mật ong', 'ga-nuong-mat-ong', 'Gà nướng da vàng óng, ngọt thơm mật ong và tỏi.', 'https://loremflickr.com/1200/800/roasted,chicken,honey?lock=21', 25, 45, 4, 510, 'trung bình', 'published'),
(22, 7, 'Vịt quay ngũ vị', 'vit-quay-ngu-vi', 'Vịt quay giòn da với hương ngũ vị đậm đà.', 'https://loremflickr.com/1200/800/roast,duck?lock=22', 40, 80, 5, 620, 'khó', 'published'),
(23, 7, 'Tôm rang me', 'tom-rang-me', 'Tôm săn chắc phủ sốt me chua ngọt óng mượt.', 'https://loremflickr.com/1200/800/shrimp,tamarind,sauce?lock=23', 15, 15, 3, 320, 'dễ', 'published'),
(24, 7, 'Mực xào sa tế', 'muc-xao-sa-te', 'Mực giòn xào sa tế cay thơm cùng hành cần.', 'https://loremflickr.com/1200/800/squid,stir-fry,spicy?lock=24', 15, 10, 3, 280, 'dễ', 'published'),
(25, 7, 'Lẩu hải sản', 'lau-hai-san', 'Nồi lẩu chua cay đầy tôm, mực, nghêu và rau nấm.', 'https://loremflickr.com/1200/800/seafood,hotpot?lock=25', 35, 35, 6, 460, 'trung bình', 'published'),
(26, 7, 'Lẩu Thái chua cay', 'lau-thai-chua-cay', 'Lẩu tom yum đỏ cam, thơm sả riềng và lá chanh.', 'https://loremflickr.com/1200/800/tom-yum,hotpot,shrimp?lock=26', 30, 30, 5, 430, 'trung bình', 'published'),
(27, 2, 'Bún riêu cua', 'bun-rieu-cua', 'Nước dùng cà chua thanh chua với riêu cua mềm xốp.', 'https://loremflickr.com/1200/800/crab,tomato,noodle-soup?lock=27', 35, 60, 4, 460, 'khó', 'published'),
(28, 6, 'Bún mắm miền Tây', 'bun-mam-mien-tay', 'Tô bún mắm đậm đà với cá, tôm, mực và rau đồng.', 'https://loremflickr.com/1200/800/seafood,noodle-soup,vietnamese?lock=28', 45, 75, 5, 550, 'khó', 'published'),
(29, 7, 'Bánh canh cua', 'banh-canh-cua', 'Sợi bánh canh dai trong nước dùng cua sánh đỏ hấp dẫn.', 'https://loremflickr.com/1200/800/crab,noodle-soup?lock=29', 35, 50, 4, 490, 'trung bình', 'published'),
(30, 6, 'Xôi gà xé', 'xoi-ga-xe', 'Xôi dẻo nóng ăn cùng gà xé, hành phi và ruốc.', 'https://loremflickr.com/1200/800/sticky-rice,chicken?lock=30', 25, 40, 4, 480, 'trung bình', 'published'),
(31, 2, 'Cháo sườn', 'chao-suon', 'Cháo mịn thơm với sườn non mềm và quẩy giòn.', 'https://loremflickr.com/1200/800/rice,porridge,pork?lock=31', 20, 70, 4, 330, 'trung bình', 'published'),
(32, 8, 'Trứng cuộn rau củ', 'trung-cuon-rau-cu', 'Trứng cuộn mềm với cà rốt, hành lá và bắp ngọt.', 'https://loremflickr.com/1200/800/omelette,vegetables?lock=32', 10, 10, 2, 210, 'dễ', 'published'),
(33, 8, 'Đậu hũ sốt cà chua', 'dau-hu-sot-ca-chua', 'Đậu hũ chiên mềm thấm sốt cà chua chua ngọt.', 'https://loremflickr.com/1200/800/tofu,tomato,sauce?lock=33', 10, 15, 3, 230, 'dễ', 'published'),
(34, 8, 'Nấm kho tiêu xanh', 'nam-kho-tieu-xanh', 'Nấm kho đậm vị tiêu xanh, phù hợp mâm cơm chay.', 'https://loremflickr.com/1200/800/mushroom,stew,vegetarian?lock=34', 10, 20, 3, 180, 'dễ', 'published'),
(35, 8, 'Cơm chiên rau củ chay', 'com-chien-rau-cu-chay', 'Cơm chiên nhiều màu với đậu Hà Lan, bắp và cà rốt.', 'https://loremflickr.com/1200/800/vegetable,fried-rice?lock=35', 10, 12, 3, 350, 'dễ', 'published'),
(36, 8, 'Bún chay Huế', 'bun-chay-hue', 'Nước dùng rau củ thơm sả, ăn cùng đậu hũ và nấm.', 'https://loremflickr.com/1200/800/vegetarian,noodle-soup,tofu?lock=36', 25, 40, 4, 300, 'trung bình', 'published'),
(37, 8, 'Gỏi ngó sen chay', 'goi-ngo-sen-chay', 'Ngó sen giòn trộn rau củ, đậu hũ và nước mắm chay.', 'https://loremflickr.com/1200/800/lotus,salad,vegetarian?lock=37', 20, 5, 3, 170, 'dễ', 'published'),
(38, 8, 'Salad ức gà bơ', 'salad-uc-ga-bo', 'Salad rau xanh, ức gà áp chảo và bơ béo lành mạnh.', 'https://loremflickr.com/1200/800/chicken,avocado,salad?lock=38', 15, 12, 2, 320, 'dễ', 'published'),
(39, 7, 'Pizza hải sản', 'pizza-hai-san', 'Pizza đế giòn phủ phô mai, tôm mực và ớt chuông.', 'https://loremflickr.com/1200/800/seafood,pizza?lock=39', 45, 18, 4, 680, 'khó', 'published'),
(40, 6, 'Spaghetti bò bằm', 'spaghetti-bo-bam', 'Mì Ý sốt cà chua bò bằm thơm lá oregano.', 'https://loremflickr.com/1200/800/spaghetti,bolognese?lock=40', 15, 30, 3, 560, 'trung bình', 'published'),
(41, 6, 'Cà ri gà khoai tây', 'ca-ri-ga-khoai-tay', 'Cà ri vàng béo dịu với gà mềm và khoai tây bở.', 'https://loremflickr.com/1200/800/chicken,curry,potato?lock=41', 20, 40, 4, 510, 'trung bình', 'published'),
(42, 7, 'Sushi cuộn cá hồi', 'sushi-cuon-ca-hoi', 'Cuộn sushi cá hồi tươi, bơ và cơm giấm vừa vị.', 'https://loremflickr.com/1200/800/salmon,sushi,roll?lock=42', 30, 15, 3, 390, 'khó', 'published'),
(43, 7, 'Tokbokki phô mai', 'tokbokki-pho-mai', 'Bánh gạo Hàn Quốc cay ngọt phủ phô mai tan chảy.', 'https://loremflickr.com/1200/800/tteokbokki,korean,cheese?lock=43', 10, 18, 3, 420, 'dễ', 'published'),
(44, 6, 'Bánh flan caramel', 'banh-flan-caramel', 'Flan mềm mịn với lớp caramel màu hổ phách.', 'https://loremflickr.com/1200/800/caramel,flan,dessert?lock=44', 15, 35, 6, 210, 'trung bình', 'published'),
(45, 6, 'Chè ba màu', 'che-ba-mau', 'Ly chè nhiều lớp đậu, thạch và nước cốt dừa mát lạnh.', 'https://loremflickr.com/1200/800/colorful,dessert,coconut?lock=45', 25, 35, 5, 300, 'trung bình', 'published'),
(46, 6, 'Chè khúc bạch', 'che-khuc-bach', 'Khúc bạch mềm béo trong nước đường nhãn thanh mát.', 'https://loremflickr.com/1200/800/almond,jelly,dessert?lock=46', 20, 15, 5, 260, 'trung bình', 'published'),
(47, 8, 'Bánh chuối nướng', 'banh-chuoi-nuong', 'Bánh chuối thơm bơ, mặt vàng nâu mềm ẩm.', 'https://loremflickr.com/1200/800/banana,cake,baked?lock=47', 15, 45, 6, 280, 'dễ', 'published'),
(48, 8, 'Xôi xoài Thái', 'xoi-xoai-thai', 'Xôi nếp cốt dừa dẻo béo ăn với xoài chín.', 'https://loremflickr.com/1200/800/mango,sticky-rice?lock=48', 20, 30, 4, 340, 'dễ', 'published'),
(49, 8, 'Sữa chua nếp cẩm', 'sua-chua-nep-cam', 'Sữa chua mịn kết hợp nếp cẩm dẻo bùi.', 'https://loremflickr.com/1200/800/yogurt,purple-rice,dessert?lock=49', 15, 35, 4, 220, 'dễ', 'published'),
(50, 8, 'Trà đào cam sả', 'tra-dao-cam-sa', 'Trà đào mát lạnh thơm cam vàng và sả tươi.', 'https://loremflickr.com/1200/800/peach,orange,iced-tea?lock=50', 10, 10, 2, 120, 'dễ', 'published'),
(51, 8, 'Sinh tố bơ', 'sinh-to-bo', 'Sinh tố bơ sánh mịn, béo thơm và dễ làm.', 'https://loremflickr.com/1200/800/avocado,smoothie?lock=51', 5, 0, 2, 230, 'dễ', 'published'),
(52, 6, 'Cà phê sữa đá', 'ca-phe-sua-da', 'Cà phê phin đậm đà hòa sữa đặc và đá lạnh.', 'https://loremflickr.com/1200/800/vietnamese,iced,coffee?lock=52', 8, 5, 1, 150, 'dễ', 'published');

-- Category mapping, allowing search/filter by both region and dish type.
INSERT INTO recipe_categories (recipe_id, category_id)
VALUES
(2,1),(2,4),(2,5),(2,11),(3,1),(3,4),(3,5),(3,11),
(4,1),(4,6),(4,11),(5,1),(5,6),(5,11),(6,1),(6,6),(6,11),
(7,1),(7,7),(7,11),(8,1),(8,7),(8,9),(8,12),(9,1),(9,6),(9,10),(9,12),
(10,1),(10,7),(10,8),(10,12),(11,1),(11,7),(11,13),(12,1),(12,5),(12,13),
(13,1),(13,7),(13,13),(14,1),(14,7),(14,13),(14,14),(15,1),(15,7),(15,13),
(16,1),(16,7),(16,8),(17,1),(17,7),(17,9),(18,1),(18,7),(18,8),(19,1),(19,9),
(20,1),(20,10),(21,1),(21,10),(22,1),(22,10),(23,1),(23,8),(24,1),(24,8),
(25,8),(25,11),(26,8),(26,11),(26,15),(27,1),(27,5),(27,11),(28,1),(28,7),(28,8),(28,11),
(29,1),(29,7),(29,8),(29,11),(30,1),(30,4),(30,10),(30,12),(31,1),(31,4),(31,5),(31,11),
(32,4),(32,14),(33,2),(33,14),(34,2),(34,14),(35,2),(35,12),(35,14),(36,1),(36,2),(36,6),(36,11),
(37,2),(37,14),(38,14),(39,8),(39,15),(40,9),(40,15),(41,10),(41,15),(42,8),(42,15),(43,15),
(44,3),(45,3),(46,3),(47,3),(48,3),(48,15),(49,3),(50,16),(51,16),(51,14),(52,16),(52,1);

-- One gallery image is available for every added recipe and uses its matching cover image.
INSERT INTO recipe_images (recipe_id, image_url)
SELECT id, cover_image_url
FROM recipes
WHERE id BETWEEN 2 AND 52;

-- Recipe-specific principal ingredients plus standard preparation essentials.
INSERT INTO recipe_ingredients (recipe_id, name, quantity, unit)
SELECT id,
    CASE id
        WHEN 2 THEN 'Bánh phở và thịt bò tái' WHEN 3 THEN 'Bánh phở và thịt gà ta'
        WHEN 4 THEN 'Bún sợi lớn, bắp bò và giò heo' WHEN 5 THEN 'Mì Quảng và thịt gà'
        WHEN 6 THEN 'Sợi cao lầu và thịt xá xíu' WHEN 7 THEN 'Hủ tiếu, tôm và thịt bằm'
        WHEN 8 THEN 'Cơm tấm, sườn heo và chả trứng' WHEN 9 THEN 'Gạo thơm và thịt gà'
        WHEN 10 THEN 'Cơm nguội, tôm và mực' WHEN 11 THEN 'Bột bánh xèo, tôm và thịt'
        WHEN 12 THEN 'Bột gạo, thịt bằm và mộc nhĩ' WHEN 13 THEN 'Bánh mì và thịt heo nướng'
        WHEN 14 THEN 'Bánh tráng, tôm và thịt luộc' WHEN 15 THEN 'Bánh tráng ram và thịt bằm'
        WHEN 16 THEN 'Cá thu cắt khoanh' WHEN 17 THEN 'Thịt ba chỉ và trứng vịt'
        WHEN 18 THEN 'Cá lóc và thơm' WHEN 19 THEN 'Thăn bò và ớt chuông'
        WHEN 20 THEN 'Thịt gà và gừng' WHEN 21 THEN 'Gà nguyên con và mật ong'
        WHEN 22 THEN 'Vịt nguyên con và ngũ vị hương' WHEN 23 THEN 'Tôm sú và me chín'
        WHEN 24 THEN 'Mực tươi và sa tế' WHEN 25 THEN 'Tôm, mực, nghêu'
        WHEN 26 THEN 'Tôm, nấm và sốt tom yum' WHEN 27 THEN 'Bún và cua đồng'
        WHEN 28 THEN 'Bún, cá, tôm và mắm cá' WHEN 29 THEN 'Bánh canh và thịt cua'
        WHEN 30 THEN 'Gạo nếp và thịt gà xé' WHEN 31 THEN 'Gạo tẻ và sườn non'
        WHEN 32 THEN 'Trứng gà và rau củ' WHEN 33 THEN 'Đậu hũ và cà chua'
        WHEN 34 THEN 'Nấm đùi gà và tiêu xanh' WHEN 35 THEN 'Cơm và rau củ hỗn hợp'
        WHEN 36 THEN 'Bún, đậu hũ và nấm' WHEN 37 THEN 'Ngó sen và đậu hũ'
        WHEN 38 THEN 'Ức gà, bơ và xà lách' WHEN 39 THEN 'Đế pizza, tôm và mực'
        WHEN 40 THEN 'Mì spaghetti và bò bằm' WHEN 41 THEN 'Gà, khoai tây và bột cà ri'
        WHEN 42 THEN 'Cơm sushi và cá hồi' WHEN 43 THEN 'Bánh gạo và phô mai'
        WHEN 44 THEN 'Trứng, sữa và đường caramel' WHEN 45 THEN 'Đậu đỏ, đậu xanh và thạch'
        WHEN 46 THEN 'Kem sữa, gelatin và nhãn' WHEN 47 THEN 'Chuối chín và bánh mì'
        WHEN 48 THEN 'Gạo nếp và xoài chín' WHEN 49 THEN 'Sữa chua và nếp cẩm'
        WHEN 50 THEN 'Trà, đào, cam và sả' WHEN 51 THEN 'Bơ chín và sữa'
        WHEN 52 THEN 'Cà phê rang xay và sữa đặc'
    END, '1', 'phần'
FROM recipes WHERE id BETWEEN 2 AND 52
UNION ALL
SELECT id, 'Gia vị nêm nếm phù hợp món ăn', '1', 'bộ'
FROM recipes WHERE id BETWEEN 2 AND 52
UNION ALL
SELECT id,
    CASE
        WHEN id BETWEEN 44 AND 52 THEN 'Đá lạnh hoặc topping trang trí'
        WHEN id IN (25,26) THEN 'Rau và nấm ăn lẩu'
        ELSE 'Rau thơm hoặc rau củ ăn kèm'
    END, '1', 'phần'
FROM recipes WHERE id BETWEEN 2 AND 52;

-- Every recipe detail page receives a usable three-step preparation flow.
INSERT INTO recipe_steps (recipe_id, step_number, instruction, image_url, timer_seconds)
SELECT id, 1, CONCAT('Chuẩn bị đầy đủ nguyên liệu cho món ', title, ', rửa sạch và sơ chế theo khẩu phần.'), cover_image_url, prep_time_minutes * 60
FROM recipes WHERE id BETWEEN 2 AND 52
UNION ALL
SELECT id, 2, CONCAT('Chế biến ', title, ' đúng thời gian, điều chỉnh gia vị vừa ăn và giữ hương vị đặc trưng của món.'), cover_image_url, cook_time_minutes * 60
FROM recipes WHERE id BETWEEN 2 AND 52
UNION ALL
SELECT id, 3, CONCAT('Trình bày món ', title, ' ra đĩa hoặc tô, dùng nóng hay dùng lạnh theo đặc trưng công thức.'), cover_image_url, 0
FROM recipes WHERE id BETWEEN 2 AND 52;

-- Ratings across the catalogue: at least one rating per added recipe, with a second rating on popular dishes.
INSERT INTO reviews (recipe_id, user_id, rating, comment)
SELECT id, 3 + MOD(id, 8), 4 + MOD(id, 2), CONCAT('Mình đã nấu thử ', title, ', hướng dẫn dễ theo và hương vị rất ổn.')
FROM recipes WHERE id BETWEEN 2 AND 52;

INSERT INTO reviews (recipe_id, user_id, rating, comment)
SELECT id, 3 + MOD(id + 3, 8), 5, CONCAT(title, ' lên món đẹp, gia đình mình rất thích.')
FROM recipes
WHERE id BETWEEN 2 AND 52 AND MOD(id, 2) = 0;

-- Public comments for discussion samples on every added recipe.
INSERT INTO comments (recipe_id, user_id, parent_id, content)
SELECT id, 8 + MOD(id, 3), NULL, CONCAT('Món ', title, ' nhìn hấp dẫn quá, mình sẽ thử làm cuối tuần này.')
FROM recipes WHERE id BETWEEN 2 AND 52;

INSERT INTO comments (recipe_id, user_id, parent_id, content)
SELECT id, author_id, NULL, CONCAT('Cảm ơn bạn đã quan tâm món ', title, '. Hãy nêm nếm lại theo khẩu vị gia đình nhé!')
FROM recipes WHERE id BETWEEN 2 AND 52 AND MOD(id, 3) = 0;

-- Favorites / saved recipes provide realistic personal collections.
INSERT INTO saved_recipes (user_id, recipe_id)
SELECT 3 + MOD(id, 8), id FROM recipes WHERE id BETWEEN 2 AND 52;

INSERT INTO saved_recipes (user_id, recipe_id)
SELECT 3 + MOD(id + 2, 8), id FROM recipes WHERE id BETWEEN 2 AND 52 AND MOD(id, 2) = 1;

-- Additional community follow graph.
INSERT INTO follows (follower_id, following_id)
VALUES
(6, 2), (7, 2), (8, 2), (9, 2), (10, 2),
(3, 6), (4, 6), (5, 7), (8, 6), (9, 7), (10, 6);
