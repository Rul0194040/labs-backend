"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TiposUnidadesModule = void 0;
const common_1 = require("@nestjs/common");
const tipos_unidades_service_1 = require("./tipos-unidades.service");
const tipos_unidades_controller_1 = require("./tipos-unidades.controller");
let TiposUnidadesModule = class TiposUnidadesModule {
};
TiposUnidadesModule = __decorate([
    common_1.Module({
        providers: [tipos_unidades_service_1.TiposUnidadesService],
        controllers: [tipos_unidades_controller_1.TiposUnidadesController],
    })
], TiposUnidadesModule);
exports.TiposUnidadesModule = TiposUnidadesModule;
//# sourceMappingURL=tipos-unidades.module.js.map