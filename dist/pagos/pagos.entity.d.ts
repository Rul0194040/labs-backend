import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { VentaEntity } from '@sanfrancisco/ventas/ventas.entity';
import { CajaEntity } from '@sanfrancisco/cajas/cajas.entity';
import { TiposPago } from './tipoPagos.enum';
export declare class PagoEntity extends CommonEntity {
    venta: VentaEntity;
    ventaId?: number;
    caja: CajaEntity;
    cajaId?: number;
    tipo: TiposPago;
    referencia: string;
    fecha: Date;
    monto: number;
    estatus: number;
    efectivoRecibido: number;
    cambio: number;
    cobranza: boolean;
}
