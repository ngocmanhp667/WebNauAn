/**
 * =================================================================
 * PRODUCT SERVICE
 * =================================================================
 * Tầng Service - Xử lý business logic cho mon an.
 * =================================================================
 */

const productRepository = require('../repositories/product.repository');

class ProductService {
    async searchProducts(filters) {
        const result = await productRepository.search(filters);
        const items = result.rows.map((item) => {
            let images = [];
            let tags = [];

            try {
                images = item.images ? JSON.parse(item.images) : [];
            } catch (error) {
                images = [];
            }

            try {
                tags = item.tags ? JSON.parse(item.tags) : [];
            } catch (error) {
                tags = [];
            }

            return {
                id: item.id,
                name: item.name,
                description: item.description,
                category: item.category,
                price: Number(item.price),
                rating: Number(item.rating),
                stock: item.stock,
                sold: item.sold,
                isPromo: Boolean(item.is_promo),
                isNew: Boolean(item.is_new),
                isBestSeller: Boolean(item.is_best_seller),
                images,
                tags,
            };
        });

        const totalPages = result.limit > 0 ? Math.ceil(result.total / result.limit) : 0;

        return {
            items,
            pagination: {
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages,
            },
        };
    }
}

module.exports = new ProductService();
