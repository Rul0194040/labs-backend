import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('departamentos')
export class DepartamentoEntity extends CommonEntity {
  @Column({
    type: 'tinytext',
    nullable: false,
  })
  nombre: string;
  @ManyToOne(() => DepartamentoEntity, { nullable: true })
  parent: DepartamentoEntity;
}
