import { SucursalesService } from '../sucursales/services/sucursales.service';
import { Module } from '@nestjs/common';
import { AlmacenService } from './almacen.service';
import { AlmacenController } from './almacen.controller';
import { NotificacionesService } from '@sanfrancisco/notificaciones/notificaciones.service';
import { UsersService } from '@sanfrancisco/users/users.service';
import { HeimdalService } from '@sanfrancisco/common/heimdal/heimdal.service';
import { ComprasService } from '@sanfrancisco/compras/compras.service';
import { SucursalesInsumosService } from '@sanfrancisco/sucursales/services/sucursalesInsumos.service';

@Module({
  imports: [],
  providers: [
    AlmacenService,
    SucursalesService,
    NotificacionesService,
    UsersService,
    HeimdalService,
    ComprasService,
    SucursalesInsumosService,
  ],
  controllers: [AlmacenController],
  exports: [AlmacenService, ComprasService],
})
export class AlmacenModule {}
