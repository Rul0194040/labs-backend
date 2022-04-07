import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { Column, Entity, ManyToOne } from 'typeorm';
import { PacienteEntity } from '@sanfrancisco/pacientes/pacientes.entity';
import { ClienteEntity } from '@sanfrancisco/clientes/clientes.entity';

@Entity('direccionesFiscales')
export class DireccionFiscalEntity extends CommonEntity {
  @ManyToOne(() => PacienteEntity, { nullable: true })
  paciente: PacienteEntity;

  @Column({ type: 'int', nullable: true })
  pacienteId: number;

  @ManyToOne(() => ClienteEntity, { nullable: true })
  cliente: ClienteEntity;

  @Column({ type: 'int', nullable: true })
  clienteId: number;

  @Column({ type: 'tinytext', nullable: true })
  contribuyente: string;

  @Column({ type: 'tinytext' })
  rfc: string;

  @Column({ type: 'tinytext' })
  calle: string;

  @Column({ type: 'tinytext', nullable: true })
  numInt: string;

  @Column({ type: 'tinytext' })
  numExt: string;

  @Column({ type: 'tinytext', nullable: true })
  colonia: string;

  @Column({ type: 'tinytext' })
  cp: string;

  @Column({ type: 'tinytext' })
  estado: string;

  @Column({ type: 'tinytext' })
  municipio: string;

  @Column({ type: 'tinytext', nullable: true })
  pais: string;

  //TODO: usar catalogos inegi
}
