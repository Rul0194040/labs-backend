import { Module } from '@nestjs/common';
import { MovilController } from './movil.controller';
import { MovilService } from './movil.service';
import { SucursalesInsumosService } from '../sucursales/services/sucursalesInsumos.service';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { UsersService } from '../users/users.service';
import { MailService } from '../common/services/mailer/email.service';
import { CajasModule } from '@sanfrancisco/cajas/cajas.module';
import { CajasService } from '@sanfrancisco/cajas/cajas.service';

@Module({
  imports: [CajasModule],
  controllers: [MovilController],
  providers: [
    MovilService,
    SucursalesInsumosService,
    NotificacionesService,
    UsersService,
    MailService,
    CajasService,
  ],
})
export class MovilModule {}
