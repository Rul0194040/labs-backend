import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
export declare class DepartamentoEntity extends CommonEntity {
    nombre: string;
    parent: DepartamentoEntity;
}
