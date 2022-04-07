import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { SucursalEntity } from '@sanfrancisco/sucursales/sucursal.entity';
import { TareasEstatus } from './tareas-estatus.enum';
export declare class TareasEntity extends CommonEntity {
    event: string;
    channel: string;
    data: any;
    sucursal: SucursalEntity;
    sucursalId: number;
    status: TareasEstatus;
}
