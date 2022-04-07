import { SucursalEntity } from '@sanfrancisco/sucursales/sucursal.entity';
import { UsersEntity } from './users.entity';
export declare class UserSucursalesEntity {
    id: number;
    user: UsersEntity;
    sucursal: SucursalEntity;
    responsable: boolean;
}
