import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PHANQUYEN' })
export class RolePermission {
  @PrimaryColumn({ name: 'TenNhomQuyen' }) 
  role: string; 

  @Column({ type: 'jsonb', name: 'DanhSachQuyen', nullable: true }) 
  permissions: any; 
}