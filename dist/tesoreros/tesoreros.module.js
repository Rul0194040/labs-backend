"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TesorerosModule = void 0;
const common_1 = require("@nestjs/common");
const tesoreros_controller_1 = require("./tesoreros.controller");
const tesoreros_service_1 = require("./tesoreros.service");
const ventas_service_1 = require("../ventas/ventas.service");
const cajas_service_1 = require("../cajas/cajas.service");
const pxlab_service_1 = require("../pxlab/pxlab.service");
let TesorerosModule = class TesorerosModule {
};
TesorerosModule = __decorate([
    common_1.Module({
        imports: [],
        controllers: [tesoreros_controller_1.TesorerosController],
        providers: [tesoreros_service_1.TesorerosService, ventas_service_1.VentasService, cajas_service_1.CajasService, pxlab_service_1.PxlabService],
    })
], TesorerosModule);
exports.TesorerosModule = TesorerosModule;
//# sourceMappingURL=tesoreros.module.js.map