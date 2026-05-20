/**
 * =================================================================
 * PRODUCT ROUTES
 * =================================================================
 * Route tim kiem/loc mon an
 * - GET /api/products
 * =================================================================
 */

const express = require('express');
const router = express.Router();

const ProductController = require('../controllers/product.controller');

router.get('/products', ProductController.search);

module.exports = router;
