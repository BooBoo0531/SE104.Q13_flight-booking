import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity'; 

@Entity({ name: 'PHANQUYEN' })
export class RolePermission {
  @PrimaryColumn({ name: 'TenNhomQuyen' }) 
  role: string; 

  @Column({ type: 'jsonb', name: 'DanhSachQuyen', nullable: true }) 
  permissions: any; 

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}