import { TipoCuentaGastoEntity } from '@sanfrancisco/bancos/entities/tipos-cuenta-gasto.entity';
import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { Column, Entity } from 'typeorm';

@Entity('jornadas')
export class JornadaEntity extends CommonEntity {
  @Column({ type: 'varchar', nullable: false, length: 100 })
  nombre: string;

  @Column({ type: 'int', nullable: false })
  horas: TipoCuentaGastoEntity;
}
