import { Global, Module } from '@nestjs/common';
import { UsersService } from '@sanfrancisco/users/users.service';
import { NotificacionesService } from './notificaciones.service';
import { NotificacionesController } from './notificaciones.controller';

@Global()
@Module({
  imports: [],
  providers: [NotificacionesService, UsersService],
  controllers: [NotificacionesController],
})
export class NotificacionesModule {}
