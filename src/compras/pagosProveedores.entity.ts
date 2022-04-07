import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { TiposPago } from '@sanfrancisco/pagos/tipoPagos.enum';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CompraEntity } from './compras.entity';
@Entity('pagosProveedores')
export class PagoProveedorEntity extends CommonEntity {
  @ManyToOne(() => CompraEntity)
  compra: CompraEntity;

  @Column({ type: 'int', nullable: true })
  compraId?: number;

  @Column({
    type: 'varchar',
    length: 50,
    default: TiposPago.EFECTIVO,
  })
  tipo: TiposPago;

  @Column({
    type: 'varchar',
    length: 100,
  })
  referencia: string;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  fecha: Date;

  @Column({
    type: 'float',
    nullable: false,
  })
  monto: number;

  @Column({
    type: 'int',
    default: 1,
  })
  estatus: number; //0->Cancelado, 1->vigente
}
