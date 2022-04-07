import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { Column, Entity, Generated, ManyToOne } from 'typeorm';
import { SucursalEntity } from './sucursal.entity';

@Entity('apikeys')
export class ApiKeyEntity extends CommonEntity {
  @Column({ type: 'varchar', unique: true })
  @Generated('uuid')
  key: string;

  @Column({ type: 'varchar', nullable: false })
  nombre: string;

  @ManyToOne(() => SucursalEntity, { nullable: false })
  sucursal: SucursalEntity;
}
