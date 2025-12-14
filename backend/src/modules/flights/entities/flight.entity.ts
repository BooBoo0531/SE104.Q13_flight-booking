import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Airplane } from '../../airplanes/entities/airplane.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { Airport } from '../../airports/entities/airport.entity';
import { IntermediateAirport } from '../../intermediate-airports/entities/intermediate-airport.entity';
import { FlightTicketClass } from '../../flight-ticket-classes/entities/flight-ticket-class.entity';

@Entity({ name: 'CHUYENBAY' })
export class Flight {
  @PrimaryGeneratedColumn({ name: 'MaChuyenBay' })
  id: number;

  @Column({ name: 'MaSoChuyenBay', unique: true }) // FlightCode
  flightCode: string;

  @Column({ name: 'NgayGioBay' })
  startTime: Date;

  @Column({ name: 'NgayVe' })
  endTime: Date;

  @Column({ name: 'TGBay' })
  duration: number;

  @Column({ name: 'GiaVeGoc' })
  price: number;

  @Column({ name: 'TongSoGhe' })
  totalSeats: number;

  @Column({ name: 'SoGheTrong' })
  availableSeats: number;

  @Column({ name: 'TrangThai', default: 'active' })
  status: string;

  // --- QUAN HỆ (Sửa JoinColumn) ---
  @ManyToOne(() => Airport, (airport) => airport.departingFlights)
  @JoinColumn({ name: 'MaSanBayDi' })
  fromAirport: Airport;

  @ManyToOne(() => Airport, (airport) => airport.arrivingFlights)
  @JoinColumn({ name: 'MaSanBayDen' })
  toAirport: Airport;

  @ManyToOne(() => Airplane, (plane) => plane.flights)
  @JoinColumn({ name: 'MaMayBay' })
  plane: Airplane;

  @OneToMany(() => Ticket, (ticket) => ticket.flight)
  tickets: Ticket[];

  @OneToMany(() => IntermediateAirport, (inter) => inter.flight)
  intermediates: IntermediateAirport[];

  @OneToMany(() => FlightTicketClass, (details) => details.flight)
  ticketClassDetails: FlightTicketClass[];
}