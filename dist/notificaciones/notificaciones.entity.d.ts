import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
export declare class NotificacionEntity extends CommonEntity {
    titulo: string;
    descripcion: string;
    de?: UsersEntity;
    deId?: number;
    para: UsersEntity;
    paraId?: number;
    leido: boolean;
    link: string;
}
