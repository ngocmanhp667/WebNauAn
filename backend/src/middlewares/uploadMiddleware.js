/**
 * =================================================================
 * UPLOAD MIDDLEWARE
 * =================================================================
 * Cấu hình multer để xử lý tải file lên hệ thống.
 * Hỗ trợ lưu trữ cục bộ, giới hạn dung lượng và kiểm tra định dạng.
 * =================================================================
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Đảm bảo thư mục upload tồn tại
const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình lưu trữ
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Kiểm tra loại file (chỉ cho phép ảnh)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận file hình ảnh (jpeg, jpg, png, gif, webp)!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
    fileFilter: fileFilter
});

module.exports = upload;
