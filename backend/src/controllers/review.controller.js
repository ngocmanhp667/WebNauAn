const reviewService = require('../services/review.service');

class ReviewController {
    async addReview(req, res, next) {
        try {
            const { id: recipeId } = req.params;
            const userId = req.user.id;
            const { rating, comment } = req.body;

            const review = await reviewService.addReview(userId, recipeId, rating, comment);
            return res.status(201).json({
                success: true,
                message: 'Đăng đánh giá thành công',
                data: review
            });
        } catch (error) {
            next(error);
        }
    }

    async updateReview(req, res, next) {
        try {
            const { id: reviewId } = req.params;
            const userId = req.user.id;
            const { rating, comment } = req.body;

            const review = await reviewService.updateReview(userId, reviewId, rating, comment);
            return res.status(200).json({
                success: true,
                message: 'Cập nhật đánh giá thành công',
                data: review
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteReview(req, res, next) {
        try {
            const { id: reviewId } = req.params;
            const userId = req.user.id;

            await reviewService.deleteReview(userId, reviewId);
            return res.status(200).json({
                success: true,
                message: 'Xóa đánh giá thành công'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ReviewController();
