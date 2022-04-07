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
var JwtVentaGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtVentaGuard = void 0;
const common_1 = require("@nestjs/common");
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("@nestjs/config");
const configkeys_enum_1 = require("../../../common/enum/configkeys.enum");
const ventas_entity_1 = require("../../../ventas/ventas.entity");
const logger_1 = require("../../../logger");
let JwtVentaGuard = JwtVentaGuard_1 = class JwtVentaGuard {
    constructor(configService) {
        this.configService = configService;
        this.logger = new logger_1.MyLogger(JwtVentaGuard_1.name);
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authorization = request.headers['authorization'];
        if (!authorization) {
            return false;
        }
        const decoded = this.validateJWT(authorization);
        if (decoded && decoded.id) {
            request.venta = decoded;
            return true;
        }
        return false;
    }
    validateJWT(jwt) {
        try {
            const decoded = jsonwebtoken_1.verify(jwt, this.configService.get(configkeys_enum_1.ConfigKeys.JWT_SECRET));
            return decoded;
        }
        catch (error) {
            return false;
        }
    }
};
JwtVentaGuard = JwtVentaGuard_1 = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], JwtVentaGuard);
exports.JwtVentaGuard = JwtVentaGuard;
//# sourceMappingURL=jwt-venta.guard.js.map