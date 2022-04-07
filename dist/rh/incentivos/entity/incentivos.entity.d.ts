import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { UnidadesDescuento } from '@sanfrancisco/rh/unidades-descuento.enum';
export declare class IncentivoEntity extends CommonEntity {
    nombre: string;
    cantidad: number;
    unidad: UnidadesDescuento;
}
