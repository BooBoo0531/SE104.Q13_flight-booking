import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    // Cấu hình email transporter
    // Sử dụng Gmail hoặc service khác
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'your-app-password',
      },
    });
  }

  async sendResetPasswordEmail(email: string, resetToken: string) {
    const resetUrl = `http://localhost:8081/reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@flight.com',
      to: email,
      subject: 'Khôi phục mật khẩu - Hệ Thống Quản Lý Bay',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0; box-shadow: 0 2px 10px rgba(59, 130, 246, 0.3); }
            .content { background: white; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); }
            .button { display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white !important; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 25px 0; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4); transition: all 0.3s ease; }
            .button:hover { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5); transform: translateY(-2px); }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            .warning { background: #fef3c7; border-left: 5px solid #f59e0b; padding: 18px; margin: 25px 0; border-radius: 6px; }
            .link-box { background: #f3f4f6; padding: 15px; border-radius: 8px; word-break: break-all; border: 1px solid #e5e7eb; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✈️ Khôi phục mật khẩu</h1>
            </div>
            <div class="content">
              <p>Xin chào,</p>
              <p>Chúng tôi nhận được yêu cầu khôi phục mật khẩu cho tài khoản của bạn tại <strong>Hệ Thống Quản Lý Bay</strong>.</p>
              <p>Vui lòng nhấn vào nút bên dưới để đặt lại mật khẩu của bạn:</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Đặt lại mật khẩu</a>
              </div>
              <p>Hoặc copy link sau vào trình duyệt:</p>
              <div class="link-box">
                ${resetUrl}
              </div>
              <div class="warning">
                <strong>⚠️ Lưu ý quan trọng:</strong> Link này chỉ có hiệu lực trong <strong>15 phút</strong>. Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này để đảm bảo an toàn tài khoản.
              </div>
              <p>Trân trọng,<br><strong>Đội ngũ Hệ Thống Quản Lý Bay</strong></p>
            </div>
            <div class="footer">
              <p>© 2025 Hệ Thống Quản Lý Bay. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email reset password đã được gửi đến: ${email}`);
      console.log(`🔗 Reset URL: ${resetUrl}`);
    } catch (error) {
      console.error('❌ Lỗi khi gửi email:', error);
      // Trong môi trường dev, vẫn log URL để test
      console.log(`\n==========================================`);
      console.log(`[DEV MODE] Reset Password URL:`);
      console.log(resetUrl);
      console.log(`==========================================\n`);
      throw error;
    }
  }
}
