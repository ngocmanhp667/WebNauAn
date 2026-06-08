const adminRepository = require('../repositories/admin.repository');
const pool = require('../config/database');

class AdminController {
    async getStats(req, res, next) {
        try {
            // 1. Lấy thống kê công thức theo tháng
            const recipeStats = await adminRepository.getRecipeStats();

            // 2. Lấy thống kê độ khó công thức
            const difficultyStats = await adminRepository.getDifficultyStats();

            // 3. Lấy thống kê lượt gọi gợi ý AI
            const aiLogsStats = await adminRepository.getAiLogsStats();

            // 4. Lấy sở thích/mục tiêu của người dùng và tính toán tần suất
            const rawPrefs = await adminRepository.getUserPreferences();
            const preferencesMap = {};

            rawPrefs.forEach(row => {
                let prefs = [];
                try {
                    // Cột cuisine_preferences được lưu dưới dạng JSON string
                    prefs = JSON.parse(row.cuisine_preferences);
                } catch (e) {
                    // Nếu lỗi parse, thử split bằng dấu phẩy
                    if (typeof row.cuisine_preferences === 'string') {
                        prefs = row.cuisine_preferences.split(',').map(p => p.trim());
                    }
                }

                if (Array.isArray(prefs)) {
                    prefs.forEach(p => {
                        const trimmed = p.trim();
                        if (trimmed) {
                            // Chuẩn hoá chữ viết hoa/thường
                            const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
                            preferencesMap[capitalized] = (preferencesMap[capitalized] || 0) + 1;
                        }
                    });
                }
            });

            // Chuyển map tần suất thành mảng array của objects [{ name, value }]
            const preferenceStats = Object.keys(preferencesMap).map(key => ({
                name: key,
                value: preferencesMap[key]
            })).sort((a, b) => b.value - a.value); // Sắp xếp giảm dần theo số lượng

            // 5. Lấy thêm một số chỉ số bento để hiển thị trên Dashboard Admin thật
            const [[{ totalUsers }]] = await pool.query('SELECT COUNT(*) AS totalUsers FROM users');
            const [[{ totalRecipes }]] = await pool.query('SELECT COUNT(*) AS totalRecipes FROM recipes');
            const [[{ totalReviews }]] = await pool.query('SELECT COUNT(*) AS totalReviews FROM reviews');

            return res.status(200).json({
                success: true,
                message: 'Lấy dữ liệu thống kê Admin thành công',
                data: {
                    recipeStats,
                    difficultyStats,
                    aiLogsStats,
                    preferenceStats,
                    summary: {
                        totalUsers,
                        totalRecipes,
                        totalReviews
                    }
                }
            });

        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AdminController();
