import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { CuentaBancariaEntity } from '../entities/cuenta-bancaria.entity';
import { TipoMovimientosBancos } from '../tipo-movimientos-bancos.enum';
export declare class CreateMovBancarioDTO {
    origen: CuentaBancariaEntity;
    destino: CuentaBancariaEntity;
    usuario: UsersEntity;
    monto: number;
    fecha: Date;
    referencia: string;
    tipo: TipoMovimientosBancos;
}
