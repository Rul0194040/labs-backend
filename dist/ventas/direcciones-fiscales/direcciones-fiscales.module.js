"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DireccionesFiscalesModule = void 0;
const common_1 = require("@nestjs/common");
const direcciones_fiscales_service_1 = require("./direcciones-fiscales.service");
const direcciones_fiscales_controller_1 = require("./direcciones-fiscales.controller");
let DireccionesFiscalesModule = class DireccionesFiscalesModule {
};
DireccionesFiscalesModule = __decorate([
    common_1.Module({
        providers: [direcciones_fiscales_service_1.DireccionesFiscalesService],
        controllers: [direcciones_fiscales_controller_1.DireccionesFiscalesController],
    })
], DireccionesFiscalesModule);
exports.DireccionesFiscalesModule = DireccionesFiscalesModule;
//# sourceMappingURL=direcciones-fiscales.module.js.map