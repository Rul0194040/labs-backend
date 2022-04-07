import { Column, Entity } from 'typeorm';
import { CommonEntity } from '../common/commonEntity.abstract';

@Entity('medicos')
export class MedicoEntity extends CommonEntity {
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  nombre: string;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  telefono: string;
}
