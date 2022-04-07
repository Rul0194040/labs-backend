import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { TiposPago } from '@sanfrancisco/pagos/tipoPagos.enum';
import { CompraEntity } from './compras.entity';
export declare class PagoProveedorEntity extends CommonEntity {
    compra: CompraEntity;
    compraId?: number;
    tipo: TiposPago;
    referencia: string;
    fecha: Date;
    monto: number;
    estatus: number;
}
