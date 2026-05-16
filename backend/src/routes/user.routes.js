/**
 * =================================================================
 * USER ROUTES
 * =================================================================
 * Định nghĩa các route cho module User/Admin Profile:
 * - GET  /user/profile       (Auth + Role: user/admin)
 * - GET  /admin/profile      (Auth + Role: admin)
 * - PUT  /user/profile       (Auth + Role: user/admin + Validation)
 * 
 * Tất cả route đều yêu cầu JWT Authentication (verifyToken)
 * và Role Authorization (authorize).
 * =================================================================
 */

const express = require('express');
const router = express.Router();

// Import Controllers
const UserController = require('../controllers/user.controller');

// Import Middlewares
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { validateUpdateProfile } = require('../middlewares/inputValidationMiddleware');

// ========================
// USER PROFILE ROUTES
// ========================

/**
 * GET /user/profile
 * Lấy profile của user đang đăng nhập
 * Middlewares: verifyToken -> authorize('user', 'admin') -> Controller
 * 
 * Luồng: Client -> AuthMiddleware -> RoleMiddleware -> UserController.getProfile
 */
router.get(
    '/user/profile',
    verifyToken,
    authorize('user', 'admin'),
    UserController.getProfile
);

/**
 * PUT /user/profile
 * Cập nhật thông tin profile
 * Middlewares: verifyToken -> authorize('user', 'admin') -> Validation -> Controller
 * 
 * Luồng: Client -> AuthMiddleware -> RoleMiddleware -> InputValidation -> UserController.updateProfile
 */
router.put(
    '/user/profile',
    verifyToken,
    authorize('user', 'admin'),
    validateUpdateProfile,
    UserController.updateProfile
);

// ========================
// ADMIN PROFILE ROUTES
// ========================

/**
 * GET /admin/profile
 * Lấy profile admin (chỉ admin mới truy cập được)
 * Middlewares: verifyToken -> authorize('admin') -> Controller
 * 
 * Luồng: Client -> AuthMiddleware -> RoleMiddleware(admin) -> UserController.getAdminProfile
 */
router.get(
    '/admin/profile',
    verifyToken,
    authorize('admin'),
    UserController.getAdminProfile
);

module.exports = router;
