import { SucursalEntity } from '@sanfrancisco/sucursales/sucursal.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from './users.entity';

@Entity('userSucursales')
export class UserSucursalesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UsersEntity)
  user: UsersEntity;

  @ManyToOne(() => SucursalEntity)
  sucursal: SucursalEntity;

  @Column({ type: 'boolean', default: false })
  responsable: boolean;
}
