import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HeimdalService } from '@sanfrancisco/common/heimdal/heimdal.service';
import { MailService } from '@sanfrancisco/common/services/mailer/email.service';
import { ComprasController } from './compras.controller';
import { ComprasService } from './compras.service';
import { AlmacenService } from '../almacen/almacen.service';
import { SucursalesInsumosService } from '../sucursales/services/sucursalesInsumos.service';
import { SucursalesService } from '../sucursales/services/sucursales.service';
import { AlmacenModule } from '../almacen/almacen.module';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { UsersService } from '../users/users.service';

@Module({
  imports: [AlmacenModule],
  controllers: [ComprasController],
  providers: [
    ComprasService,
    HeimdalService,
    ConfigService,
    MailService,
    ComprasService,
    AlmacenService,
    SucursalesService,
    SucursalesInsumosService,
    NotificacionesService,
    UsersService,
  ],
})
export class ComprasModule {}
