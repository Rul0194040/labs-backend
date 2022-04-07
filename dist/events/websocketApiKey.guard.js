"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var WebsocketGuardApiKey_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketGuardApiKey = void 0;
const common_1 = require("@nestjs/common");
const logger_1 = require("../logger");
const sucursales_service_1 = require("../sucursales/services/sucursales.service");
let WebsocketGuardApiKey = WebsocketGuardApiKey_1 = class WebsocketGuardApiKey {
    constructor(sucursalesService) {
        this.sucursalesService = sucursalesService;
        this.logger = new logger_1.MyLogger(WebsocketGuardApiKey_1.name);
    }
    async canActivate(context) {
        const wsClient = context.switchToWs().getClient();
        const data = context.switchToWs().getData();
        const sucursal = await this.validateApiKey(data.ApiKey);
        if (sucursal) {
            wsClient.sucursal = {
                id: sucursal.id,
                uuid: sucursal.uuid,
                nombre: sucursal.nombre,
            };
            wsClient.apiKey = data.ApiKey;
            return true;
        }
        else {
            return false;
        }
    }
    async validateApiKey(ApiKey) {
        return await this.sucursalesService.getByApiKey(ApiKey);
    }
};
WebsocketGuardApiKey = WebsocketGuardApiKey_1 = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [sucursales_service_1.SucursalesService])
], WebsocketGuardApiKey);
exports.WebsocketGuardApiKey = WebsocketGuardApiKey;
//# sourceMappingURL=websocketApiKey.guard.js.map