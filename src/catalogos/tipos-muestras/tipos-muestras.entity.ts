import { Entity, Column } from 'typeorm';
import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
/**
 * @ignore
 */
@Entity('tiposMuestras')
export class TipoMuestraEntity extends CommonEntity {
  @Column({
    name: 'nombre',
    type: 'varchar',
    length: 150,
    nullable: false,
  })
  nombre: string;
}
