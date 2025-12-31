import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Index } from 'typeorm';
import { Flight } from '../../flights/entities/flight.entity';
import { Seat } from '../../seats/entities/seat.entity';

export interface SeatConfig {
  ticketClassId: number;
  name: string;
  prefix: string;
  seatCount: number;
}

@Entity({ name: 'MAYBAY' })
export class Airplane {
  @PrimaryGeneratedColumn({ name: 'MaMayBay' })
  id: number;

  @Column({ name: 'TenMayBay' })
  name: string;

  @Index({ unique: true })
  @Column({ name: 'SoHieu' })
  code: string;

  @Column({ name: 'TongSoGhe' })
  totalSeats: number;

  @Column({ name: 'GhePhoThong' })
  economySeats: number;

  @Column({ name: 'GheThuongGia' })
  businessSeats: number;

  @Column({ name: 'CauHinhGhe', type: 'json', nullable: true })
  seatConfigs: SeatConfig[];

  @OneToMany(() => Flight, (flight) => flight.plane)
  flights: Flight[];

  @OneToMany(() => Seat, (seat) => seat.airplane)
  seats: Seat[];
}