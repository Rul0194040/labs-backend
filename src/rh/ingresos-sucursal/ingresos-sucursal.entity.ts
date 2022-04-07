import { PacienteEntity } from './../../pacientes/pacientes.entity';
import { BancoEntity } from '@sanfrancisco/bancos/entities/banco.entity';
import { CajaEntity } from '@sanfrancisco/cajas/cajas.entity';
import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { SucursalEntity } from '@sanfrancisco/sucursales/sucursal.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('ingresos-sucursales')
export class IngresoSucursalEntity extends CommonEntity {
  @ManyToOne(() => SucursalEntity, { nullable: false })
  sucursal: SucursalEntity;

  @Column({ type: 'int', nullable: false })
  sucursalId?: number;

  @ManyToOne(() => CajaEntity, { nullable: false })
  caja: CajaEntity;

  @Column({ type: 'int', nullable: true })
  cajaId?: number;

  @ManyToOne(() => BancoEntity, { nullable: false })
  banco: BancoEntity;

  @Column({ type: 'int', nullable: true })
  bancoId?: number;

  @ManyToOne(() => PacienteEntity, { nullable: true })
  paciente: PacienteEntity;

  @Column({ type: 'int', nullable: true })
  pacienteId?: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  estudioPxLab: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  ingreso: number;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  gasto: number;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  vaucher: string;
}
