import { TipoCuentaGastoEntity } from '@sanfrancisco/bancos/entities/tipos-cuenta-gasto.entity';
import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
export declare class EsquemaPagoEntity extends CommonEntity {
    nombre: string;
    cuentaGasto: TipoCuentaGastoEntity;
}
