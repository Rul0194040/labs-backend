import { HeimdalService } from './../common/heimdal/heimdal.service';
import { Module } from '@nestjs/common';
import { SucursalesController } from './sucursales.controller';
import { SucursalesService } from './services/sucursales.service';
import { AlmacenModule } from '../almacen/almacen.module';
import { NotificacionesService } from '@sanfrancisco/notificaciones/notificaciones.service';
import { UsersService } from '@sanfrancisco/users/users.service';
import { SucursalesInsumosService } from './services/sucursalesInsumos.service';
import { SucursalesPublicController } from './sucursalesPublic.controller';

@Module({
  imports: [AlmacenModule],
  controllers: [SucursalesController, SucursalesPublicController],
  providers: [
    SucursalesService,
    NotificacionesService,
    UsersService,
    SucursalesInsumosService,
    HeimdalService,
  ],
})
export class SucursalesModule {}
