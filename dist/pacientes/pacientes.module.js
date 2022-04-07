"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacientesModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const configkeys_enum_1 = require("../common/enum/configkeys.enum");
const pxlab_service_1 = require("../pxlab/pxlab.service");
const ventas_module_1 = require("../ventas/ventas.module");
const ventas_service_1 = require("../ventas/ventas.service");
const pacientes_controller_1 = require("./pacientes.controller");
const pacientes_service_1 = require("./pacientes.service");
const publico_controller_1 = require("./publico/publico.controller");
let PacientesModule = class PacientesModule {
};
PacientesModule = __decorate([
    common_1.Module({
        imports: [
            ventas_module_1.VentasModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (_configService) => ({
                    secret: _configService.get(configkeys_enum_1.ConfigKeys.JWT_SECRET),
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [pacientes_controller_1.PacientesController, publico_controller_1.PublicoController],
        providers: [pacientes_service_1.PacientesService, ventas_service_1.VentasService, pxlab_service_1.PxlabService],
    })
], PacientesModule);
exports.PacientesModule = PacientesModule;
//# sourceMappingURL=pacientes.module.js.map