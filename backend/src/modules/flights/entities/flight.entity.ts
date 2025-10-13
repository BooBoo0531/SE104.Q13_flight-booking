import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Flight {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  flightNumber: string;

  @Column()
  origin: string;

  @Column()
  destination: string;

  @Column('timestamp')
  departureTime: Date;

  @Column('int')
  seats: number;
}
