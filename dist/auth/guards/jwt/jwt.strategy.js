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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const passport_jwt_1 = require("passport-jwt");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const loginIdentity_dto_1 = require("../../dto/loginIdentity.dto");
const configkeys_enum_1 = require("../../../common/enum/configkeys.enum");
const users_service_1 = require("../../../users/users.service");
const class_transformer_1 = require("class-transformer");
const sucursal_entity_1 = require("../../../sucursales/sucursal.entity");
const typeorm_1 = require("typeorm");
let JwtStrategy = class JwtStrategy extends passport_1.PassportStrategy(passport_jwt_1.Strategy) {
    constructor(_configService, usersService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: _configService.get(configkeys_enum_1.ConfigKeys.JWT_SECRET),
        });
        this._configService = _configService;
        this.usersService = usersService;
    }
    async validate(payload) {
        const user = await this.usersService.getById(payload.sub);
        if (!user.active) {
            throw new common_1.HttpException('Su cuenta ha sido desactivada', common_1.HttpStatus.UNAUTHORIZED);
        }
        let sucursal;
        if (payload.sucursalId) {
            sucursal = await typeorm_1.getRepository(sucursal_entity_1.SucursalEntity).findOne(payload.sucursalId);
        }
        user.sucursal = sucursal;
        const result = class_transformer_1.plainToClass(loginIdentity_dto_1.LoginIdentityDTO, user);
        return result;
    }
};
JwtStrategy = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        users_service_1.UsersService])
], JwtStrategy);
exports.JwtStrategy = JwtStrategy;
//# sourceMappingURL=jwt.strategy.js.map