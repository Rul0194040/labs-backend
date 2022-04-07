import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { SucursalEntity } from '@sanfrancisco/sucursales/sucursal.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { TareasEstatus } from './tareas-estatus.enum';

@Entity('tareas')
export class TareasEntity extends CommonEntity {
  @Column({ type: 'varchar', length: 50 })
  event: string;

  @Column({ type: 'varchar', length: 100 })
  channel: string;

  @Column({ type: 'json' })
  data: any;

  @ManyToOne(() => SucursalEntity, { nullable: true })
  sucursal: SucursalEntity;
  @Column({ type: 'int', nullable: true })
  sucursalId: number;

  @Column({ type: 'int', default: 0 })
  status: TareasEstatus;
}
