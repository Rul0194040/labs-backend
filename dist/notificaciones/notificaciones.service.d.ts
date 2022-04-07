import { EventEmitter2 } from '@nestjs/event-emitter';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { UsersService } from '@sanfrancisco/users/users.service';
import { MinimoAlcanzadoEvent } from './events/minimoAlcanzado.event';
import { NotificacionEntity } from './notificaciones.entity';
export declare class NotificacionesService {
    private readonly userService;
    private readonly eventEmitter;
    constructor(userService: UsersService, eventEmitter: EventEmitter2);
    misNotificaciones(user: UsersEntity): Promise<NotificacionEntity[]>;
    emitMinimoAlcanzado(event: MinimoAlcanzadoEvent): Promise<void>;
    crearNotificacion(de: UsersEntity, para: UsersEntity, titulo: string, descripcion: string, link: string): Promise<NotificacionEntity>;
}
