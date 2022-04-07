import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { Column, Entity, ManyToOne } from 'typeorm';
import { DepartamentoEntity } from './departamento.entity';

@Entity('puestos')
export class PuestoEntity extends CommonEntity {
  @Column({
    type: 'tinytext',
    nullable: false,
  })
  nombre: string;

  @ManyToOne(() => PuestoEntity, { nullable: true })
  puestoJefe: PuestoEntity;

  @Column({
    type: 'float',
    default: 0,
  })
  sueldoMensual: number;

  @Column({
    type: 'float',
    default: 1,
  })
  plazasDisponibles: number;

  @ManyToOne(() => DepartamentoEntity, { nullable: true })
  departamento: DepartamentoEntity;
}
