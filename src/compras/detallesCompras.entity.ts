import { TipoUnidadEntity } from '@sanfrancisco/catalogos/tipos-unidades/tipos-unidades.entity';
import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { InsumoEntity } from '@sanfrancisco/insumos/insumo.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CompraEntity } from './compras.entity';

@Entity('detallesCompras')
export class DetalleCompraEntity extends CommonEntity {
  @ManyToOne(() => InsumoEntity, { nullable: false })
  insumo: InsumoEntity;

  @Column({ type: 'int', nullable: true })
  insumoId?: number;

  @ManyToOne(() => CompraEntity, { nullable: false })
  compra: CompraEntity;

  @Column({ type: 'int', nullable: false })
  compraId: number;

  @ManyToOne(() => TipoUnidadEntity, { nullable: false })
  tipoUnidad: TipoUnidadEntity;

  @Column({ type: 'int', nullable: true })
  tipoUnidadId?: number;

  @Column({
    name: 'clave',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  clave: string;

  @Column({
    type: 'float',
    default: 0,
  })
  cantidad: number;

  @Column({
    type: 'float',
    default: 0,
  })
  precio: number;

  @Column({
    type: 'float',
    default: 0,
  })
  subtotal: number;

  @Column({
    type: 'float',
    default: 0,
  })
  total: number;

  @Column({
    type: 'float',
    default: 0,
  })
  descuento: number;
}
