import { BancoEntity } from '@sanfrancisco/bancos/entities/banco.entity';
import { CuentaBancariaEntity } from '@sanfrancisco/bancos/entities/cuenta-bancaria.entity';
import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { EsquemaPagoEntity } from '@sanfrancisco/rh/esquema-pago.entity';
import { JornadaEntity } from '@sanfrancisco/rh/jornada.entity';
import { PuestoEntity } from '@sanfrancisco/rh/puestos-departamentos/entity/puesto.entity';
import { SucursalEntity } from '@sanfrancisco/sucursales/sucursal.entity';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
export declare class ContratoEntity extends CommonEntity {
    empleado: UsersEntity;
    puesto: PuestoEntity;
    fecha: Date;
    numero: number;
    sucursal: SucursalEntity;
    esquemaPago: EsquemaPagoEntity;
    jornada: JornadaEntity;
    cuentaPago: CuentaBancariaEntity;
    cuentaDepositoBanco: BancoEntity;
    cuentaDepositoCuenta: string;
    sueldoReal: number;
    sueldoContratado: number;
    fondoAhorro: number;
}
