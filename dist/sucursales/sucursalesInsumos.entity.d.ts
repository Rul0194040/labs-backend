import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { InsumoEntity } from '@sanfrancisco/insumos/insumo.entity';
import { LoteEntity } from '@sanfrancisco/lotes/lotes.entity';
import { SucursalEntity } from './sucursal.entity';
export declare class SucursalesInsumosEntity extends CommonEntity {
    sucursal: SucursalEntity;
    insumo: InsumoEntity;
    lote: LoteEntity;
    existencia: number;
    promedio: number;
    minimo: number;
    maximo: number;
    ubicacion: string;
}
