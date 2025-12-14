import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Airplane } from '../../airplanes/entities/airplane.entity';
import { TicketClass } from '../../ticket-classes/entities/ticket-class.entity';

@Entity({ name: 'GHE' })
export class Seat {
  @PrimaryGeneratedColumn({ name: 'MaGhe' })
  id: number;

  @Column({ name: 'SoGhe' })
  code: string;

  @ManyToOne(() => Airplane, (plane) => plane.seats)
  @JoinColumn({ name: 'MaMayBay' })
  airplane: Airplane;

  @ManyToOne(() => TicketClass)
  @JoinColumn({ name: 'MaHangVe' })
  class: TicketClass;
}