import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { SucursalEntity } from '@sanfrancisco/sucursales/sucursal.entity';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { OrigenEntrega } from './DTO/origenEntrega.dto';
import { CorteTesoreroEntity } from '../tesoreros/cortesTesorero/cortesTesorero.entity';
export declare class CajaEntity extends CommonEntity {
    sucursal: SucursalEntity;
    sucursalId?: number;
    usuario: UsersEntity;
    usuarioId?: number;
    corteTesorero: CorteTesoreroEntity;
    corteTesoreroId?: number;
    faltante: number;
    montoApertura: number;
    total: number;
    fechaApertura: Date;
    fechaCierre: Date;
    notas: string;
    observacionTesorero: string;
    estatus: string;
    transferencia: number;
    tarjeta: number;
    cheque: number;
    credito: number;
    mxn05: number;
    mxn1: number;
    mxn2: number;
    mxn5: number;
    mxn10: number;
    mxn20: number;
    mxn50: number;
    mxn100: number;
    mxn200: number;
    mxn500: number;
    mxn1000: number;
    arqTransferencia: number;
    arqTarjeta: number;
    arqCheque: number;
    arqCredito: number;
    totalArqueo: number;
    notasArqueo?: string;
    origenEntrega?: OrigenEntrega;
    referencia?: string;
    recibio?: string;
}
