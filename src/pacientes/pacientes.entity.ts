import { ClienteEntity } from '@sanfrancisco/clientes/clientes.entity';
import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { Column, Entity, ManyToOne } from 'typeorm';
import { SexoPaciente } from './sexoPaciente.enum';
import { UsersEntity } from '../users/users.entity';
@Entity('pacientes')
export class PacienteEntity extends CommonEntity {
  @ManyToOne(() => ClienteEntity)
  cliente: ClienteEntity;

  @Column({ type: 'int', nullable: true })
  clienteId?: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  nombre: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  apellidoPaterno: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  apellidoMaterno: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    default: '',
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    default: '',
  })
  telefono: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    default: '',
  })
  descripcion: string;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  fechaNacimiento: Date;

  @Column({
    type: 'date',
    nullable: true,
    default: null,
  })
  fechaNac: Date;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  sexo: SexoPaciente;

  @ManyToOne(() => UsersEntity, { nullable: true })
  usuario: UsersEntity;

  @Column({ type: 'int', nullable: true })
  usuarioId: number;
}
