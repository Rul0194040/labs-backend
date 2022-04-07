import { UsersEntity } from '../../users/users.entity';
export declare class CajasCerradasSucursalDTO {
    id: number;
    montoApertura: number;
    total: number;
    fechaApertura: Date;
    fechaCierre: Date;
    usuario: UsersEntity;
    ventas: number;
    retiros: number;
    depositos: number;
    transferencias: number;
    tarjeta: number;
    efectivo: number;
    cheque: number;
    creditoVentas: number;
    credito: number;
    faltante: number;
    observaciones: string;
}
