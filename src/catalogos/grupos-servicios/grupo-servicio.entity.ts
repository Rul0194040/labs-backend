import { Entity, Column } from 'typeorm';
import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
/**
 * @ignore
 */
@Entity('gruposServicios')
export class GrupoServicioEntity extends CommonEntity {
  @Column({
    name: 'nombre',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  nombre: string;
}
