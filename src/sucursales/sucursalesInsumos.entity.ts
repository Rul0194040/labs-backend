import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { InsumoEntity } from '@sanfrancisco/insumos/insumo.entity';
import { LoteEntity } from '@sanfrancisco/lotes/lotes.entity';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { SucursalEntity } from './sucursal.entity';

@Entity('sucursalesInsumos')
@Index(['sucursal', 'insumo', 'lote'], { unique: true })
export class SucursalesInsumosEntity extends CommonEntity {
  @ManyToOne(() => SucursalEntity, { nullable: false })
  sucursal: SucursalEntity;

  @ManyToOne(() => InsumoEntity, { nullable: false })
  insumo: InsumoEntity;

  @ManyToOne(() => LoteEntity, { nullable: true })
  lote: LoteEntity; //1, //2

  @Column({ type: 'float', nullable: false }) //10, 5
  existencia: number; //si este insumo caduca, debe tener relaciones de proveedor, lote, cantidad con su fecha de caducidad

  @Column({ type: 'float', nullable: true, default: 0 })
  promedio: number;

  @Column({ type: 'float', nullable: true, default: 0 })
  minimo: number;

  @Column({ type: 'float', nullable: true, default: 0 })
  maximo: number;

  @Column({ type: 'varchar', nullable: true, length: 50 })
  ubicacion: string;
}
/*
const response = [
  {
    insumo,
    existencia, //total
    minimo,
    maximo,
    lotes: [
      {
        loteId: 1,
        cantidad: 10,
      },
      {
        loteId: 2,
        cantidad: 5,
      },
    ],
  },
];
*/
