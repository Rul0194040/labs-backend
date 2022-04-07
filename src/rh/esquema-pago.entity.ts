import { TipoCuentaGastoEntity } from '@sanfrancisco/bancos/entities/tipos-cuenta-gasto.entity';
import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('esquemasPago')
export class EsquemaPagoEntity extends CommonEntity {
  @Column({ type: 'varchar', nullable: false, length: 100 })
  nombre: string;

  @ManyToOne(() => TipoCuentaGastoEntity, { nullable: true })
  cuentaGasto: TipoCuentaGastoEntity;
}
