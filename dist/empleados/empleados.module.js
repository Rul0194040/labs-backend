"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpleadosModule = void 0;
const common_1 = require("@nestjs/common");
const empleados_service_1 = require("./empleados.service");
const empleados_controller_1 = require("./empleados.controller");
const qrs_service_1 = require("./qrs/qrs.service");
const empleados_public_controller_1 = require("./empleados-public.controller");
let EmpleadosModule = class EmpleadosModule {
};
EmpleadosModule = __decorate([
    common_1.Module({
        controllers: [empleados_controller_1.EmpleadosController, empleados_public_controller_1.EmpleadosPublicController],
        providers: [empleados_service_1.EmpleadosService, qrs_service_1.QrsService],
    })
], EmpleadosModule);
exports.EmpleadosModule = EmpleadosModule;
//# sourceMappingURL=empleados.module.js.map