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
var WebsocketGuardAuthorization_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketGuardAuthorization = void 0;
const common_1 = require("@nestjs/common");
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("@nestjs/config");
const configkeys_enum_1 = require("../common/enum/configkeys.enum");
const typeorm_1 = require("typeorm");
const users_entity_1 = require("../users/users.entity");
const logger_1 = require("../logger");
let WebsocketGuardAuthorization = WebsocketGuardAuthorization_1 = class WebsocketGuardAuthorization {
    constructor(configService) {
        this.configService = configService;
        this.logger = new logger_1.MyLogger(WebsocketGuardAuthorization_1.name);
    }
    async canActivate(context) {
        const wsClient = context.switchToWs().getClient();
        const data = context.switchToWs().getData();
        const decoded = await this.validateJWT(data.Authorization);
        if (decoded && decoded['uuid']) {
            wsClient.user = decoded;
            return true;
        }
        return false;
    }
    async validateJWT(jwt) {
        try {
            const decoded = jsonwebtoken_1.verify(jwt, this.configService.get(configkeys_enum_1.ConfigKeys.JWT_SECRET));
            const user = await typeorm_1.getRepository(users_entity_1.UsersEntity).findOne({
                where: { uuid: decoded['uuid'] },
                relations: ['sucursal'],
            });
            const identity = {
                sub: user.id,
                uuid: user.uuid,
                id: user.id,
                profile: user.profile,
                email: user.email,
                firstName: user.firstName,
                grabandoRules: user.grabandoRules,
                rules: user.rules,
                lastName: user.lastName,
                picUrl: user.picUrl,
                createdAt: user.createdAt,
                validEmail: user.validEmail,
                sucursal: user.sucursal
                    ? {
                        id: user.sucursal.id,
                        uuid: user.sucursal.uuid,
                        nombre: user.sucursal.nombre,
                    }
                    : null,
            };
            return identity;
        }
        catch (error) {
            return false;
        }
    }
};
WebsocketGuardAuthorization = WebsocketGuardAuthorization_1 = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], WebsocketGuardAuthorization);
exports.WebsocketGuardAuthorization = WebsocketGuardAuthorization;
//# sourceMappingURL=websocketAuthorization.guard.js.map