"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TiposMuestrasModule = void 0;
const common_1 = require("@nestjs/common");
const tipos_muestras_controller_1 = require("./tipos-muestras.controller");
const tipos_muestras_service_1 = require("./tipos-muestras.service");
let TiposMuestrasModule = class TiposMuestrasModule {
};
TiposMuestrasModule = __decorate([
    common_1.Module({
        controllers: [tipos_muestras_controller_1.TiposMuestrasController],
        providers: [tipos_muestras_service_1.TiposMuestrasService],
    })
], TiposMuestrasModule);
exports.TiposMuestrasModule = TiposMuestrasModule;
//# sourceMappingURL=tipos-muestras.module.js.map