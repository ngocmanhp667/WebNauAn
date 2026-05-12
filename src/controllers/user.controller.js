/**
 * =================================================================
 * USER CONTROLLER
 * =================================================================
 * Tầng Controller cho các API liên quan đến User Profile.
 * Nhận Request (đã qua Auth + Role middleware), gọi Service, trả Response.
 * =================================================================
 */

const UserService = require('../services/user.service');

class UserController {
    /**
     * GET /user/profile
     * Lấy thông tin profile của user đang đăng nhập
     * 
     * Yêu cầu: AuthMiddleware + RoleMiddleware('user', 'admin')
     * req.user.id được gắn bởi AuthMiddleware
     * 
     * Response: { success, message, data: UserDTO }
     */
    async getProfile(req, res, next) {
        try {
            // Lấy userId từ req.user (được gắn bởi verifyToken middleware)
            const userId = req.user.id;

            // Gọi Service lấy profile data (trả về DTO)
            const userDTO = await UserService.getProfileData(userId);

            return res.status(200).json({
                success: true,
                message: 'Lấy thông tin profile thành công',
                data: userDTO
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Lỗi server'
            });
        }
    }

    /**
     * GET /admin/profile
     * Lấy thông tin profile admin
     * 
     * Yêu cầu: AuthMiddleware + RoleMiddleware('admin')
     * 
     * Response: { success, message, data: UserDTO }
     */
    async getAdminProfile(req, res, next) {
        try {
            const userId = req.user.id;

            const userDTO = await UserService.getProfileData(userId);

            return res.status(200).json({
                success: true,
                message: 'Lấy thông tin admin profile thành công',
                data: userDTO
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Lỗi server'
            });
        }
    }

    /**
     * PUT /user/profile/edit
     * Cập nhật thông tin profile
     * 
     * Yêu cầu: AuthMiddleware + RoleMiddleware('user', 'admin')
     * Body: { full_name, phone, address }
     * 
     * Response: { success, message, data: Updated UserDTO }
     */
    async updateProfile(req, res, next) {
        try {
            const userId = req.user.id;
            const { full_name, phone, address } = req.body;

            // Gọi Service cập nhật profile
            const updatedUserDTO = await UserService.updateProfile(userId, {
                full_name, phone, address
            });

            return res.status(200).json({
                success: true,
                message: 'Cập nhật profile thành công',
                data: updatedUserDTO
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Lỗi server'
            });
        }
    }
}

module.exports = new UserController();
