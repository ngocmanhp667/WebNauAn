/**
 * =================================================================
 * PRODUCT REPOSITORY
 * =================================================================
 * Tầng Repository - Chỉ tương tác với Database.
 * =================================================================
 */

const pool = require('../config/database');

class ProductRepository {
    buildWhere(filters) {
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

        return { whereClause, params };
    }

    getOrderBy(sort) {
        let orderBy = 'ORDER BY sold DESC';
        if (sort === 'rating') {
            orderBy = 'ORDER BY rating DESC';
        } else if (sort === 'price-asc') {
            orderBy = 'ORDER BY price ASC';
        } else if (sort === 'price-desc') {
            orderBy = 'ORDER BY price DESC';
        } else if (sort === 'newest') {
            orderBy = 'ORDER BY created_at DESC';
        }

        return orderBy;
    }

    async search(filters) {
        const { whereClause, params } = this.buildWhere(filters);

        const orderBy = this.getOrderBy(filters.sort);
        const limit = Number.isFinite(filters.limit) ? filters.limit : 10;
        const page = Number.isFinite(filters.page) && filters.page > 0 ? filters.page : 1;
        const offset = (page - 1) * limit;

        const [rows] = await pool.execute(
            `SELECT * FROM products ${whereClause} ${orderBy} LIMIT ? OFFSET ?`,
            [...params, limit, offset]
        );

        const [countRows] = await pool.execute(
            `SELECT COUNT(*) AS total FROM products ${whereClause}`,
            params
        );

        return {
            rows,
            total: countRows[0] ? Number(countRows[0].total) : 0,
            page,
            limit,
        };
    }
}

module.exports = new ProductRepository();
