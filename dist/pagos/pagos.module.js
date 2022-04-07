"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagosModule = void 0;
const common_1 = require("@nestjs/common");
const pagos_service_1 = require("./pagos.service");
const pagos_controller_1 = require("./pagos.controller");
const heimdal_service_1 = require("../common/heimdal/heimdal.service");
const ventas_service_1 = require("../ventas/ventas.service");
const pxlab_service_1 = require("../pxlab/pxlab.service");
const ventas_module_1 = require("../ventas/ventas.module");
let PagosModule = class PagosModule {
};
PagosModule = __decorate([
    common_1.Module({
        imports: [ventas_module_1.VentasModule],
        providers: [
            pagos_service_1.PagosService,
            heimdal_service_1.HeimdalService,
            ventas_service_1.VentasService,
            pxlab_service_1.PxlabService,
            ventas_service_1.VentasService,
        ],
        controllers: [pagos_controller_1.PagosController],
    })
], PagosModule);
exports.PagosModule = PagosModule;
//# sourceMappingURL=pagos.module.js.map