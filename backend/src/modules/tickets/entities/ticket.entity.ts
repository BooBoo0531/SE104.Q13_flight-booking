import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
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

  @ManyToOne(() => Flight, (flight) => flight.tickets)
  @JoinColumn({ name: 'MaChuyenBay' })
  flight: Flight;

  @ManyToOne(() => Booking, (booking) => booking.tickets)
  @JoinColumn({ name: 'MaPhieuDat' })
  booking: Booking;
}
