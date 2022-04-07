import { Entity, Column } from 'typeorm';
import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
/**
 * @ignore
 */
@Entity('tiposUnidades')
export class TipoUnidadEntity extends CommonEntity {
  @Column({
    name: 'nombre',
    type: 'varchar',
    length: 150,
    nullable: false,
  })
  nombre: string;
}
