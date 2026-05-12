/**
 * =================================================================
 * INPUT VALIDATION MIDDLEWARE
 * =================================================================
 * Sử dụng express-validator để validate dữ liệu đầu vào.
 * Đảm bảo các field không rỗng và đúng định dạng trước khi
 * chuyển tới Controller.
 * 
 * Lớp bảo mật thứ 2: INPUT VALIDATION
 * =================================================================
 */

const { body, validationResult } = require('express-validator');

/**
 * Middleware xử lý kết quả validation
 * Nếu có lỗi validation, trả về 400 Bad Request với chi tiết lỗi.
 * Nếu không có lỗi, chuyển tiếp tới handler tiếp theo.
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Lấy danh sách lỗi, format lại cho dễ đọc
        const extractedErrors = errors.array().map(err => ({
            field: err.path,
            message: err.msg
        }));

        return res.status(400).json({
            success: false,
            message: 'Dữ liệu đầu vào không hợp lệ',
            errors: extractedErrors
        });
    }

    next();
};

/**
 * Validation rules cho API Login
 * - username: không rỗng
 * - password: không rỗng
 */
const validateLogin = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username không được để trống'),

    body('password')
        .notEmpty()
        .withMessage('Password không được để trống'),

    // Middleware xử lý kết quả validation
    handleValidationErrors
];

/**
 * Validation rules cho API Register
 * - username: không rỗng, tối thiểu 3 ký tự, chỉ chứa chữ và số
 * - password: không rỗng, tối thiểu 6 ký tự
 * - email: không rỗng, đúng định dạng email
 */
const validateRegister = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username không được để trống')
        .isLength({ min: 3 })
        .withMessage('Username phải có ít nhất 3 ký tự')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username chỉ được chứa chữ cái, số và dấu gạch dưới'),

    body('password')
        .notEmpty()
        .withMessage('Password không được để trống')
        .isLength({ min: 6 })
        .withMessage('Password phải có ít nhất 6 ký tự'),

    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email không được để trống')
        .isEmail()
        .withMessage('Email không đúng định dạng')
        .normalizeEmail(),

    // Middleware xử lý kết quả validation
    handleValidationErrors
];

/**
 * Validation rules cho API Verify OTP
 * - email: không rỗng, đúng format
 * - otp: không rỗng, đúng 6 ký tự số
 */
const validateVerifyOtp = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email không được để trống')
        .isEmail()
        .withMessage('Email không đúng định dạng'),

    body('otp')
        .trim()
        .notEmpty()
        .withMessage('Mã OTP không được để trống')
        .isLength({ min: 6, max: 6 })
        .withMessage('Mã OTP phải có đúng 6 chữ số')
        .isNumeric()
        .withMessage('Mã OTP chỉ chứa số'),

    // Middleware xử lý kết quả validation
    handleValidationErrors
];

/**
 * Validation rules cho API Forgot Password
 * - email: không rỗng, đúng format
 */
const validateForgotPassword = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email không được để trống')
        .isEmail()
        .withMessage('Email không đúng định dạng'),

    // Middleware xử lý kết quả validation
    handleValidationErrors
];

/**
 * Validation rules cho API Reset Password
 * - email: không rỗng, đúng format
 * - otp: không rỗng, 6 chữ số
 * - new_password: không rỗng, tối thiểu 6 ký tự
 */
const validateResetPassword = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email không được để trống')
        .isEmail()
        .withMessage('Email không đúng định dạng'),

    body('otp')
        .trim()
        .notEmpty()
        .withMessage('Mã OTP không được để trống')
        .isLength({ min: 6, max: 6 })
        .withMessage('Mã OTP phải có đúng 6 chữ số')
        .isNumeric()
        .withMessage('Mã OTP chỉ chứa số'),

    body('new_password')
        .notEmpty()
        .withMessage('Mật khẩu mới không được để trống')
        .isLength({ min: 6 })
        .withMessage('Mật khẩu mới phải có ít nhất 6 ký tự'),

    // Middleware xử lý kết quả validation
    handleValidationErrors
];

/**
 * Validation rules cho API Update Profile
 * - full_name: optional, nếu có thì không rỗng
 * - phone: optional, nếu có thì đúng format
 * - address: optional
 */
const validateUpdateProfile = [
    body('full_name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Họ tên không được để trống nếu được cung cấp'),

    body('phone')
        .optional()
        .trim()
        .matches(/^[0-9]{10,11}$/)
        .withMessage('Số điện thoại phải có 10-11 chữ số'),

    body('address')
        .optional()
        .trim(),

    // Middleware xử lý kết quả validation
    handleValidationErrors
];

module.exports = {
    validateLogin,
    validateRegister,
    validateVerifyOtp,
    validateForgotPassword,
    validateResetPassword,
    validateUpdateProfile
};
