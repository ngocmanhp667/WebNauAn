const pool = require('../config/database');

class AdminRepository {
    constructor() {
        // Tự động khởi tạo bảng ai_logs khi repo được nạp
        this.initTables().catch(err => {
            console.error('❌ Lỗi khởi tạo bảng admin stats:', err.message);
        });
    }

    async initTables() {
        const sql = `
            CREATE TABLE IF NOT EXISTS ai_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT DEFAULT NULL,
                type VARCHAR(50) DEFAULT 'fridge_suggest',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `;
        await pool.query(sql);
    }

    async getRecipeStats() {
        const sql = `
            SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COUNT(*) AS count
            FROM recipes
            GROUP BY month
            ORDER BY month ASC
        `;
        const [rows] = await pool.query(sql);
        return rows;
    }

    async getDifficultyStats() {
        const sql = `
            SELECT difficulty, COUNT(*) AS count
            FROM recipes
            GROUP BY difficulty
        `;
        const [rows] = await pool.query(sql);
        return rows;
    }

    async getAiLogsStats() {
        const sql = `
            SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COUNT(*) AS count
            FROM ai_logs
            GROUP BY month
            ORDER BY month ASC
        `;
        const [rows] = await pool.query(sql);
        return rows;
    }

    async getUserPreferences() {
        const sql = `
            SELECT cuisine_preferences 
            FROM users 
            WHERE cuisine_preferences IS NOT NULL
        `;
        const [rows] = await pool.query(sql);
        return rows;
    }

    async logAiUsage(userId, type = 'fridge_suggest') {
        const sql = `
            INSERT INTO ai_logs (user_id, type)
            VALUES (?, ?)
        `;
        await pool.query(sql, [userId, type]);
    }
}

module.exports = new AdminRepository();
