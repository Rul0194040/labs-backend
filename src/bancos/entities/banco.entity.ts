import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { Column, Entity } from 'typeorm';

@Entity('bancos')
export class BancoEntity extends CommonEntity {
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  nombre: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  telefono: string;
}
