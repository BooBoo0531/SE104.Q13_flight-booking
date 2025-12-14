import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';

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

  @Column({ default: 'user', name: 'VaiTro' }) 
  role: string;

  // Một người có nhiều phiếu đặt chỗ
  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];
}