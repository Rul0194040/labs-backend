import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { BancoEntity } from './banco.entity';
export declare class CuentaBancariaEntity extends CommonEntity {
    nombre: string;
    saldo: number;
    banco: BancoEntity;
    numeroCuenta: string;
}
