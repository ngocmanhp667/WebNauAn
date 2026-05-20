/**
 * =================================================================
 * SERVER.JS - Entry Point
 * =================================================================
 * Khởi tạo Express server, load middleware, và kết nối database.
 * =================================================================
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import Routes
const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const productRoutes = require('./src/routes/product.routes');

// Import Database Config
const pool = require('./src/config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// ========================
// GLOBAL MIDDLEWARES
// ========================

// Cho phép Cross-Origin requests
app.use(cors());

// Parse JSON body
app.use(express.json());

// Parse URL-encoded body
app.use(express.urlencoded({ extended: true }));

// ========================
// ROUTES
// ========================

// Auth routes: /api/login, /api/register, /api/verify-otp, ...
app.use('/api', authRoutes);

// Product routes: /api/products
app.use('/api', productRoutes);

// User routes: /user/profile, /admin/profile, ...
app.use('/', userRoutes);

// ========================
// HEALTH CHECK
// ========================
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API Server is running!',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// ========================
// GLOBAL ERROR HANDLER
// ========================
app.use((err, req, res, next) => {
    console.error('❌ Unhandled Error:', err.message);
    console.error(err.stack);

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// ========================
// START SERVER
// ========================
const startServer = async () => {
    try {
        // Test kết nối database
        const connection = await pool.getConnection();
        console.log('✅ Kết nối MySQL thành công!');
        connection.release();

        // Khởi động server
        app.listen(PORT, () => {
            console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
            console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('❌ Không thể kết nối database:', error.message);
        process.exit(1);
    }
};

startServer();
