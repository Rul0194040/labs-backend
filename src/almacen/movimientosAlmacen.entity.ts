import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { SucursalEntity } from '@sanfrancisco/sucursales/sucursal.entity';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { DetalleMovimientosEntity } from './detalleMovimientos.entity';
import { EstatusMovimiento } from './estatusMovimiento.enum';
import { TiposMovimiento } from './tiposMovimiento.enum';

@Entity('movimientosAlmacen')
export class MovimientosAlmacenEntity extends CommonEntity {
  @ManyToOne(() => SucursalEntity, { nullable: false })
  sucursalOrigen: SucursalEntity; //ID DE LA SUCURSAL que envia, o da de baja
  @Column({ type: 'int', nullable: false })
  sucursalOrigenId?: number;

  @ManyToOne(() => SucursalEntity, { nullable: true })
  sucursalDestino: SucursalEntity; //NULL O SUCURSAL QUE RECIBE
  @Column({ type: 'int', nullable: true })
  sucursalDestinoId?: number;

  @Column({
    type: 'varchar',
    length: 50,
  })
  tipoMovimiento: TiposMovimiento; //ALTA, BAJA(MERMA), MOVIMIENTO -ENUM

  @ManyToOne(() => UsersEntity, { nullable: false })
  usuario: UsersEntity;
  @Column({ type: 'int', nullable: false })
  usuarioId: number;

  @OneToMany(() => DetalleMovimientosEntity, (d) => d.movimiento)
  detalle: DetalleMovimientosEntity;

  @Column({
    type: 'varchar',
    length: 20,
    default: EstatusMovimiento.TRANSITO,
  })
  estatus: EstatusMovimiento; //TRANSITO, FINALIZADO -ENUM

  @Column({
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  fecha: Date;

  @Column({
    type: 'text',
  })
  notas: string;
}
