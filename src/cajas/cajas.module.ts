import { Module } from '@nestjs/common';
import { HeimdalService } from '@sanfrancisco/common/heimdal/heimdal.service';
import { CajasController } from './cajas.controller';
import { CajasService } from './cajas.service';

@Module({
  imports: [],
  controllers: [CajasController],
  providers: [CajasService, HeimdalService],
})
export class CajasModule {}
