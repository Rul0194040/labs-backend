import { BancoEntity } from '@sanfrancisco/bancos/entities/banco.entity';
import { CuentaBancariaEntity } from '@sanfrancisco/bancos/entities/cuenta-bancaria.entity';
import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { EsquemaPagoEntity } from '@sanfrancisco/rh/esquema-pago.entity';
import { JornadaEntity } from '@sanfrancisco/rh/jornada.entity';
import { PuestoEntity } from '@sanfrancisco/rh/puestos-departamentos/entity/puesto.entity';
import { SucursalEntity } from '@sanfrancisco/sucursales/sucursal.entity';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('contratos')
export class ContratoEntity extends CommonEntity {
  @ManyToOne(() => UsersEntity, { nullable: false })
  empleado: UsersEntity;

  @ManyToOne(() => PuestoEntity, { nullable: false })
  puesto: PuestoEntity;

  @Column({ type: 'date', nullable: false })
  fecha: Date;

  @Column({ type: 'int', default: 0 })
  numero: number;

  @ManyToOne(() => SucursalEntity, { nullable: true })
  sucursal: SucursalEntity;

  @ManyToOne(() => EsquemaPagoEntity, { nullable: false })
  esquemaPago: EsquemaPagoEntity;

  @ManyToOne(() => JornadaEntity, { nullable: false })
  jornada: JornadaEntity;

  @ManyToOne(() => CuentaBancariaEntity, { nullable: false })
  cuentaPago: CuentaBancariaEntity;

  @ManyToOne(() => BancoEntity, { nullable: true })
  cuentaDepositoBanco: BancoEntity;

  @Column({ type: 'varchar', default: '', length: 100 })
  cuentaDepositoCuenta: string;

  @Column({ type: 'float', nullable: false })
  sueldoReal: number;

  @Column({ type: 'float', nullable: false })
  sueldoContratado: number;

  @Column({ type: 'float', nullable: false })
  fondoAhorro: number;
}
