import { PacienteEntity } from './../../pacientes/pacientes.entity';
import { BancoEntity } from '@sanfrancisco/bancos/entities/banco.entity';
import { CajaEntity } from '@sanfrancisco/cajas/cajas.entity';
import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { SucursalEntity } from '@sanfrancisco/sucursales/sucursal.entity';
export declare class IngresoSucursalEntity extends CommonEntity {
    sucursal: SucursalEntity;
    sucursalId?: number;
    caja: CajaEntity;
    cajaId?: number;
    banco: BancoEntity;
    bancoId?: number;
    paciente: PacienteEntity;
    pacienteId?: number;
    estudioPxLab: string;
    ingreso: number;
    gasto: number;
    vaucher: string;
}
