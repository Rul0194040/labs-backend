import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { InsumoEntity } from '@sanfrancisco/insumos/insumo.entity';
import { MovimientosAlmacenEntity } from './movimientosAlmacen.entity';
import { ProveedorEntity } from '@sanfrancisco/catalogos/proveedores/proveedores.entity';
import { LoteEntity } from '@sanfrancisco/lotes/lotes.entity';
export declare class DetalleMovimientosEntity extends CommonEntity {
    movimiento: MovimientosAlmacenEntity;
    movimientoId: number;
    insumo: InsumoEntity;
    insumoId: number;
    cantidad: number;
    costo: number;
    cantidadRecibida: number;
    nota: string;
    lote: LoteEntity;
    loteId: number;
    proveedor: ProveedorEntity;
    proveedorId: number;
}
