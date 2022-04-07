import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { Column, Entity } from 'typeorm';

@Entity('lotes')
export class LoteEntity extends CommonEntity {
  @Column({
    name: 'numero',
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
  })
  numero: string;

  @Column({
    name: 'descripcion',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  descripcion: string;

  @Column({ type: 'timestamp', nullable: true, default: null })
  caducidad: Date;
}
