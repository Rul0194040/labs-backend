import { Module } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { PagosController } from './pagos.controller';
import { HeimdalService } from '../common/heimdal/heimdal.service';
import { VentasService } from '../ventas/ventas.service';
import { PxlabService } from '@sanfrancisco/pxlab/pxlab.service';
import { VentasModule } from '@sanfrancisco/ventas/ventas.module';

@Module({
  imports: [VentasModule],
  providers: [
    PagosService,
    HeimdalService,
    VentasService,
    PxlabService,
    VentasService,
  ],
  controllers: [PagosController],
})
export class PagosModule {}
