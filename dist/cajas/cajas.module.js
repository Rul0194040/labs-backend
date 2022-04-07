"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CajasModule = void 0;
const common_1 = require("@nestjs/common");
const heimdal_service_1 = require("../common/heimdal/heimdal.service");
const cajas_controller_1 = require("./cajas.controller");
const cajas_service_1 = require("./cajas.service");
let CajasModule = class CajasModule {
};
CajasModule = __decorate([
    common_1.Module({
        imports: [],
        controllers: [cajas_controller_1.CajasController],
        providers: [cajas_service_1.CajasService, heimdal_service_1.HeimdalService],
    })
], CajasModule);
exports.CajasModule = CajasModule;
//# sourceMappingURL=cajas.module.js.map