import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { Column, Entity } from 'typeorm';
@Entity('tiposInsumos')
export class TipoInsumoEntity extends CommonEntity {
  @Column({
    type: 'varchar',
    length: 100,
  })
  nombre: string;
}
