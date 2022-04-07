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
var AppService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const configkeys_enum_1 = require("./common/enum/configkeys.enum");
const logger_1 = require("./logger");
const profiles_enum_1 = require("./users/profiles.enum");
const users_collection_1 = require("./users/users.collection");
const users_service_1 = require("./users/users.service");
let AppService = AppService_1 = class AppService {
    constructor(usersService, configService) {
        this.usersService = usersService;
        this.configService = configService;
        this.logger = new logger_1.MyLogger(AppService_1.name);
    }
    async initDatabase() {
        if (this.configService.get(configkeys_enum_1.ConfigKeys.CREATE_USERS)) {
            await this.createSuperUsers(users_collection_1.SuperUsersToCreate);
            await this.createSysAdminUsers(users_collection_1.AdminUsersToCreate);
            await this.createUserAlmacenGeneral(users_collection_1.AlmacenGeneralToCreate);
            await this.createUserSucursal(users_collection_1.SucursalToCreate);
            await this.createUserTesoreroSucursalesCentrales(users_collection_1.TesoreroSucCentralesToCreate);
            await this.createUserTesoreroSucursalesForaneas(users_collection_1.TesoreroSucForaneasToCreate);
            await this.createUserCompras(users_collection_1.ComprasToCreate);
            await this.createUserDirectivos(users_collection_1.DirectivosToCreate);
            await this.createUserGerenteSucursales(users_collection_1.GerenteSucursalesToCreate);
            await this.createUserVentaGeneral(users_collection_1.VentaGeneralToCreate);
        }
    }
    async createSuperUsers(requiredUsers) {
        const users = [];
        for (const user of requiredUsers) {
            const userFound = await this.usersService.getByEmail(user.email);
            if (!userFound) {
                try {
                    user.profile = profiles_enum_1.ProfileTypes.SUPER;
                    const createdUser = await this.usersService.create(user);
                    this.logger.log(`Created default user ${createdUser.email} (${createdUser.profile})`);
                    users.push(createdUser);
                }
                catch (error) {
                    throw error;
                }
            }
            else {
                users.push(userFound);
            }
        }
        return users;
    }
    async createSysAdminUsers(requiredUsers) {
        const users = [];
        for (const user of requiredUsers) {
            const userFound = await this.usersService.getByEmail(user.email);
            if (!userFound) {
                try {
                    user.profile = profiles_enum_1.ProfileTypes.SYSADMIN;
                    const createdUser = await this.usersService.create(user);
                    this.logger.log(`Created default user ${createdUser.email} (${createdUser.profile})`);
                    users.push(createdUser);
                }
                catch (error) {
                    throw error;
                }
            }
            else {
                users.push(userFound);
            }
        }
        return users;
    }
    async createUserAlmacenGeneral(requiredUsers) {
        const users = [];
        for (const user of requiredUsers) {
            const userFound = await this.usersService.getByEmail(user.email);
            if (!userFound) {
                try {
                    user.profile = profiles_enum_1.ProfileTypes.ALMACEN_GENERAL;
                    const createdUser = await this.usersService.create(user);
                    this.logger.log(`Created default user ${createdUser.email} (${createdUser.profile})`);
                    users.push(createdUser);
                }
                catch (error) {
                    throw error;
                }
            }
            else {
                users.push(userFound);
            }
        }
        return users;
    }
    async createUserSucursal(requiredUsers) {
        const users = [];
        for (const user of requiredUsers) {
            const userFound = await this.usersService.getByEmail(user.email);
            if (!userFound) {
                try {
                    user.profile = profiles_enum_1.ProfileTypes.SUCURSAL;
                    const createdUser = await this.usersService.create(user);
                    this.logger.log(`Created default user ${createdUser.email} (${createdUser.profile})`);
                    users.push(createdUser);
                }
                catch (error) {
                    throw error;
                }
            }
            else {
                users.push(userFound);
            }
        }
        return users;
    }
    async createUserTesoreroSucursalesCentrales(requiredUsers) {
        const users = [];
        for (const user of requiredUsers) {
            const userFound = await this.usersService.getByEmail(user.email);
            if (!userFound) {
                try {
                    user.profile = profiles_enum_1.ProfileTypes.TESORERO_SUCURSALES_CENTRALES;
                    const createdUser = await this.usersService.create(user);
                    this.logger.log(`Created default user ${createdUser.email} (${createdUser.profile})`);
                    users.push(createdUser);
                }
                catch (error) {
                    throw error;
                }
            }
            else {
                users.push(userFound);
            }
        }
        return users;
    }
    async createUserTesoreroSucursalesForaneas(requiredUsers) {
        const users = [];
        for (const user of requiredUsers) {
            const userFound = await this.usersService.getByEmail(user.email);
            if (!userFound) {
                try {
                    user.profile = profiles_enum_1.ProfileTypes.TESORERO_SUCURSALES_FORANEAS;
                    const createdUser = await this.usersService.create(user);
                    this.logger.log(`Created default user ${createdUser.email} (${createdUser.profile})`);
                    users.push(createdUser);
                }
                catch (error) {
                    throw error;
                }
            }
            else {
                users.push(userFound);
            }
        }
        return users;
    }
    async createUserCompras(requiredUsers) {
        const users = [];
        for (const user of requiredUsers) {
            const userFound = await this.usersService.getByEmail(user.email);
            if (!userFound) {
                try {
                    user.profile = profiles_enum_1.ProfileTypes.COMPRAS;
                    const createdUser = await this.usersService.create(user);
                    this.logger.log(`Created default user ${createdUser.email} (${createdUser.profile})`);
                    users.push(createdUser);
                }
                catch (error) {
                    throw error;
                }
            }
            else {
                users.push(userFound);
            }
        }
        return users;
    }
    async createUserDirectivos(requiredUsers) {
        const users = [];
        for (const user of requiredUsers) {
            const userFound = await this.usersService.getByEmail(user.email);
            if (!userFound) {
                try {
                    user.profile = profiles_enum_1.ProfileTypes.DIRECTIVOS;
                    const createdUser = await this.usersService.create(user);
                    this.logger.log(`Created default user ${createdUser.email} (${createdUser.profile})`);
                    users.push(createdUser);
                }
                catch (error) {
                    throw error;
                }
            }
            else {
                users.push(userFound);
            }
        }
        return users;
    }
    async createUserGerenteSucursales(requiredUsers) {
        const users = [];
        for (const user of requiredUsers) {
            const userFound = await this.usersService.getByEmail(user.email);
            if (!userFound) {
                try {
                    user.profile = profiles_enum_1.ProfileTypes.GERENTE_SUCURSALES;
                    const createdUser = await this.usersService.create(user);
                    this.logger.log(`Created default user ${createdUser.email} (${createdUser.profile})`);
                    users.push(createdUser);
                }
                catch (error) {
                    throw error;
                }
            }
            else {
                users.push(userFound);
            }
        }
        return users;
    }
    async createUserVentaGeneral(requiredUsers) {
        const users = [];
        for (const user of requiredUsers) {
            const userFound = await this.usersService.getByEmail(user.email);
            if (!userFound) {
                try {
                    user.profile = profiles_enum_1.ProfileTypes.VENTAS;
                    const createdUser = await this.usersService.create(user);
                    this.logger.log(`Created default user ${createdUser.email} (${createdUser.profile})`);
                    users.push(createdUser);
                }
                catch (error) {
                    throw error;
                }
            }
            else {
                users.push(userFound);
            }
        }
        return users;
    }
};
AppService = AppService_1 = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        config_1.ConfigService])
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map