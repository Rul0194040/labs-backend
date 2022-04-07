import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { TipoMovimientosBancos } from '../tipo-movimientos-bancos.enum';
import { CuentaBancariaEntity } from './cuenta-bancaria.entity';

@Entity('movimientosCuentasBancos')
export class MovimientoCuentaBanco extends CommonEntity {
  @ManyToOne(() => CuentaBancariaEntity, { nullable: false })
  origen: CuentaBancariaEntity;

  @ManyToOne(() => CuentaBancariaEntity, { nullable: true })
  destino: CuentaBancariaEntity;

  @ManyToOne(() => UsersEntity, { nullable: false })
  usuario: UsersEntity;

  @Column({ type: 'float', nullable: false })
  monto: number;

  @Column({ type: 'date', nullable: false })
  fecha: Date;

  @Column({ type: 'tinytext' })
  referencia: string;

  @Column({
    type: 'varchar',
    length: 1,
    default: TipoMovimientosBancos.TRANSFERENCIA,
  })
  tipo: TipoMovimientosBancos;
}
