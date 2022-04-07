import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BancoEntity } from './banco.entity';

@Entity('cuentasBancarias')
export class CuentaBancariaEntity extends CommonEntity {
  @Column({
    type: 'tinytext',
    nullable: false,
  })
  nombre: string;

  @Column({
    type: 'float',
    nullable: false,
  })
  saldo: number;

  @ManyToOne(() => BancoEntity, { nullable: false })
  banco: BancoEntity;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  numeroCuenta: string;
}
