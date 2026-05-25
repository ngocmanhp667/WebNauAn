/**
 * =================================================================
 * PRODUCT ROUTES
 * =================================================================
 * Route tim kiem/loc mon an
 * - GET /api/products
 * - GET /api/products/top
 * =================================================================
 */

const express = require("express");
const router = express.Router();

const ProductController = require("../controllers/product.controller");

router.get("/products", ProductController.search);
router.get("/products/top", ProductController.top);

module.exports = router;
