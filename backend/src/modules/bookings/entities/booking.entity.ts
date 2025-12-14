import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';

@Entity({ name: 'PHIEUDATCHO' })
export class Booking {
  @PrimaryGeneratedColumn({ name: 'MaPhieuDat' })
  id: number;

  @Column({ name: 'MaDatCho' })
  bookingCode: string;

  @CreateDateColumn({ name: 'NgayDat' })
  bookingDate: Date;

  @Column({ name: 'TinhTrang', default: 'confirmed' })
  status: string;

  @Column({ name: 'TongTien' })
  totalPrice: number;

  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: 'MaNguoiDungDat' })
  user: User;

  @OneToMany(() => Ticket, (ticket) => ticket.booking)
  tickets: Ticket[];
}