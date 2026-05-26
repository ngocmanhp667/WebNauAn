const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');

router.post('/ai/fridge-suggest', aiController.suggestRecipesFromFridge);

module.exports = router;
