import { Module } from '@nestjs/common';
import { MailService } from '@sanfrancisco/common/services/mailer/email.service';
import { EmpleadosModule } from '@sanfrancisco/empleados/empleados.module';
import { QrsService } from '@sanfrancisco/empleados/qrs/qrs.service';
import { NotificacionesService } from '@sanfrancisco/notificaciones/notificaciones.service';
import { SucursalesService } from '@sanfrancisco/sucursales/services/sucursales.service';
import { SucursalesModule } from '@sanfrancisco/sucursales/sucursales.module';
import { UsersService } from '@sanfrancisco/users/users.service';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [SucursalesModule, EmpleadosModule],
  providers: [
    EventsGateway,
    NotificacionesService,
    UsersService,
    MailService,
    SucursalesService,
    QrsService,
  ],
  exports: [EventsGateway],
})
export class EventsModule {}
