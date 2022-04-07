import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
export declare class ImageEntity extends CommonEntity {
    title: string;
    description: string;
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
    avatar?: UsersEntity;
    avatarId: number;
    constructor(id: number, uuid: string, title: string, description: string, destination: string, encoding: string, fieldname: string, filename: string, mimetype: string, originalname: string, path: string, size: number, active?: boolean, avatar?: UsersEntity);
}
