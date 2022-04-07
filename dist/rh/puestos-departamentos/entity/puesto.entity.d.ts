import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { DepartamentoEntity } from './departamento.entity';
export declare class PuestoEntity extends CommonEntity {
    nombre: string;
    puestoJefe: PuestoEntity;
    sueldoMensual: number;
    plazasDisponibles: number;
    departamento: DepartamentoEntity;
}
