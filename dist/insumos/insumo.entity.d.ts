import { TipoInsumoEntity } from '@sanfrancisco/catalogos/tipos-insumos/tipo-insumo.entity';
import { TipoUnidadEntity } from '@sanfrancisco/catalogos/tipos-unidades/tipos-unidades.entity';
import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
export declare class InsumoEntity extends CommonEntity {
    nombre: string;
    descripcion: string;
    codigo: string;
    clave: string;
    tipoInsumo?: TipoInsumoEntity;
    tipoInsumoId?: number;
    tipoUnidad?: TipoUnidadEntity;
    tipoUnidadId?: number;
    descuentaEn: string;
}
