/**
 * =================================================================
 * ADMIN ROUTES
 * =================================================================
 * Định nghĩa các route thống kê, quản trị dành riêng cho Admin:
 * - GET  /admin/stats       (Auth + Role: admin)
 * =================================================================
 */

const express = require('express');
const router = express.Router();

// Import Controllers
const AdminController = require('../controllers/admin.controller');

// Import Middlewares
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// Route lấy thống kê (chỉ admin có token hợp lệ mới được xem)
router.get(
    '/admin/stats',
    verifyToken,
    authorize('admin'),
    AdminController.getStats
);

module.exports = router;
