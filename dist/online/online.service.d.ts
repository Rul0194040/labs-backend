import { EventEmitter2 } from '@nestjs/event-emitter';
import { SucursalEntity } from '@sanfrancisco/sucursales/sucursal.entity';
import { Cache } from 'cache-manager';
import { Socket } from 'socket.io';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
export declare class OnlineService {
    private readonly eventEmitter;
    private cacheManager;
    constructor(eventEmitter: EventEmitter2, cacheManager: Cache);
    private logger;
    sockets: {
        id: string;
        user: Partial<UsersEntity>;
    }[];
    timeouts: any[];
    timeoutThreshold: number;
    horasCache: number;
    pendientes: number[];
    monitores: {
        socketId: string;
        sucursal: Partial<SucursalEntity>;
        since: string;
        apiKey: string;
        userAgent: string;
        monitorIp: string;
    }[];
    handleSocketConnected(socket: Socket & {
        user: Partial<UsersEntity>;
    }): Promise<void>;
    getOnlineUsers(): Promise<Partial<UsersEntity>[]>;
    handleSocketDisconnected(socket: Socket & {
        user: Partial<UsersEntity>;
    }): Promise<void>;
    handleMonitorConnected(monitor: {
        socketId: string;
        sucursal: Partial<SucursalEntity>;
        since: string;
        apiKey: string;
        userAgent: string;
        monitorIp: string;
    }): Promise<void>;
    handleCron(): Promise<void>;
}
