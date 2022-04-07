import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { TipoMovimientosBancos } from '../tipo-movimientos-bancos.enum';
import { CuentaBancariaEntity } from './cuenta-bancaria.entity';
export declare class MovimientoCuentaBanco extends CommonEntity {
    origen: CuentaBancariaEntity;
    destino: CuentaBancariaEntity;
    usuario: UsersEntity;
    monto: number;
    fecha: Date;
    referencia: string;
    tipo: TipoMovimientosBancos;
}
