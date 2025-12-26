import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RolePermission } from './entities/role-permission.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    @InjectRepository(RolePermission)
    private rolesRepo: Repository<RolePermission>,
  ) {}

  // --- QUẢN LÝ USER ---
  async findAllUsers() {
    return this.usersRepo.find({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
      },
      order: { id: 'DESC' } 
    });
  }

  async createUser(data: any) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const newUser = this.usersRepo.create({ ...data, password: hashedPassword });
    return this.usersRepo.save(newUser);
  }

  async updateUser(id: number, data: any) {
    const user = await this.usersRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    // Xử lý mật khẩu: Nếu nhập mới thì hash, nếu để trống thì xóa khỏi data để không bị update nhầm thành chuỗi rỗng
    if (data.password && data.password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    } else {
      delete data.password;
    }

    await this.usersRepo.update(id, data);

    // Trả về user sau khi update (để frontend cập nhật lại list nếu cần)
    return this.usersRepo.findOneBy({ id });
  }

  async deleteUser(id: number) {
    return this.usersRepo.delete(id);
  }

  // --- QUẢN LÝ QUYỀN ---
  async getAllPermissions() {
    const roles = await this.rolesRepo.find();
    const result = {};
    roles.forEach(r => { result[r.role] = r.permissions; });
    return result;
  }

  async savePermissions(permissionsData: any) {
    const entities: Array<{ role: string; permissions: any }> = [];
    for (const [roleName, perms] of Object.entries(permissionsData)) {
      entities.push({ role: roleName, permissions: perms });
    }
    await this.rolesRepo.save(entities);
    return { success: true };
  }

  async seedDefaultPermissions() {
    const count = await this.rolesRepo.count();
    if (count === 0) {
      await this.rolesRepo.save([
        { role: 'Quản trị hệ thống', permissions: { ChuyenBay: true, VeChuyenBay: true, BaoCao: true, MayBay: true, TaiKhoan: true, CaiDat: true } },
        { role: 'Ban giám đốc', permissions: { ChuyenBay: false, VeChuyenBay: false, BaoCao: true, MayBay: false, TaiKhoan: false, CaiDat: true } },
        { role: 'Điều hành bay', permissions: { ChuyenBay: true, VeChuyenBay: false, BaoCao: false, MayBay: true, TaiKhoan: false, CaiDat: false } },
        { role: 'Nhân viên bán vé', permissions: { ChuyenBay: false, VeChuyenBay: true, BaoCao: false, MayBay: false, TaiKhoan: false, CaiDat: false } },
      ]);
      return "Đã tạo dữ liệu mẫu!";
    }
    return "Dữ liệu đã có sẵn.";
  }
}