import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { UnidadesDescuento } from '../../unidades-descuento.enum';
export declare class IncidenciaEntity extends CommonEntity {
    nombre: string;
    requeridas: number;
    descuento: number;
    unidadDescuento: UnidadesDescuento;
}
