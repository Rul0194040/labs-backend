import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { SucursalEntity } from './sucursal.entity';
export declare class ApiKeyEntity extends CommonEntity {
    key: string;
    nombre: string;
    sucursal: SucursalEntity;
}
