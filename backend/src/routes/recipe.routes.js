const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe.controller');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/recipes', recipeController.getAllRecipes);
router.get('/recipes/:id', recipeController.getRecipeById);
router.get('/recipes/slug/:slug', recipeController.getRecipeBySlug);
router.post('/recipes', verifyToken, recipeController.createRecipe);
router.put('/recipes/:id', verifyToken, recipeController.updateRecipe);
router.delete('/recipes/:id', verifyToken, recipeController.deleteRecipe);

module.exports = router;
