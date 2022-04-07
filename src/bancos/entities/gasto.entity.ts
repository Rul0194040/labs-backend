import { CajaEntity } from '@sanfrancisco/cajas/cajas.entity';
import { ProveedorEntity } from '@sanfrancisco/catalogos/proveedores/proveedores.entity';
import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { CompraEntity } from '@sanfrancisco/compras/compras.entity';
import { SucursalEntity } from '@sanfrancisco/sucursales/sucursal.entity';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CuentaBancariaEntity } from './cuenta-bancaria.entity';
import { TipoCuentaGastoEntity } from './tipos-cuenta-gasto.entity';

@Entity('gastos')
export class GastoEntity extends CommonEntity {
  @ManyToOne(() => TipoCuentaGastoEntity, { nullable: false })
  tipoCuenta: TipoCuentaGastoEntity;

  @ManyToOne(() => SucursalEntity, { nullable: true })
  sucursal: SucursalEntity;

  @ManyToOne(() => CajaEntity, { nullable: true })
  caja: CajaEntity;

  @ManyToOne(() => ProveedorEntity, { nullable: true })
  proveedor: ProveedorEntity;

  @ManyToOne(() => CompraEntity, { nullable: true })
  compra: CompraEntity;

  @Column({ type: 'tinytext' })
  documento: string;

  @Column({ type: 'tinytext' })
  descripcion: string;

  @ManyToOne(() => UsersEntity, { nullable: false })
  user: UsersEntity; //usuario que captura

  @ManyToOne(() => CuentaBancariaEntity, { nullable: true })
  cuentaBanco: CuentaBancariaEntity;

  @Column({ type: 'date', nullable: false })
  fechaGasto: Date;

  @Column({ type: 'varchar', length: 50 })
  referencia: string;

  @Column({ type: 'float', nullable: false })
  monto: number;
}
