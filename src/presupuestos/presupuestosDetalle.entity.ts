import { ProveedorEntity } from '@sanfrancisco/catalogos/proveedores/proveedores.entity';
import { TipoUnidadEntity } from '@sanfrancisco/catalogos/tipos-unidades/tipos-unidades.entity';
import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { InsumoEntity } from '@sanfrancisco/insumos/insumo.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { PresupuestoEntity } from './presupuesto.entity';

@Entity('presupuestosDetalle')
export class PresupuestoDetalleEntity extends CommonEntity {
  @ManyToOne(() => PresupuestoEntity, { nullable: false })
  presupuesto: PresupuestoEntity;
  @Column({ type: 'int', nullable: false })
  presupuestoId: number;
  @ManyToOne(() => InsumoEntity, { nullable: false })
  insumo: InsumoEntity;
  @Column({ type: 'int', nullable: false })
  insumoId: number;
  @ManyToOne(() => TipoUnidadEntity, { nullable: false })
  tipoUnidad: TipoUnidadEntity;
  @Column({ type: 'int', nullable: false })
  tipoUnidadId: number;
  @ManyToOne(() => ProveedorEntity, { nullable: true })
  proveedor1: ProveedorEntity;
  @Column({ type: 'int', nullable: true })
  proveedor1Id: number;
  @ManyToOne(() => ProveedorEntity, { nullable: true })
  proveedor2: ProveedorEntity;
  @Column({ type: 'int', nullable: true })
  proveedor2Id: number;
  @ManyToOne(() => ProveedorEntity, { nullable: true })
  proveedor3: ProveedorEntity;
  @Column({ type: 'int', nullable: true })
  proveedor3Id: number;
  @ManyToOne(() => ProveedorEntity, { nullable: true })
  proveedorSeleccionado: ProveedorEntity;
  @Column({ type: 'int', nullable: true })
  proveedorSeleccionadoId: number;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  fechaPromesa: Date;

  @Column({
    type: 'float',
    default: 0,
  })
  precio1: number;

  @Column({
    type: 'float',
    default: 0,
  })
  precio2: number;

  @Column({
    type: 'float',
    default: 0,
  })
  precio3: number;

  @Column({
    type: 'float',
    default: 0,
  })
  descuento1: number;

  @Column({
    type: 'float',
    default: 0,
  })
  descuento2: number;

  @Column({
    type: 'float',
    default: 0,
  })
  descuento3: number;

  @Column({
    type: 'float',
    default: 0,
  })
  precioSeleccionado: number;

  @Column({
    type: 'float',
    default: 0,
  })
  cantidad: number;
}
