import { Module } from '@nestjs/common';
import { IngresosSucursalService } from './ingresos-sucursal.service';
import { IngresosSucursalController } from './ingresos-sucursal.controller';

@Module({
  providers: [IngresosSucursalService],
  controllers: [IngresosSucursalController]
})
export class IngresosSucursalModule {}
