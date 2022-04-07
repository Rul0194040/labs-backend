"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RhModule = void 0;
const documentos_service_1 = require("./documentos/documentos.service");
const common_1 = require("@nestjs/common");
const puestos_departamentos_service_1 = require("./puestos-departamentos/puestos-departamentos.service");
const incentivos_controller_1 = require("./incentivos/incentivos.controller");
const incentivos_service_1 = require("./incentivos/incentivos.service");
const puestos_controller_1 = require("./puestos-departamentos/controllers/puestos.controller");
const departamentos_controller_1 = require("./puestos-departamentos/controllers/departamentos.controller");
const documentos_controller_1 = require("./documentos/documentos.controller");
const incidencias_service_1 = require("./incidencias/incidencias.service");
const incidencias_controller_1 = require("./incidencias/incidencias.controller");
const ingresos_sucursal_module_1 = require("./ingresos-sucursal/ingresos-sucursal.module");
const nomina_module_1 = require("./nomina/nomina.module");
const notificaciones_personal_module_1 = require("./notificaciones-personal/notificaciones-personal.module");
let RhModule = class RhModule {
};
RhModule = __decorate([
    common_1.Module({
        controllers: [
            departamentos_controller_1.DepartamentosController,
            incentivos_controller_1.IncentivosController,
            puestos_controller_1.PuestosController,
            documentos_controller_1.DocumentosController,
            incidencias_controller_1.IncidenciasController,
        ],
        providers: [
            puestos_departamentos_service_1.PuestosDepartamentosService,
            incentivos_service_1.IncentivosService,
            documentos_service_1.DocumentosService,
            incidencias_service_1.IncidenciasService,
        ],
        imports: [ingresos_sucursal_module_1.IngresosSucursalModule, nomina_module_1.NominaModule, notificaciones_personal_module_1.NotificacionesPersonalModule],
    })
], RhModule);
exports.RhModule = RhModule;
//# sourceMappingURL=rh.module.js.map