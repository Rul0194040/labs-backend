import { DocumentosService } from './documentos/documentos.service';
import { Module } from '@nestjs/common';
import { PuestosDepartamentosService } from './puestos-departamentos/puestos-departamentos.service';
import { IncentivosController } from './incentivos/incentivos.controller';
import { IncentivosService } from './incentivos/incentivos.service';
import { PuestosController } from './puestos-departamentos/controllers/puestos.controller';
import { DepartamentosController } from './puestos-departamentos/controllers/departamentos.controller';
import { DocumentosController } from './documentos/documentos.controller';
import { IncidenciasService } from './incidencias/incidencias.service';
import { IncidenciasController } from './incidencias/incidencias.controller';
import { IngresosSucursalModule } from './ingresos-sucursal/ingresos-sucursal.module';
import { NominaModule } from './nomina/nomina.module';
import { NotificacionesPersonalModule } from './notificaciones-personal/notificaciones-personal.module';

@Module({
  controllers: [
    DepartamentosController,
    IncentivosController,
    PuestosController,
    DocumentosController,
    IncidenciasController,
  ],
  providers: [
    PuestosDepartamentosService,
    IncentivosService,
    DocumentosService,
    IncidenciasService,
  ],
  imports: [IngresosSucursalModule, NominaModule, NotificacionesPersonalModule],
})
export class RhModule {}
