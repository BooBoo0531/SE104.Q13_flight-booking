import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Flight } from '../../flights/entities/flight.entity';
import { TicketClass } from '../../ticket-classes/entities/ticket-class.entity';

@Entity({ name: 'CT_HANGVE' })
export class FlightTicketClass {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Flight, (flight) => flight.ticketClassDetails)
  @JoinColumn({ name: 'MaChuyenBay' })
  flight: Flight;

  @ManyToOne(() => TicketClass)
  @JoinColumn({ name: 'MaHangVe' })
  ticketClass: TicketClass;

  @Column({ name: 'GiaTien' })
  price: number;

  @Column({ name: 'TongSoGhe' })
  totalSeats: number;

  @Column({ name: 'SoGheDaBan', default: 0 })
  soldSeats: number;
}