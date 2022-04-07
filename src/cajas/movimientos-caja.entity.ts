import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { TiposMovimientoCaja } from '@sanfrancisco/common/enum/tiposMovimientoCaja.enum';
import { PagoEntity } from '@sanfrancisco/pagos/pagos.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CajaEntity } from './cajas.entity';
import { EstatusMovimientoCancelacionE } from './estatusMovimiento.enum';

@Entity('movimientoscaja')
export class MovimientoCajaEntity extends CommonEntity {
  @ManyToOne(() => CajaEntity, { nullable: false })
  caja: CajaEntity;

  @Column({ type: 'int', nullable: false })
  cajaId: number;

  @ManyToOne(() => PagoEntity, { nullable: true })
  pago?: PagoEntity;

  @Column({ type: 'int', nullable: true })
  pagoId?: number;

  @Column({
    type: 'float',
    default: 0,
  })
  monto: number;

  @Column({
    type: 'varchar',
    length: 1,
    nullable: false,
    default: TiposMovimientoCaja.APERTURA,
  })
  tipoMovimiento: TiposMovimientoCaja;

  @Column({
    type: 'text',
    default: null,
  })
  notas: string;

  @Column({
    type: 'int',
    default: 1,
  })
  estatus: number; //[1vigente, 0cancelado]

  @Column({
    type: 'text',
    nullable: true,
  })
  estatusMovimiento?: EstatusMovimientoCancelacionE;

  @Column({
    type: 'text',
    nullable: true,
  })
  motivoCancelacion?: string;
}
