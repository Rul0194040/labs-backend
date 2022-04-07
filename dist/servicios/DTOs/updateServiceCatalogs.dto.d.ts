import { GrupoServicioEntity } from '../../catalogos/grupos-servicios/grupo-servicio.entity';
import { TipoMuestraEntity } from '../../catalogos/tipos-muestras/tipos-muestras.entity';
import { TipoUnidadEntity } from '../../catalogos/tipos-unidades/tipos-unidades.entity';
export declare class UpdateServiceCatalogsDTO {
    grupoServicio?: number;
    tipoMuestra?: number;
    tipoUnidad?: number;
}
export declare class UpdateServiceCatalogsEntityDTO {
    grupoServicio?: GrupoServicioEntity;
    tipoMuestra?: TipoMuestraEntity;
    tipoUnidad?: TipoUnidadEntity;
}
