import { ComprasService } from '@sanfrancisco/compras/compras.service';
import { SucursalesService } from '../sucursales/services/sucursales.service';
import { ServiciosService } from './../servicios/servicios.service';
import { Module } from '@nestjs/common';
import { VentasController } from './ventas.controller';
import { VentasService } from './ventas.service';
import { NotificacionesService } from '@sanfrancisco/notificaciones/notificaciones.service';
import { UsersService } from '@sanfrancisco/users/users.service';
import { DireccionesFiscalesModule } from './direcciones-fiscales/direcciones-fiscales.module';
import { HeimdalService } from '@sanfrancisco/common/heimdal/heimdal.service';
import { PxlabService } from '@sanfrancisco/pxlab/pxlab.service';
import { AlmacenService } from '../almacen/almacen.service';
import { SucursalesInsumosService } from '../sucursales/services/sucursalesInsumos.service';
import { MuestrasModule } from './muestras/muestras.module';
import { LocalMailerModule } from '@sanfrancisco/common/services/mailer/email.module';
import { MailService } from '@sanfrancisco/common/services/mailer/email.service';
import { WhatsappModule } from '@sanfrancisco/whatsapp/whatsapp.module';
import { WhatsappService } from '@sanfrancisco/whatsapp/whatsapp.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    DireccionesFiscalesModule,
    MuestrasModule,
    LocalMailerModule,
    WhatsappModule,
    HttpModule,
  ],
  controllers: [VentasController],
  providers: [
    VentasService,
    ServiciosService,
    SucursalesService,
    NotificacionesService,
    UsersService,
    HeimdalService,
    ComprasService,
    HeimdalService,
    PxlabService,
    AlmacenService,
    SucursalesInsumosService,
    MailService,
    WhatsappService,
  ],
})
export class VentasModule {}
