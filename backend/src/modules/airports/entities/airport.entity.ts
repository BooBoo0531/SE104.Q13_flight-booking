import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Flight } from '../../flights/entities/flight.entity';

@Entity({ name: 'SANBAY' })
export class Airport {
  @PrimaryGeneratedColumn({ name: 'MaSanBay' })
  id: number;

  @Column({ name: 'TenSanBay' })
  name: string;

  @Column({ name: 'MaCode', unique: true })
  code: string;

  @Column({ name: 'TenThanhPho' })
  city: string;

  @Column({ name: 'QuocGia' })
  country: string;

  @OneToMany(() => Flight, (flight) => flight.fromAirport)
  departingFlights: Flight[];

  @OneToMany(() => Flight, (flight) => flight.toAirport)
  arrivingFlights: Flight[];
}