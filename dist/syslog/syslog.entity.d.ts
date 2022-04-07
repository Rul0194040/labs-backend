import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
export declare class SyslogEntity extends CommonEntity {
    user?: UsersEntity;
    userId?: number;
    method: string;
    baseUrl: string;
    statusCode: number;
    contentLength: number;
    userAgent: string;
    ip: string;
}
