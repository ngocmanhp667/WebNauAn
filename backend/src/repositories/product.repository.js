/**
 * =================================================================
 * PRODUCT REPOSITORY
 * =================================================================
 * Tầng Repository - Chỉ tương tác với Database.
 * =================================================================
 */

const pool = require('../config/database');

class ProductRepository {
    async search(filters) {
        const where = [];
        const params = [];

        if (filters.query) {
            where.push('(name LIKE ? OR description LIKE ? OR tags LIKE ?)');
            const likeQuery = `%${filters.query}%`;
            params.push(likeQuery, likeQuery, likeQuery);
        }

        if (filters.category && filters.category !== 'all') {
            where.push('category = ?');
            params.push(filters.category);
        }

        if (Number.isFinite(filters.minPrice)) {
            where.push('price >= ?');
            params.push(filters.minPrice);
        }

        if (Number.isFinite(filters.maxPrice)) {
            where.push('price <= ?');
            params.push(filters.maxPrice);
        }

        if (Number.isFinite(filters.minRating)) {
            where.push('rating >= ?');
            params.push(filters.minRating);
        }

        if (filters.inStock === true) {
            where.push('stock > 0');
        }

        const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

        let orderBy = 'ORDER BY sold DESC';
        if (filters.sort === 'rating') {
            orderBy = 'ORDER BY rating DESC';
        } else if (filters.sort === 'price-asc') {
            orderBy = 'ORDER BY price ASC';
        } else if (filters.sort === 'price-desc') {
            orderBy = 'ORDER BY price DESC';
        } else if (filters.sort === 'newest') {
            orderBy = 'ORDER BY created_at DESC';
        }

        const [rows] = await pool.execute(
            `SELECT * FROM products ${whereClause} ${orderBy}`,
            params
        );

        return rows;
    }
}

module.exports = new ProductRepository();
