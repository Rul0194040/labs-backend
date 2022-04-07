import { EventEmitter2 } from '@nestjs/event-emitter';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { QrsEntity } from '@sanfrancisco/empleados/qrs/qrs.entity';
import { QrsService } from '@sanfrancisco/empleados/qrs/qrs.service';
import { SucursalEntity } from '@sanfrancisco/sucursales/sucursal.entity';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { Server, Socket } from 'socket.io';
import { EventDTO } from './event.dto';
export declare class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly eventEmitter;
    private readonly qrsService;
    constructor(eventEmitter: EventEmitter2, qrsService: QrsService);
    private readonly logger;
    server: Server;
    handleBroadcastEvent(event: EventDTO): void;
    enviarMensaje(data: {
        destinoUuid: number;
        texto: string;
    }, socket: Socket & {
        user: Partial<UsersEntity>;
    }): string;
    channels(data: {
        any: any;
    }, socket: Socket & {
        user: Partial<UsersEntity>;
    }): Promise<{
        channels: string[];
    }>;
    qrEscaneado(data: any, socket: Socket & {
        user: Partial<UsersEntity>;
    }): Promise<{
        resultQuemar: QrsEntity;
    } | {
        error: string;
    }>;
    monitorOnline(data: {
        any: any;
    }, socket: Socket & {
        sucursal: any;
        apiKey: string;
    }): Promise<{
        channels: string[];
        sucursal: Partial<SucursalEntity>;
        qr: string;
    }>;
    folioPXListo(data: any): Promise<import("typeorm").UpdateResult | "OK">;
    estudioOk(data: any): Promise<string>;
    clienteOk(data: any): Promise<string>;
    afterInit(): Promise<any>;
    handleConnection(socket: Socket): Promise<any>;
    handleDisconnect(socket: Socket & {
        user: Partial<UsersEntity>;
    }): Promise<any>;
}
