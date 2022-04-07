import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { GrupoServicioEntity } from '@sanfrancisco/catalogos/grupos-servicios/grupo-servicio.entity';
import { TipoMuestraEntity } from '@sanfrancisco/catalogos/tipos-muestras/tipos-muestras.entity';
import { TipoUnidadEntity } from '@sanfrancisco/catalogos/tipos-unidades/tipos-unidades.entity';
export declare class ServicioEntity extends CommonEntity {
    muestrasRequeridas: number;
    clave: string;
    nombre: string;
    sinonimo1: string;
    sinonimo2: string;
    tiempo: number;
    precio: number;
    precio2: number;
    precio3: number;
    precioMaquila: number;
    factor: number;
    recomendaciones?: string;
    realizaEstudioEn?: string;
    grupoServicio?: GrupoServicioEntity;
    grupoServicioId?: number;
    tipoMuestra?: TipoMuestraEntity;
    tipoMuestraId?: number;
    tipoUnidad?: TipoUnidadEntity;
    tipoUnidadId?: number;
}
