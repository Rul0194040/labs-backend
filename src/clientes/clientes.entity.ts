import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { TiposConvenios } from '@sanfrancisco/common/enum/tipos-convenios.enum';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('clientes')
export class ClienteEntity extends CommonEntity {
  @Column({
    type: 'varchar',
    length: 20,
  })
  tipoPersona: string; //FISICA, MORAL

  @Column({
    type: 'varchar',
    length: 100,
  })
  nombre: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  descripcion: string;

  @Column({
    type: 'varchar',
    length: 20,
  })
  telefono: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  email: string;

  @Column({
    type: 'int',
    default: 0,
  })
  diasCredito: number;

  @Column({
    type: 'float',
    default: 0,
  })
  descuento: number;

  @Column({
    type: 'varchar',
    length: 20,
    default: TiposConvenios.EMPLEADO,
  })
  tipoConvenio: TiposConvenios;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  codigo: string;

  /**
   * *cuenta* de cliente de pxlab, se requiere en el WS de servicios
   */
  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  cuentaPxLab: string;

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

  @ManyToOne(() => UsersEntity, { nullable: true })
  usuario: UsersEntity;

  @Column({ type: 'int', nullable: true })
  usuarioId: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  stripeId: string;
}
