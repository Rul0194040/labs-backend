import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
export declare class MensajeEntity extends CommonEntity {
    origen: UsersEntity;
    destino: UsersEntity;
    texto: string;
    leido: boolean;
}
