import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('tiposCuentaGasto')
export class TipoCuentaGastoEntity extends CommonEntity {
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  nombre: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: false,
    unique: true,
  })
  clave: string;

  //si tiene parent, entonces esta es una cuenta que pertenece a ese "tipo"
  //si no tiene parent, entonces es un "tipo"
  @ManyToOne(() => TipoCuentaGastoEntity, { nullable: true })
  parent: TipoCuentaGastoEntity;
}
