"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiciosModule = void 0;
const common_1 = require("@nestjs/common");
const pxlab_service_1 = require("../pxlab/pxlab.service");
const servicios_controller_1 = require("./servicios.controller");
const servicios_service_1 = require("./servicios.service");
let ServiciosModule = class ServiciosModule {
};
ServiciosModule = __decorate([
    common_1.Module({
        imports: [],
        controllers: [servicios_controller_1.ServiciosController],
        providers: [servicios_service_1.ServiciosService, pxlab_service_1.PxlabService],
    })
], ServiciosModule);
exports.ServiciosModule = ServiciosModule;
//# sourceMappingURL=servicios.module.js.map