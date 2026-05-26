/**
 * =================================================================
 * PRODUCT CONTROLLER
 * =================================================================
 * Controller cho API tim kiem/loc mon an.
 * =================================================================
 */

const ProductService = require("../services/product.service");

const toNumber = (value) => {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const toBoolean = (value) => {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "boolean") return value;
  return String(value).toLowerCase() === "true";
};

class ProductController {
  /**
   * GET /api/products
   * Query: query, category, minPrice, maxPrice, minRating, inStock, sort, page, limit
   */
  async search(req, res, next) {
    try {
      const filters = {
        query: req.query.query ? String(req.query.query).trim() : "",
        category: req.query.category
          ? String(req.query.category).trim()
          : "all",
        minPrice: toNumber(req.query.minPrice),
        maxPrice: toNumber(req.query.maxPrice),
        minRating: toNumber(req.query.minRating),
        inStock: toBoolean(req.query.inStock),
        isPromo: toBoolean(req.query.isPromo),
        isNew: toBoolean(req.query.isNew),
        isBestSeller: toBoolean(req.query.isBestSeller),
        sort: req.query.sort ? String(req.query.sort).trim() : "popular",
        page: toNumber(req.query.page),
        limit: toNumber(req.query.limit),
      };

      const result = await ProductService.searchProducts(filters);

      return res.status(200).json({
        success: true,
        message: "Lay du lieu mon an thanh cong",
        data: result.items,
        pagination: result.pagination,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Loi server",
      });
    }
  }

  /**
   * GET /api/products/:id
   */
  async getById(req, res, next) {
    try {
      const id = toNumber(req.params.id);
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "ID san pham khong hop le",
        });
      }

      const product = await ProductService.getProductById(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Khong tim thay san pham",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Lay chi tiet san pham thanh cong",
        data: product,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Loi server",
      });
    }
  }

  /**
   * GET /api/products/top
   * Query: type=most-viewed|top-rated, page, limit
   */
  async top(req, res, next) {
    try {
      const type = req.query.type
        ? String(req.query.type).trim()
        : "most-viewed";
      if (!["most-viewed", "top-rated", "best-seller"].includes(type)) {
        return res.status(400).json({
          success: false,
          message: "type khong hop le",
        });
      }

      const result = await ProductService.getTopProducts({
        type,
        page: toNumber(req.query.page),
        limit: toNumber(req.query.limit) ?? 10,
      });

      return res.status(200).json({
        success: true,
        message: "Lay top mon an thanh cong",
        data: result.items,
        pagination: result.pagination,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Loi server",
      });
    }
  }
}

module.exports = new ProductController();
