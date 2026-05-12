/**
 * =================================================================
 * EMAIL SERVICE
 * =================================================================
 * Gửi email OTP qua Nodemailer (SMTP).
 * =================================================================
 */

const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: process.env.EMAIL_PORT || 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    /**
     * Gửi OTP xác thực tài khoản
     */
    async sendOtpEmail(toEmail, otp) {
        const mailOptions = {
            from: `"BaiTap2 API" <${process.env.EMAIL_FROM}>`,
            to: toEmail,
            subject: 'Mã xác thực OTP - Xác nhận tài khoản',
            html: `<div style="font-family:Arial;max-width:600px;margin:0 auto;padding:20px">
                <h2 style="color:#667eea">Xác thực tài khoản</h2>
                <p>Mã OTP của bạn là:</p>
                <div style="background:#f0f0f0;padding:20px;text-align:center;border-radius:8px;margin:20px 0">
                    <span style="font-size:36px;font-weight:bold;color:#667eea;letter-spacing:8px">${otp}</span>
                </div>
                <p>Mã có hiệu lực trong <strong>10 phút</strong>.</p>
            </div>`
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('📧 Email OTP đã gửi tới:', toEmail);
            return info;
        } catch (error) {
            console.error('❌ Lỗi gửi email:', error.message);
            throw new Error('Không thể gửi email OTP. Vui lòng thử lại sau.');
        }
    }

    /**
     * Gửi OTP đặt lại mật khẩu
     */
    async sendResetPasswordOtp(toEmail, otp) {
        const mailOptions = {
            from: `"BaiTap2 API" <${process.env.EMAIL_FROM}>`,
            to: toEmail,
            subject: 'Mã OTP - Đặt lại mật khẩu',
            html: `<div style="font-family:Arial;max-width:600px;margin:0 auto;padding:20px">
                <h2 style="color:#f5576c">Đặt lại mật khẩu</h2>
                <p>Mã OTP đặt lại mật khẩu của bạn là:</p>
                <div style="background:#f0f0f0;padding:20px;text-align:center;border-radius:8px;margin:20px 0">
                    <span style="font-size:36px;font-weight:bold;color:#f5576c;letter-spacing:8px">${otp}</span>
                </div>
                <p>Mã có hiệu lực trong <strong>10 phút</strong>.</p>
            </div>`
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('📧 Email Reset Password đã gửi tới:', toEmail);
            return info;
        } catch (error) {
            console.error('❌ Lỗi gửi email:', error.message);
            throw new Error('Không thể gửi email OTP. Vui lòng thử lại sau.');
        }
    }
}

module.exports = new EmailService();
