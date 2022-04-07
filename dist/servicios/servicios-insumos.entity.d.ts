import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { InsumoEntity } from '@sanfrancisco/insumos/insumo.entity';
import { ServicioEntity } from './servicio.entity';
export declare class ServiciosInsumosEntity extends CommonEntity {
    servicio: ServicioEntity;
    insumo: InsumoEntity;
    cantidad: number;
}
