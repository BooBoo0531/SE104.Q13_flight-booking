import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'THAMSO' })
export class Setting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'TGBayToiThieu', default: 30 })
  minFlightTime: number;

  @Column({ name: 'SoSanBayTGToiDa', default: 2 })
  maxIntermediateAirports: number;

  @Column({ name: 'TGDungToiThieu', default: 10 })
  minStopoverTime: number;

  @Column({ name: 'TGDungToiDa', default: 20 })
  maxStopoverTime: number;

  @Column({ name: 'TGChamNhatDatVe', default: 12 })
  latestBookingTime: number;

  @Column({ name: 'TGHuyDatVe', default: 1 })
  latestCancellationTime: number;
}