/**
 * =================================================================
 * DTO UTILITY (Data Transfer Object)
 * =================================================================
 * Chuẩn hóa dữ liệu trước khi trả về cho client.
 * Lược bỏ các thông tin nhạy cảm (password_hash, otp_code, ...).
 * =================================================================
 */

/**
 * Chuyển đổi user object từ DB thành User DTO
 * Lược bỏ: password_hash, otp_code, otp_expires_at
 * 
 * @param {Object} user - User object từ database
 * @returns {Object} User DTO an toàn để trả về cho client
 */
const toUserDTO = (user) => {
    if (!user) return null;

    return {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name || null,
        phone: user.phone || null,
        address: user.address || null,
        role: user.role,
        is_verified: user.is_verified === 1 || user.is_verified === true,
        created_at: user.created_at,
        updated_at: user.updated_at
    };
};

module.exports = {
    toUserDTO
};
