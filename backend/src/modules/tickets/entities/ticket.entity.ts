import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Flight } from '../../flights/entities/flight.entity';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity({ name: 'VE' })
export class Ticket {
  @PrimaryGeneratedColumn({ name: 'MaVe' })
  id: number;

  @Column({ name: 'MaVeHienThi', unique: true })
  ticketId: string;

  @Column({ name: 'SoGhe' })
  seat: string;

  @Column({ name: 'HangVe' })
  seatClass: string;

  @Column({ name: 'GiaTien' })
  price: number;

  @Column({ name: 'TenHanhKhach' })
  passengerName: string;

  // ✅ Thêm 3 field theo UI Vé máy bay
  @Column({ name: 'CCCD', nullable: true })
  idCard?: string;

  @Column({ name: 'SoDienThoai', nullable: true })
  phone?: string;

  @Column({ name: 'Email', nullable: true })
  email?: string;

  @ManyToOne(() => Flight, (flight) => flight.tickets, { nullable: false })
  @JoinColumn({ name: 'MaChuyenBay' })
  flight: Flight;

  // Cho phép null vì admin tạo vé trực tiếp không cần phiếu đặt
  @ManyToOne(() => Booking, (booking) => booking.tickets, { nullable: true })
  @JoinColumn({ name: 'MaPhieuDat' })
  booking: Booking | null;
}
