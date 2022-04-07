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
var ApiKeyGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyGuard = void 0;
const common_1 = require("@nestjs/common");
const logger_1 = require("../../../logger");
const sucursales_service_1 = require("../../../sucursales/services/sucursales.service");
let ApiKeyGuard = ApiKeyGuard_1 = class ApiKeyGuard {
    constructor(sucursalesService) {
        this.sucursalesService = sucursalesService;
        this.logger = new logger_1.MyLogger(ApiKeyGuard_1.name);
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        if (request.headers['api-key']) {
            const sucursal = await this.validateApiKey(request.headers['api-key']);
            if (sucursal) {
                request.sucursal = sucursal;
                return true;
            }
        }
        else {
            return false;
        }
    }
    async validateApiKey(ApiKey) {
        return await this.sucursalesService.getByApiKey(ApiKey);
    }
};
ApiKeyGuard = ApiKeyGuard_1 = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [sucursales_service_1.SucursalesService])
], ApiKeyGuard);
exports.ApiKeyGuard = ApiKeyGuard;
//# sourceMappingURL=apikey.guard.js.map