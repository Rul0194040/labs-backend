import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { InsumoEntity } from '@sanfrancisco/insumos/insumo.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { MovimientosAlmacenEntity } from './movimientosAlmacen.entity';
import { ProveedorEntity } from '@sanfrancisco/catalogos/proveedores/proveedores.entity';
import { LoteEntity } from '@sanfrancisco/lotes/lotes.entity';

@Entity('detalleMovimientos')
export class DetalleMovimientosEntity extends CommonEntity {
  @ManyToOne(() => MovimientosAlmacenEntity, { nullable: false })
  movimiento: MovimientosAlmacenEntity; //id del movimiento padre
  @Column({ type: 'int', nullable: false })
  movimientoId: number;

  @ManyToOne(() => InsumoEntity, { nullable: true })
  insumo: InsumoEntity;

  @Column({ type: 'int', nullable: true })
  insumoId: number;

  @Column({
    type: 'float',
  })
  cantidad: number;

  @Column({
    type: 'float',
    default: 0,
  })
  costo: number;

  @Column({
    type: 'float',
    default: 0,
  })
  cantidadRecibida: number;

  @Column({
    type: 'text',
    default: null,
  })
  nota: string;

  @ManyToOne(() => LoteEntity, { nullable: true })
  lote: LoteEntity;

  @Column({ type: 'int', nullable: true })
  loteId: number;

  @ManyToOne(() => ProveedorEntity, { nullable: true })
  proveedor: ProveedorEntity;

  @Column({ type: 'int', nullable: true })
  proveedorId: number;
}
