import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { TiposMovimientoCaja } from '@sanfrancisco/common/enum/tiposMovimientoCaja.enum';
import { PagoEntity } from '@sanfrancisco/pagos/pagos.entity';
import { CajaEntity } from './cajas.entity';
import { EstatusMovimientoCancelacionE } from './estatusMovimiento.enum';
export declare class MovimientoCajaEntity extends CommonEntity {
    caja: CajaEntity;
    cajaId: number;
    pago?: PagoEntity;
    pagoId?: number;
    monto: number;
    tipoMovimiento: TiposMovimientoCaja;
    notas: string;
    estatus: number;
    estatusMovimiento?: EstatusMovimientoCancelacionE;
    motivoCancelacion?: string;
}
