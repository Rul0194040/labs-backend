import { ProveedorEntity } from '@sanfrancisco/catalogos/proveedores/proveedores.entity';
import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { PresupuestoEntity } from '@sanfrancisco/presupuestos/presupuesto.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { EstatusCompra } from './EstatusCompra.enum';
import { PagoProveedorEntity } from './pagosProveedores.entity';

@Entity('compras')
export class CompraEntity extends CommonEntity {
  @ManyToOne(() => ProveedorEntity, { nullable: false })
  proveedor: ProveedorEntity;
  @Column({ type: 'int', nullable: false })
  proveedorId: number;

  @ManyToOne(() => PresupuestoEntity, { nullable: true })
  presupuesto: PresupuestoEntity;

  @Column({ type: 'int', nullable: true })
  presupuestoId?: number;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  fecha: Date;

  @Column({
    name: 'folio',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  folio: string;

  @Column({
    type: 'int',
    default: 0,
  })
  numCotizacion: number;

  @Column({
    type: 'float',
    default: 0,
  })
  descuento: number;

  @Column({
    type: 'varchar',
    length: 1,
    nullable: false,
    default: EstatusCompra.BORRADOR,
  })
  estatus: EstatusCompra;

  @Column({
    type: 'float',
    default: 0,
  })
  total: number;

  @Column({
    type: 'float',
    default: 0,
  })
  saldo: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  conClave: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  pagado: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  credito: boolean;

  @Column({
    type: 'int',
    default: 0,
  })
  diasCredito: number;

  @Column({
    name: 'pathCotizacion',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  pathCotizacion: string;

  @OneToMany(() => PagoProveedorEntity, (pago) => pago.compra)
  pagos: PagoProveedorEntity;
}
