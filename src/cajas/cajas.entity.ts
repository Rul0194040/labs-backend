import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { SucursalEntity } from '@sanfrancisco/sucursales/sucursal.entity';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { OrigenEntrega } from './DTO/origenEntrega.dto';
import { CorteTesoreroEntity } from '../tesoreros/cortesTesorero/cortesTesorero.entity';

@Entity('cajas')
export class CajaEntity extends CommonEntity {
  @ManyToOne(() => SucursalEntity, { nullable: false })
  sucursal: SucursalEntity;

  @Column({ type: 'int', nullable: true })
  sucursalId?: number;

  @ManyToOne(() => UsersEntity, { nullable: false })
  usuario: UsersEntity;

  @Column({ type: 'int', nullable: true })
  usuarioId?: number;

  @ManyToOne(() => CorteTesoreroEntity, { nullable: true })
  corteTesorero: CorteTesoreroEntity;

  @Column({ type: 'int', nullable: true })
  corteTesoreroId?: number;

  @Column({
    type: 'float',
    default: 0,
  })
  faltante: number;

  @Column({
    type: 'float',
    default: 0,
  })
  montoApertura: number;

  @Column({
    type: 'float',
    default: 0,
  })
  total: number;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  fechaApertura: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  fechaCierre: Date;

  @Column({
    type: 'text',
  })
  notas: string;

  @Column({
    type: 'varchar',
    default: null,
  })
  observacionTesorero: string;

  @Column({
    type: 'varchar',
    default: '',
  })
  estatus: string; //[abierta, cerrada]

  @Column({
    type: 'float',
    default: 0,
  })
  transferencia: number;

  @Column({
    type: 'float',
    default: 0,
  })
  tarjeta: number;

  @Column({
    type: 'float',
    default: 0,
  })
  cheque: number;

  @Column({
    type: 'float',
    default: 0,
  })
  credito: number;

  // arqueo inicio -------
  @Column({
    type: 'float',
    default: 0,
  })
  mxn05: number;

  @Column({
    type: 'float',
    default: 0,
  })
  mxn1: number;

  @Column({
    type: 'float',
    default: 0,
  })
  mxn2: number;

  @Column({
    type: 'float',
    default: 0,
  })
  mxn5: number;

  @Column({
    type: 'float',
    default: 0,
  })
  mxn10: number;

  @Column({
    type: 'float',
    default: 0,
  })
  mxn20: number;

  @Column({
    type: 'float',
    default: 0,
  })
  mxn50: number;

  @Column({
    type: 'float',
    default: 0,
  })
  mxn100: number;

  @Column({
    type: 'float',
    default: 0,
  })
  mxn200: number;

  @Column({
    type: 'float',
    default: 0,
  })
  mxn500: number;

  @Column({
    type: 'float',
    default: 0,
  })
  mxn1000: number;

  @Column({
    type: 'float',
    default: 0,
  })
  arqTransferencia: number;

  @Column({
    type: 'float',
    default: 0,
  })
  arqTarjeta: number;

  @Column({
    type: 'float',
    default: 0,
  })
  arqCheque: number;

  @Column({
    type: 'float',
    default: 0,
  })
  arqCredito: number;

  @Column({
    type: 'float',
    default: 0,
  })
  totalArqueo: number;

  @Column({
    type: 'text',
    default: null,
  })
  notasArqueo?: string;

  @Column({
    type: 'text',
    default: null,
  })
  origenEntrega?: OrigenEntrega; // ENUM --> BANCO, MATRIZ

  @Column({
    type: 'text',
    default: null,
  })
  referencia?: string;

  @Column({
    type: 'text',
    default: null,
  })
  recibio?: string;
}
