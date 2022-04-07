import { EventEmitter2 } from '@nestjs/event-emitter';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { MensajeEntity } from './mensaje.entity';
export declare class MensajesService {
    private readonly eventEmitter;
    constructor(eventEmitter: EventEmitter2);
    handleAbrirConversacion(origenUuid: string, destinoUuid: string): Promise<MensajeEntity[]>;
    handleBroadcastEvent(mensajeToSend: {
        origenUuid: number;
        texto: string;
        destinoUuid: number;
    }): Promise<{
        origen: UsersEntity;
        destino: UsersEntity;
        texto: string;
    } & MensajeEntity>;
}
