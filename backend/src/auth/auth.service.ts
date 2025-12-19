import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { User } from '../modules/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
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

    // 1. Tạo mật khẩu tạm (8 ký tự)
    const tempPassword = Math.random().toString(36).slice(-8);
    
    // 2. Mã hóa và lưu vào Database
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(tempPassword, salt);
    await this.userRepo.save(user);

    // 3. Giả lập gửi Email: In ra log của Docker Terminal
    console.log('\n==========================================');
    console.log(`[HỆ THỐNG] Yêu cầu reset mật khẩu cho: ${email}`);
    console.log(`[HỆ THỐNG] Mật khẩu mới là: ${tempPassword}`);
    console.log('==========================================\n');

    return {
      message: 'Mật khẩu mới đã được cấp. Hãy kiểm tra với bộ phận kỹ thuật (Log Terminal)',
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
