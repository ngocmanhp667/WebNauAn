const commentService = require('../services/comment.service');

class CommentController {
    async getComments(req, res, next) {
        try {
            const { id: recipeId } = req.params;
            const comments = await commentService.getCommentsByRecipeId(recipeId);
            return res.status(200).json({
                success: true,
                data: comments
            });
        } catch (error) {
            next(error);
        }
    }

    async addComment(req, res, next) {
        try {
            const { id: recipeId } = req.params;
            const userId = req.user.id;
            const { content, parentId } = req.body;

            const comment = await commentService.addComment(userId, recipeId, content, parentId);
            return res.status(201).json({
                success: true,
                message: 'Đăng bình luận thành công',
                data: comment
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteComment(req, res, next) {
        try {
            const { id: commentId } = req.params;
            const userId = req.user.id;
            const userRole = req.user.role;

            await commentService.deleteComment(userId, userRole, commentId);
            return res.status(200).json({
                success: true,
                message: 'Xóa bình luận thành công'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CommentController();
