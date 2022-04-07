import { CajaEntity } from '@sanfrancisco/cajas/cajas.entity';
import { ProveedorEntity } from '@sanfrancisco/catalogos/proveedores/proveedores.entity';
import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { CompraEntity } from '@sanfrancisco/compras/compras.entity';
import { SucursalEntity } from '@sanfrancisco/sucursales/sucursal.entity';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { CuentaBancariaEntity } from './cuenta-bancaria.entity';
import { TipoCuentaGastoEntity } from './tipos-cuenta-gasto.entity';
export declare class GastoEntity extends CommonEntity {
    tipoCuenta: TipoCuentaGastoEntity;
    sucursal: SucursalEntity;
    caja: CajaEntity;
    proveedor: ProveedorEntity;
    compra: CompraEntity;
    documento: string;
    descripcion: string;
    user: UsersEntity;
    cuentaBanco: CuentaBancariaEntity;
    fechaGasto: Date;
    referencia: string;
    monto: number;
}
