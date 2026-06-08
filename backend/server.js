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
const recipeRoutes = require('./src/routes/recipe.routes');
const categoryRoutes = require('./src/routes/category.routes');
const reviewRoutes = require('./src/routes/review.routes');
const commentRoutes = require('./src/routes/comment.routes');
const savedRecipeRoutes = require('./src/routes/savedRecipe.routes');
const followRoutes = require('./src/routes/follow.routes');
const aiRoutes = require('./src/routes/ai.routes');
const adminRoutes = require('./src/routes/admin.routes');

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

// Phục vụ thư mục static chứa ảnh upload
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


// ========================
// ROUTES
// ========================

// Auth routes: /api/login, /api/register, /api/verify-otp, ...
app.use('/api', authRoutes);

// Recipe routes
app.use('/api', recipeRoutes);

// Category routes
app.use('/api', categoryRoutes);

// Review routes
app.use('/api', reviewRoutes);

// Comment routes
app.use('/api', commentRoutes);

// Saved recipe routes
app.use('/api', savedRecipeRoutes);

// Follow routes
app.use('/api', followRoutes);

// AI routes
app.use('/api', aiRoutes);

// Admin routes
app.use('/api', adminRoutes);

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
