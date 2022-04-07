import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
export declare class TipoCuentaGastoEntity extends CommonEntity {
    nombre: string;
    clave: string;
    parent: TipoCuentaGastoEntity;
}
