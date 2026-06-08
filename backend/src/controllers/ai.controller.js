const aiService = require('../services/ai.service');
const adminRepository = require('../repositories/admin.repository');

class AIController {
    async suggestRecipesFromFridge(req, res, next) {
        try {
            const { ingredients, peopleCount, complexity, cookingSpeed, dishCount } = req.body;

            if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng cung cấp ít nhất một thực phẩm trong tủ lạnh.'
                });
            }

            const parsedPeopleCount = parseInt(peopleCount) || 2;
            const parsedComplexity = complexity || 'bình thường';
            const parsedCookingSpeed = cookingSpeed || 'bình thường';
            const parsedDishCount = parseInt(dishCount) || 3;

            const suggestions = await aiService.getFridgeSuggestions({
                ingredients,
                peopleCount: parsedPeopleCount,
                complexity: parsedComplexity,
                cookingSpeed: parsedCookingSpeed,
                dishCount: parsedDishCount
            });

            // Ghi nhận log sử dụng AI (giúp thống kê ở Admin Dashboard)
            try {
                let userId = null;
                const authHeader = req.headers.authorization;
                if (authHeader && authHeader.startsWith('Bearer ')) {
                    const token = authHeader.split(' ')[1];
                    const jwt = require('jsonwebtoken');
                    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
                    userId = decoded.id;
                }
                await adminRepository.logAiUsage(userId, 'fridge_suggest');
            } catch (logError) {
                console.error('⚠️ Lỗi ghi log sử dụng AI:', logError.message);
                // Bỏ qua lỗi ghi log để không làm ngắt quãng trải nghiệm của người dùng
            }

            return res.status(200).json({
                success: true,
                message: 'Lấy gợi ý món ăn thành công',
                data: suggestions
            });

        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AIController();
