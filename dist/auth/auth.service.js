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
exports.AuthService = void 0;
const users_service_1 = require("../users/users.service");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcryptjs_1 = require("bcryptjs");
const users_entity_1 = require("../users/users.entity");
const lodash_1 = require("lodash");
const typeorm_1 = require("typeorm");
const config_1 = require("@nestjs/config");
const configkeys_enum_1 = require("../common/enum/configkeys.enum");
const profiles_enum_1 = require("../users/profiles.enum");
const userSucursales_entity_1 = require("../users/userSucursales.entity");
const sucursal_entity_1 = require("../sucursales/sucursal.entity");
let AuthService = class AuthService {
    constructor(usersService, jwtService, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async validateUser(email, pass, scope) {
        const user = await this.usersService.getByEmail(email, scope);
        if (!user) {
            return null;
        }
        if (user.profile === profiles_enum_1.ProfileTypes.EMPLEADO &&
            scope !== profiles_enum_1.ProfileTypes.EMPLEADO) {
            throw new common_1.HttpException('Su cuenta solo es de empleado', common_1.HttpStatus.UNAUTHORIZED);
        }
        if (!user.active) {
            throw new common_1.HttpException('Su cuenta no está activa', common_1.HttpStatus.UNAUTHORIZED);
        }
        if (!user.accesoSistema) {
            throw new common_1.HttpException('Usted no tiene acceso', common_1.HttpStatus.UNAUTHORIZED);
        }
        if (await bcryptjs_1.compare(pass, user.password)) {
            return lodash_1.omit(user, ['password']);
        }
        return null;
    }
    async login(user, rememberme, device, sucursalId) {
        let sucursal = null;
        if (sucursalId) {
            const userSucursal = await typeorm_1.getRepository(userSucursales_entity_1.UserSucursalesEntity).findOne({
                where: { sucursal: sucursalId, user: user.id },
            });
            if (!userSucursal) {
                throw new common_1.HttpException('Usuario y sucursal no corresponden.', common_1.HttpStatus.BAD_REQUEST);
            }
            sucursal = await typeorm_1.getRepository(sucursal_entity_1.SucursalEntity).findOne(sucursalId);
        }
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
            sucursal: sucursal
                ? {
                    id: sucursal.id,
                    uuid: sucursal.uuid,
                    nombre: sucursal.nombre,
                }
                : null,
        };
        const payload = { sub: user.id, uuid: user.uuid, sucursalId };
        const response = {
            access_token: this.jwtService.sign(payload, {
                expiresIn: rememberme
                    ? this.configService.get(configkeys_enum_1.ConfigKeys.JWT_REMEMBERME_EXPIRATION)
                    : this.configService.get(configkeys_enum_1.ConfigKeys.JWT_EXPIRATION),
            }),
            identity: identity,
        };
        const query = {
            jwt: response.access_token,
            device: {},
        };
        const queryUpdate = typeorm_1.getRepository(users_entity_1.UsersEntity)
            .createQueryBuilder()
            .where('id=:userId', { userId: user.id });
        if (device) {
            query.device = device;
        }
        await queryUpdate.update(query).execute();
        return response;
    }
    async cajasCajero(email) {
        const user = await typeorm_1.getRepository(users_entity_1.UsersEntity).findOne({
            where: { email: email },
        });
        if (!user) {
            throw new common_1.HttpException('El email no está registrado', common_1.HttpStatus.UNAUTHORIZED);
        }
        if (user.profile !== profiles_enum_1.ProfileTypes.SUCURSAL) {
            return {
                username: `${user.firstName} ${user.lastName}`,
                sucursales: [],
            };
        }
        const sucs = await typeorm_1.getRepository(userSucursales_entity_1.UserSucursalesEntity).find({
            where: { user: user.id },
            relations: ['sucursal'],
        });
        if (!sucs.length) {
            throw new common_1.HttpException('Aún no cuenta con sucursales asignadas.', common_1.HttpStatus.BAD_REQUEST);
        }
        return {
            username: `${user.firstName} ${user.lastName}`,
            sucursales: sucs.map((us) => {
                return {
                    id: us.sucursal.id,
                    nombre: us.sucursal.nombre,
                };
            }),
        };
    }
};
AuthService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map