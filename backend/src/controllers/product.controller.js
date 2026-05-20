/**
 * =================================================================
 * PRODUCT CONTROLLER
 * =================================================================
 * Controller cho API tim kiem/loc mon an.
 * =================================================================
 */

const ProductService = require('../services/product.service');

const toNumber = (value) => {
    if (value === undefined || value === null || value === '') return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
};

const toBoolean = (value) => {
    if (value === undefined || value === null) return undefined;
    if (typeof value === 'boolean') return value;
    return String(value).toLowerCase() === 'true';
};

class ProductController {
    /**
     * GET /api/products
     * Query: query, category, minPrice, maxPrice, minRating, inStock, sort, page, limit
     */
    async search(req, res, next) {
        try {
            const filters = {
                query: req.query.query ? String(req.query.query).trim() : '',
                category: req.query.category ? String(req.query.category).trim() : 'all',
                minPrice: toNumber(req.query.minPrice),
                maxPrice: toNumber(req.query.maxPrice),
                minRating: toNumber(req.query.minRating),
                inStock: toBoolean(req.query.inStock),
                sort: req.query.sort ? String(req.query.sort).trim() : 'popular',
                page: toNumber(req.query.page),
                limit: toNumber(req.query.limit),
            };

            const result = await ProductService.searchProducts(filters);

            return res.status(200).json({
                success: true,
                message: 'Lay du lieu mon an thanh cong',
                data: result.items,
                pagination: result.pagination,
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Loi server',
            });
        }
    }
}

module.exports = new ProductController();
