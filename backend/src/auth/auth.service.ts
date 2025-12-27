import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

import { User } from '../modules/users/entities/user.entity';
import { EmailService } from './email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Email không tồn tại');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Sai mật khẩu');

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    };
  }

  async forgotPassword(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Email không tồn tại trong hệ thống');
    }

    // Tạo reset token ngẫu nhiên
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash token trước khi lưu vào database
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Lưu token và thời gian hết hạn (15 phút)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 900000); // 15 minutes
    await this.userRepo.save(user);

    // Gửi email
    try {
      await this.emailService.sendResetPasswordEmail(email, resetToken);
      return {
        message: 'Email khôi phục mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.',
      };
    } catch (error) {
      // Nếu gửi email thất bại, vẫn trả về thông báo cho dev
      console.error('Error sending email:', error);
      return {
        message: 'Link khôi phục đã được tạo. Kiểm tra console để lấy link (DEV MODE).',
      };
    }
  }

  async resetPassword(token: string, newPassword: string) {
    // Hash token từ URL
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Tìm user với token hợp lệ và chưa hết hạn
    const user = await this.userRepo.findOne({
      where: {
        resetPasswordToken: hashedToken,
      },
    });

    if (!user) {
      throw new BadRequestException('Token không hợp lệ hoặc đã hết hạn');
    }

    // Kiểm tra thời gian hết hạn
    if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Token đã hết hạn');
    }

    // Đặt mật khẩu mới
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(newPassword, salt);
    
    // Xóa reset token
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    
    await this.userRepo.save(user);

    return {
      message: 'Mật khẩu đã được đặt lại thành công. Bạn có thể đăng nhập ngay bây giờ.',
    };
  }

  async resetAdminPassword() {
    const user = await this.userRepo.findOne({ where: { email: 'admin@flight.com' } });
    if (!user) {
      throw new UnauthorizedException('Không tìm thấy admin@flight.com');
    }

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash('flight123456', salt);
    await this.userRepo.save(user);

    return { message: 'Đã reset mật khẩu admin@flight.com về flight123456' };
  }
}
