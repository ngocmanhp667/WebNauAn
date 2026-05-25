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
     * PUT /user/profile
     * Cập nhật thông tin profile
     * 
     * Yêu cầu: AuthMiddleware + RoleMiddleware('user', 'admin')
     * Body: { fullName, phone, bio, cuisinePreferences, dailyBudget }
     * 
     * Response: { success, message, data: Updated UserDTO }
     */
    async updateProfile(req, res, next) {
        try {
            const userId = req.user.id;
            const {
                avatarUrl,
                avatar_url,
                email,
                fullName,
                full_name,
                phone,
                address,
                bio,
                facebookUrl,
                facebook_url,
                instagramUsername,
                instagram_username,
                cuisinePreferences,
                cuisine_preferences,
                dailyBudget,
                daily_budget
            } = req.body;

            // Gọi Service cập nhật profile
            const updatedUserDTO = await UserService.updateProfile(userId, {
                avatar_url: avatarUrl ?? avatar_url,
                email,
                full_name: fullName ?? full_name,
                phone,
                address,
                bio,
                facebook_url: facebookUrl ?? facebook_url,
                instagram_username: instagramUsername ?? instagram_username,
                cuisine_preferences: cuisinePreferences ?? cuisine_preferences,
                daily_budget: dailyBudget ?? daily_budget
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
