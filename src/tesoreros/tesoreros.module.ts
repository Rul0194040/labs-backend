import { Module } from '@nestjs/common';
import { TesorerosController } from './tesoreros.controller';
import { TesorerosService } from './tesoreros.service';
import { VentasService } from '../ventas/ventas.service';
import { CajasService } from '../cajas/cajas.service';
import { PxlabService } from '@sanfrancisco/pxlab/pxlab.service';

@Module({
  imports: [],
  controllers: [TesorerosController],
  providers: [TesorerosService, VentasService, CajasService, PxlabService],
})
export class TesorerosModule {}
