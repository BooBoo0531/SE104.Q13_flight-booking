import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';
import { RolePermission } from '../../users/entities/role-permission.entity';

@Entity({ name: 'NGUOIDUNG' })
export class User {
  @PrimaryGeneratedColumn({ name: 'MaNguoiDung' })
  id: number;

  @Column({ name: 'HoTen' })
  name: string;

  @Column({ name: 'Email', unique: true })
  email: string;

  @Column({ name: 'MatKhau' })
  password: string;

  @Column({ name: 'SoDienThoai', nullable: true })
  phone: string;

  @ManyToOne(() => RolePermission, (rolePermission) => rolePermission.users)
  @JoinColumn({ name: 'VaiTro' }) 
  role: RolePermission;

  @Column({ type: 'varchar', name: 'ResetPasswordToken', nullable: true })
  resetPasswordToken?: string | null;

  @Column({ type: 'timestamp', name: 'ResetPasswordExpires', nullable: true })
  resetPasswordExpires?: Date | null;

  // Một người có nhiều phiếu đặt chỗ
  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];
}