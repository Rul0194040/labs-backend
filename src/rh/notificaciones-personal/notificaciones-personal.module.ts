import { Module } from '@nestjs/common';
import { NotificacionesPersonalService } from './notificaciones-personal.service';
import { NotificacionesPersonalController } from './notificaciones-personal.controller';

@Module({
  providers: [NotificacionesPersonalService],
  controllers: [NotificacionesPersonalController]
})
export class NotificacionesPersonalModule {}
