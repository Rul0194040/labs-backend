import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { Column, Entity } from 'typeorm';
import { UnidadesDescuento } from '../../unidades-descuento.enum';

@Entity('incidencias')
export class IncidenciaEntity extends CommonEntity {
  @Column({
    type: 'tinytext',
    nullable: false,
  })
  nombre: string;

  @Column({
    type: 'float',
    default: 1,
  })
  requeridas: number;

  @Column({
    type: 'float',
    default: 1,
  })
  descuento: number;

  @Column({
    type: 'varchar',
    length: 10,
    default: UnidadesDescuento.DIAS,
  })
  unidadDescuento: UnidadesDescuento;
}
