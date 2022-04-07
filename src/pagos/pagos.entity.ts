import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { Column, Entity, ManyToOne } from 'typeorm';
import { VentaEntity } from '@sanfrancisco/ventas/ventas.entity';
import { CajaEntity } from '@sanfrancisco/cajas/cajas.entity';
import { TiposPago } from './tipoPagos.enum';
@Entity('pagos')
export class PagoEntity extends CommonEntity {
  @ManyToOne(() => VentaEntity)
  venta: VentaEntity;

  @Column({ type: 'int', nullable: true })
  ventaId?: number;

  @ManyToOne(() => CajaEntity, { nullable: true })
  caja: CajaEntity;

  @Column({ type: 'int', nullable: true })
  cajaId?: number;

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
  estatus: number; //0->Cancelada, 1->vigente

  @Column({
    type: 'float',
    default: 0,
  })
  efectivoRecibido: number;

  @Column({
    type: 'float',
    default: 0,
  })
  cambio: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  cobranza: boolean;
}
