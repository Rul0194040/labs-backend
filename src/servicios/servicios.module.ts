import { Module } from '@nestjs/common';
import { PxlabService } from '@sanfrancisco/pxlab/pxlab.service';
import { ServiciosController } from './servicios.controller';
import { ServiciosService } from './servicios.service';

@Module({
  imports: [],
  controllers: [ServiciosController],
  providers: [ServiciosService, PxlabService],
})
export class ServiciosModule {}
