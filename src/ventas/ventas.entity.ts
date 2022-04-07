import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { SucursalEntity } from '@sanfrancisco/sucursales/sucursal.entity';
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { PagoEntity } from '@sanfrancisco/pagos/pagos.entity';
import { CajaEntity } from '@sanfrancisco/cajas/cajas.entity';
import { FacturaEntity } from '../facturas/facturas.entity';
import { EstadosVentas } from './estadosVentas.enum';
import { ZonaEnum } from '@sanfrancisco/sucursales/zona.enum';
import { EstadosCancelacionVenta } from './estadosCancelacion.enum';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { PacienteEntity } from '../pacientes/pacientes.entity';
import { ClienteEntity } from '@sanfrancisco/clientes/clientes.entity';
import { DireccionFiscalEntity } from './direcciones-fiscales/direccionesFiscales.entity';
import { MedicoEntity } from '@sanfrancisco/medicos/medico.entity';
import { TipoPrecio } from './tipoPrecio.enum';
@Entity('ventas')
export class VentaEntity extends CommonEntity {
  @ManyToOne(() => SucursalEntity, { nullable: true })
  sucursal: SucursalEntity;

  @Column({ type: 'int', nullable: true })
  sucursalId: number;

  @ManyToOne(() => MedicoEntity, { nullable: true })
  medico: MedicoEntity;

  @Column({ type: 'int', nullable: true })
  medicoId: number;

  @ManyToOne(() => CajaEntity, { nullable: true })
  caja: CajaEntity;

  @Column({ type: 'int', nullable: true })
  cajaId: number;

  @ManyToOne(() => ClienteEntity, { nullable: true })
  cliente: ClienteEntity; //(patch)

  @Column({ type: 'int', nullable: true })
  clienteId: number;

  @ManyToOne(() => DireccionFiscalEntity, { nullable: true })
  direccionFiscal: DireccionFiscalEntity; //(patch)

  @Column({ type: 'int', nullable: true })
  direccionFiscalId: number;

  @ManyToOne(() => PacienteEntity, { nullable: true })
  paciente: PacienteEntity; //(patch)

  @Column({ type: 'int', nullable: true })
  pacienteId: number;

  @OneToMany(() => PagoEntity, (pago) => pago.venta)
  pagos: PagoEntity;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  fecha: Date;

  @Column({
    type: 'text',
    default: null,
  })
  notas: string;

  @Column('float', {
    default: 0,
  })
  efectivoRecibido: number;

  @Column({
    type: 'float',
    default: 0,
  })
  cambio: number;

  @Column({
    type: 'float',
    default: 0,
  })
  descuento: number;

  @Column({
    type: 'float',
    default: 0,
  })
  descuentoPesos: number;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  zona: ZonaEnum;

  @Column({
    type: 'varchar',
    length: 1,
    default: EstadosVentas.BORRADOR,
  })
  estatus: EstadosVentas;
  //0->Borrador, es nueva, puedo editar el cliente y los servicios (modificar cliente, servicios y pacientes)
  //1->En proceso, (generarle pagos, insumos(y cierres), notas(bitacora), resultados)
  //2->Finalizada, esta pagada, tiene todos los resultados (agregar factura, descarga de resultados)
  //3->Cancelada, (ya no suma a los reportes).

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  estatusCancelacion: EstadosCancelacionVenta;

  @Column({
    type: 'text',
    nullable: true,
  })
  motivoCancelacion: string;

  @Column({ type: 'varchar', length: 16, default: null })
  folio: string; //se genera cuando la venta deja de ser borrador.
  //000 sucursal
  //+idVenta

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
  pagado: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  facturado: boolean;

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

  @OneToOne(() => FacturaEntity, { nullable: true })
  factura: FacturaEntity;

  @Column({ type: 'int', nullable: true })
  facturaId: number;

  @ManyToOne(() => UsersEntity, { nullable: true })
  usuarioCancelo: UsersEntity;

  @Column({ type: 'int', nullable: true })
  usuarioCanceloId: number;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  fechaLimiteCredito: Date;

  @Column({ type: 'varchar', length: 8, nullable: true })
  folioPxLab: string;

  @Column({ type: 'boolean', default: false })
  estudioPx: boolean;

  @ManyToOne(() => UsersEntity, { nullable: true })
  autorizoDescuento: UsersEntity;

  @Column({ type: 'int', nullable: true })
  autorizoDescuentoId: number;

  @Column({ type: 'text', nullable: true })
  notaDescuento: string;

  @ManyToOne(() => UsersEntity, { nullable: true })
  captador: UsersEntity;

  @Column({ type: 'int', nullable: true })
  captadorId: number;

  @ManyToOne(() => UsersEntity, { nullable: true })
  vendedor: UsersEntity;

  @Column({ type: 'int', nullable: true })
  vendedorId: number;

  @ManyToOne(() => UsersEntity, { nullable: true })
  maquilador: UsersEntity;

  @Column({ type: 'int', nullable: true })
  maquiladorId: number;

  @Column({ type: 'date', nullable: true, default: null })
  fechaUltimaRegla: Date;

  @Column({ type: 'text', default: null, nullable: true })
  observaciones: string;

  @Column({ type: 'text', default: null, nullable: true })
  diagnostico: string;

  @Column({ type: 'varchar', length: 8, default: '' })
  acceso: string;

  @Column({ type: 'varchar', length: 10, default: TipoPrecio.REGULAR })
  tipoPrecio: TipoPrecio;
}
