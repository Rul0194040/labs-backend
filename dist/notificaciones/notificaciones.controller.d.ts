import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { NotificacionEntity } from './notificaciones.entity';
import { NotificacionesService } from './notificaciones.service';
export declare class NotificacionesController {
    private readonly notificacionesService;
    constructor(notificacionesService: NotificacionesService);
    misNotificaciones(usuario: UsersEntity): Promise<NotificacionEntity[]>;
}
