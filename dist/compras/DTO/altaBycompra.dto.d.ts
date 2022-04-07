export declare class AltaByCompraDTO {
    fecha: Date;
    notas?: string;
    detalle: AltaByCompraDetalleDTO[];
}
export declare class AltaByCompraDetalleDTO {
    cantidad: number;
    loteId?: number;
    insumo: number;
    proveedor: number;
}
