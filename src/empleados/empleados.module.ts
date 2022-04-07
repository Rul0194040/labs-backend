import { Module } from '@nestjs/common';
import { EmpleadosService } from './empleados.service';
import { EmpleadosController } from './empleados.controller';
import { QrsService } from './qrs/qrs.service';
import { EmpleadosPublicController } from './empleados-public.controller';

@Module({
  controllers: [EmpleadosController, EmpleadosPublicController],
  providers: [EmpleadosService, QrsService],
})
export class EmpleadosModule {}
