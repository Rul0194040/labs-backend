import { TipoUnidadEntity } from '@sanfrancisco/catalogos/tipos-unidades/tipos-unidades.entity';
import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { InsumoEntity } from '@sanfrancisco/insumos/insumo.entity';
import { CompraEntity } from './compras.entity';
export declare class DetalleCompraEntity extends CommonEntity {
    insumo: InsumoEntity;
    insumoId?: number;
    compra: CompraEntity;
    compraId: number;
    tipoUnidad: TipoUnidadEntity;
    tipoUnidadId?: number;
    clave: string;
    cantidad: number;
    precio: number;
    subtotal: number;
    total: number;
    descuento: number;
}
