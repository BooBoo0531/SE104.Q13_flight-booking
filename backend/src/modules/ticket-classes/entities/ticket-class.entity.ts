import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'HANGVE' })
export class TicketClass {
  @PrimaryGeneratedColumn({ name: 'MaHangVe' })
  id: number;

  @Column({ name: 'TenHangVe' })
  name: string;

  @Column('float', { name: 'TyLeGia' })
  priceRatio: number;
}