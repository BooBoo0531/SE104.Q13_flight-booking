import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Flight } from '../../flights/entities/flight.entity';
import { Seat } from '../../seats/entities/seat.entity';

@Entity({ name: 'MAYBAY' })
export class Airplane {
  @PrimaryGeneratedColumn({ name: 'MaMayBay' })
  id: number;

  @Column({ name: 'TenMayBay' })
  name: string;

  @Column({ name: 'SoHieu' })
  code: string;

  @Column({ name: 'TongSoGhe' })
  totalSeats: number;

  @Column({ name: 'GhePhoThong' })
  economySeats: number;

  @Column({ name: 'GheThuongGia' })
  businessSeats: number;

  @OneToMany(() => Flight, (flight) => flight.plane)
  flights: Flight[];

  @OneToMany(() => Seat, (seat) => seat.airplane)
  seats: Seat[];
}