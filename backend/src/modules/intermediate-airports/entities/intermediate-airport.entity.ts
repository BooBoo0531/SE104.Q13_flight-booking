import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Flight } from '../../flights/entities/flight.entity';
import { Airport } from '../../airports/entities/airport.entity';

@Entity({ name: 'TRUNGGIAN' })
export class IntermediateAirport {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Flight, (flight) => flight.intermediates)
  @JoinColumn({ name: 'MaChuyenBay' })
  flight: Flight;

  @ManyToOne(() => Airport)
  @JoinColumn({ name: 'MaSanBayTG' })
  airport: Airport;

  @Column({ name: 'TGDung' })
  duration: number;

  @Column({ name: 'GhiChu', nullable: true })
  note: string;
}