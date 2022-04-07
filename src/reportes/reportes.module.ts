import { Module } from '@nestjs/common';
import { ReportesVentasService } from './reportes-ventas.service';
import { ReportesController } from './reportes.controller';
import { ReportesService } from './reportes.service';

@Module({
  controllers: [ReportesController],
  providers: [ReportesService, ReportesVentasService],
})
export class ReportesModule {}
