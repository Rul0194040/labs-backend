import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { UnidadesDescuento } from '@sanfrancisco/rh/unidades-descuento.enum';
import { Column, Entity } from 'typeorm';

@Entity('incentivos')
export class IncentivoEntity extends CommonEntity {
  @Column({
    type: 'tinytext',
    nullable: false,
  })
  nombre: string;

  @Column({
    type: 'float',
    default: 1,
  })
  cantidad: number; //cantidad de dias o pesos que vale este incentivo

  @Column({
    type: 'varchar',
    length: 10,
    default: UnidadesDescuento.DIAS,
  })
  unidad: UnidadesDescuento;
}
