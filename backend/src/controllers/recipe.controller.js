const recipeService = require('../services/recipe.service');

class RecipeController {
    async getAllRecipes(req, res, next) {
        try {
            const { category, q, difficulty, sort, author_id } = req.query;
            const recipes = await recipeService.getAllRecipes({ category, query: q, difficulty, sort, author_id });
            return res.status(200).json({
                success: true,
                data: recipes
            });
        } catch (error) {
            next(error);
        }
    }

    async getRecipeById(req, res, next) {
        try {
            const { id } = req.params;
            const recipe = await recipeService.getRecipeById(id);
            return res.status(200).json({
                success: true,
                data: recipe
            });
        } catch (error) {
            next(error);
        }
    }

    async getRecipeBySlug(req, res, next) {
        try {
            const { slug } = req.params;
            const recipe = await recipeService.getRecipeBySlug(slug);
            return res.status(200).json({
                success: true,
                data: recipe
            });
        } catch (error) {
            next(error);
        }
    }

    async createRecipe(req, res, next) {
        try {
            const authorId = req.user.id;
            const recipe = await recipeService.createRecipe(authorId, req.body);
            return res.status(201).json({
                success: true,
                message: 'Tạo công thức thành công',
                data: recipe
            });
        } catch (error) {
            next(error);
        }
    }

    async updateRecipe(req, res, next) {
        try {
            const { id } = req.params;
            const authorId = req.user.id;
            const userRole = req.user.role;
            const recipe = await recipeService.updateRecipe(id, authorId, userRole, req.body);
            return res.status(200).json({
                success: true,
                message: 'Cập nhật công thức thành công',
                data: recipe
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteRecipe(req, res, next) {
        try {
            const { id } = req.params;
            const authorId = req.user.id;
            const userRole = req.user.role;
            await recipeService.deleteRecipe(id, authorId, userRole);
            return res.status(200).json({
                success: true,
                message: 'Xóa công thức thành công'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new RecipeController();
