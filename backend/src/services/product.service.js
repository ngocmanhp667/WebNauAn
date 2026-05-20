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
        const rows = await productRepository.search(filters);
        return rows.map((item) => {
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
    }
}

module.exports = new ProductService();
