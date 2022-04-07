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
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const email_service_1 = require("../common/services/mailer/email.service");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const bcryptjs_1 = require("bcryptjs");
const users_entity_1 = require("./users.entity");
const bcryptjs_2 = require("bcryptjs");
const uuid_1 = require("uuid");
const configkeys_enum_1 = require("../common/enum/configkeys.enum");
const config_1 = require("@nestjs/config");
const moment = require("moment");
const pagination_prime_Ng_result_dto_1 = require("../common/DTO/pagination-prime-Ng-result.dto");
const lodash_1 = require("lodash");
const sucursal_entity_1 = require("../sucursales/sucursal.entity");
const paginationPrimeNg_dto_1 = require("../common/DTO/paginationPrimeNg.dto");
const userSucursales_entity_1 = require("./userSucursales.entity");
const profiles_enum_1 = require("./profiles.enum");
const readXlsxFile = require("read-excel-file/node");
const loginIdentity_dto_1 = require("../auth/dto/loginIdentity.dto");
const logger_1 = require("../logger");
let UsersService = UsersService_1 = class UsersService {
    constructor(configService, mailSenderService) {
        this.configService = configService;
        this.mailSenderService = mailSenderService;
        this.logger = new logger_1.MyLogger(UsersService_1.name);
    }
    async getMatrizAdmins() {
        return await typeorm_1.getRepository(users_entity_1.UsersEntity)
            .createQueryBuilder()
            .where('profile=:profile', { profile: profiles_enum_1.ProfileTypes.ALMACEN_GENERAL })
            .getMany();
    }
    async getAdminsSuc(sucursalId) {
        return await typeorm_1.getRepository(users_entity_1.UsersEntity)
            .createQueryBuilder('user')
            .leftJoin('user.sucursal', 'sucursal')
            .where('sucursal.id=:sucursalId AND user.profile=:profile AND user.active=:active', {
            profile: profiles_enum_1.ProfileTypes.SUCURSAL,
            active: true,
            sucursalId,
        })
            .getMany();
    }
    async paginate(options) {
        const dataQuery = typeorm_1.getRepository(users_entity_1.UsersEntity)
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.sucursal', 'sucursal')
            .select([
            'user',
            'sucursal.id',
            'sucursal.nombre',
            'sucursal.esMatriz',
            'sucursal.esLaboratorio',
            'sucursal.responsable',
        ]);
        lodash_1.forIn(options.filters, (value, key) => {
            if (key === 'nombre') {
                dataQuery.andWhere('( user.firstName LIKE :term )', {
                    term: `%${value.split(' ').join('%')}%`,
                });
                dataQuery.orWhere('( user.lastName LIKE :term )', {
                    term: `%${value.split(' ').join('%')}%`,
                });
                dataQuery.orWhere('( user.email LIKE :term )', {
                    term: `%${value.split(' ').join('%')}%`,
                });
            }
        });
        const count = await dataQuery.getCount();
        if (options.sort === undefined) {
            options.sort = 'user.createdAt';
        }
        const data = await dataQuery
            .skip(options.skip)
            .take(options.take)
            .orderBy(options.sort, 'DESC')
            .getMany();
        return {
            data: data,
            skip: options.skip,
            totalItems: count,
        };
    }
    async getById(id) {
        return typeorm_1.getRepository(users_entity_1.UsersEntity)
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.sucursal', 'sucursal')
            .where('user.id = :theId', { theId: id })
            .getOne();
    }
    async getByEmail(email, profile) {
        const q = typeorm_1.getRepository(users_entity_1.UsersEntity)
            .createQueryBuilder('user')
            .select(['user'])
            .where('user.email = :email', { email: email })
            .addSelect('user.password');
        if (profile) {
            q.andWhere('user.profile = :p', { p: profile });
        }
        return q.getOne();
    }
    async statusById(id, status) {
        return await typeorm_1.getRepository(users_entity_1.UsersEntity)
            .createQueryBuilder()
            .update()
            .set({
            active: status.active,
        })
            .where('id=:id', { id })
            .execute();
    }
    async create(userdto, sendThisEmail = false) {
        if (!userdto.password) {
            userdto.password = this.configService.get(configkeys_enum_1.ConfigKeys.FIRST_PASSWORD);
        }
        const newHash = await bcryptjs_2.hash(userdto.password, await bcryptjs_2.genSalt(10));
        const origPass = userdto.password;
        userdto.password = newHash;
        const userNip = await typeorm_1.getRepository(users_entity_1.UsersEntity).findOne({
            where: { nip: userdto.nip },
        });
        if (userNip) {
            throw new common_1.HttpException('el nip que intenta guardar ya existe', common_1.HttpStatus.BAD_REQUEST);
        }
        const usuario = {
            email: userdto.email,
            firstName: userdto.firstName,
            lastName: userdto.lastName,
            profile: userdto.profile,
            password: userdto.password,
            active: userdto.active,
            rules: userdto.rules,
            telefono: userdto.telefono,
            sucursal: null,
            nip: userdto.nip,
            maxDescuento: userdto.maxDescuento,
            tipoEmpleado: userdto.tipoEmpleado,
            comisionVendedor: userdto.comisionVendedor,
            accesoSistema: true,
        };
        if (userdto.sucursal) {
            const sucursal = await typeorm_1.getRepository(sucursal_entity_1.SucursalEntity).findOne({
                id: userdto.sucursal,
            });
            if (!sucursal) {
                throw new common_1.HttpException('La sucursal no existe', common_1.HttpStatus.NOT_FOUND);
            }
            usuario.sucursal = sucursal;
        }
        if (!userdto.profile && userdto.sucursal) {
            usuario.profile = profiles_enum_1.ProfileTypes.SUCURSAL;
        }
        if (userdto.tipoEmpleado === profiles_enum_1.PerfilTipoEmpleado.MAQUILADOR) {
            usuario.accesoSistema = false;
        }
        const savedUser = await typeorm_1.getRepository(users_entity_1.UsersEntity).save(usuario);
        if (this.configService.get(configkeys_enum_1.ConfigKeys.SEND_USER_EMAILS) &&
            sendThisEmail) {
            this.mailSenderService.send({
                to: userdto.email,
                subject: 'Tu nueva cuenta está lista ✔',
            }, 'welcome-user', {
                userName: `${userdto.firstName} ${userdto.lastName}`,
                password: origPass,
                siteName: this.configService.get(configkeys_enum_1.ConfigKeys.SITE_NAME),
            });
        }
        return savedUser;
    }
    async update(id, data) {
        const user = await typeorm_1.getRepository(users_entity_1.UsersEntity).findOne(id);
        if (user && user.nip != data.nip) {
            const userNip = await typeorm_1.getRepository(users_entity_1.UsersEntity).findOne({
                where: { nip: data.nip },
            });
            if (userNip) {
                throw new common_1.HttpException('imposible actualizar, el nip que intenta cambiar ya existe', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        return await typeorm_1.getRepository(users_entity_1.UsersEntity)
            .createQueryBuilder()
            .update()
            .set({
            firstName: data.firstName,
            lastName: data.lastName,
            telefono: data.telefono,
            email: data.email,
            nip: data.nip,
            maxDescuento: data.maxDescuento,
            comisionVendedor: data.comisionVendedor,
            grabandoRules: data.grabandoRules,
            accesoSistema: data.accesoSistema,
        })
            .where('id=:id', { id })
            .execute();
    }
    async changePassword(user, password, newPassword) {
        const theUser = await typeorm_1.getRepository(users_entity_1.UsersEntity)
            .createQueryBuilder('user')
            .where('user.email = :email', { email: user.email })
            .addSelect('user.password')
            .getOne();
        if (!(await bcryptjs_1.compare(password, theUser.password))) {
            throw new common_1.HttpException('La contraseña anterior no es válida.', common_1.HttpStatus.BAD_REQUEST);
        }
        const newHash = await bcryptjs_2.hash(newPassword, await bcryptjs_2.genSalt(10));
        const updateResult = await typeorm_1.getRepository(users_entity_1.UsersEntity)
            .createQueryBuilder('user')
            .update()
            .set({ password: newHash, passwordToken: '', passwordTokenDate: '' })
            .where('id=:id', { id: user.id })
            .execute();
        if (updateResult.affected) {
            this.mailSenderService.send({
                to: user.email,
                subject: 'Su contraseña ha sido cambiada ✔',
            }, 'changed-password', {
                siteName: this.configService.get(configkeys_enum_1.ConfigKeys.SITE_NAME),
                user,
                newPassword,
            });
        }
        return updateResult;
    }
    async delete(id) {
        return await typeorm_1.getRepository(users_entity_1.UsersEntity)
            .createQueryBuilder()
            .delete()
            .where('id=:id', { id })
            .execute();
    }
    async changePasswordByToken(email, theToken, newPassword) {
        const now = moment().format('YYYY-MM-DD H:m:s');
        console.log('now', now);
        const newHash = await bcryptjs_2.hash(newPassword, await bcryptjs_2.genSalt(10));
        const updateResult = await typeorm_1.getRepository(users_entity_1.UsersEntity)
            .createQueryBuilder('user')
            .update()
            .set({ password: newHash, passwordToken: '', passwordTokenDate: '' })
            .where('email=:email', { email })
            .andWhere('passwordToken = :theToken', { theToken })
            .andWhere('passwordTokenDate >= :now', { now })
            .execute();
        if (updateResult.affected) {
            this.mailSenderService.send({
                to: email,
                subject: 'Su contraseña ha sido cambiada ✔',
            }, 'changed-password', { siteName: this.configService.get(configkeys_enum_1.ConfigKeys.SITE_NAME) });
        }
        return updateResult;
    }
    async startPasswordReset(email) {
        const user = await typeorm_1.getRepository(users_entity_1.UsersEntity)
            .createQueryBuilder('user')
            .select(['user'])
            .where('email=:email', { email })
            .getOne();
        if (user) {
            const token = uuid_1.v4();
            const vencimiento = new Date(Date.now() + 1000 * 60 * 10);
            const result = await typeorm_1.getRepository(users_entity_1.UsersEntity)
                .createQueryBuilder()
                .update()
                .set({ passwordToken: token, passwordTokenDate: vencimiento })
                .where('email=:theEmail', { theEmail: email })
                .execute();
            const baseUrl = this.configService.get(configkeys_enum_1.ConfigKeys.BASE_URL);
            if (result.affected) {
                const context = {
                    userName: user.firstName + ' ' + user.lastName,
                    token: token,
                    passwordUrl: `${baseUrl}#/browse/user/change-password/${token}`,
                    siteName: this.configService.get(configkeys_enum_1.ConfigKeys.SITE_NAME),
                };
                this.mailSenderService.send({
                    to: user.email,
                    subject: 'Solicitud de cambio de contraseña ✔',
                }, 'change-password', context);
            }
        }
    }
    async setEmailToken(id, token) {
        let response;
        const user = await typeorm_1.getRepository(users_entity_1.UsersEntity).findOne(id);
        user.emailToken = token;
        typeorm_1.getRepository(users_entity_1.UsersEntity)
            .update(id, user)
            .then(() => {
            response = true;
        })
            .catch(() => {
            response = false;
        });
        return response;
    }
    async startEmailValidate(id) {
        const user = await typeorm_1.getRepository(users_entity_1.UsersEntity).findOne(id);
        const token = (Math.random() * 1000000).toString();
        const result = await this.setEmailToken(id, token);
        if (!result) {
            return false;
        }
        this.mailSenderService.send({
            to: user.email,
            subject: 'Validación de correo electrónico ✔',
        }, 'validate-email', { user: user, token: token });
        return true;
    }
    async emailValidate(id, token) {
        const user = await typeorm_1.getRepository(users_entity_1.UsersEntity).findOne(id);
        let result = false;
        if (user.emailToken === token) {
            result = await this.validEmail(id);
        }
        return result;
    }
    async validEmail(id) {
        let response;
        const user = await typeorm_1.getRepository(users_entity_1.UsersEntity).findOne(id);
        user.validEmail = true;
        user.emailToken = '';
        typeorm_1.getRepository(users_entity_1.UsersEntity)
            .update(id, user)
            .then(() => {
            response = true;
        })
            .catch(() => {
            response = false;
        });
        return response;
    }
    async updateUserPicture(id, picUrl) {
        return await typeorm_1.getRepository(users_entity_1.UsersEntity)
            .createQueryBuilder()
            .update()
            .set({ picUrl })
            .where('id=:id', { id: id })
            .execute();
    }
    async getProfiles() {
        const profiles = {
            ALMACEN_GENERAL: profiles_enum_1.ProfileTypes.ALMACEN_GENERAL,
            TESORERO_SUCURSALES_CENTRALES: profiles_enum_1.ProfileTypes.TESORERO_SUCURSALES_CENTRALES,
            TESORERO_SUCURSALES_FORANEAS: profiles_enum_1.ProfileTypes.TESORERO_SUCURSALES_FORANEAS,
            COMPRAS: profiles_enum_1.ProfileTypes.COMPRAS,
            DIRECTIVOS: profiles_enum_1.ProfileTypes.DIRECTIVOS,
            GERENTE_SUCURSALES: profiles_enum_1.ProfileTypes.GERENTE_SUCURSALES,
            SUCURSAL: profiles_enum_1.ProfileTypes.SUCURSAL,
            EMPLEADO: profiles_enum_1.ProfileTypes.EMPLEADO,
        };
        return profiles;
    }
    async getPerfilTipoEmpleados() {
        const tipoEmpleado = {
            GENERAL: profiles_enum_1.PerfilTipoEmpleado.GENERAL,
            CAPTADOR: profiles_enum_1.PerfilTipoEmpleado.CAPTADOR,
            MAQUILADOR: profiles_enum_1.PerfilTipoEmpleado.MAQUILADOR,
            VENDEDOR: profiles_enum_1.PerfilTipoEmpleado.VENDEDOR,
        };
        return tipoEmpleado;
    }
    async getSucursales(uId) {
        const result = await typeorm_1.getRepository(userSucursales_entity_1.UserSucursalesEntity).find({
            where: {
                user: uId,
            },
            relations: ['sucursal'],
        });
        return result.map((us) => {
            return {
                id: us.sucursal.id,
                nombre: us.sucursal.nombre,
            };
        });
    }
    async asignarUsuarioSucursal(uId, sId) {
        const existe = await typeorm_1.getRepository(userSucursales_entity_1.UserSucursalesEntity).findOne({
            user: uId,
            sucursal: sId,
        });
        if (!existe) {
            return await typeorm_1.getRepository(userSucursales_entity_1.UserSucursalesEntity).save({
                user: uId,
                sucursal: sId,
            });
        }
        return existe;
    }
    async desasignarUsuarioSucursal(uId, sId) {
        const result = await typeorm_1.getRepository(userSucursales_entity_1.UserSucursalesEntity).delete({
            user: uId,
            sucursal: sId,
        });
        return result;
    }
    async grabarRule(rule, userId) {
        const user = await typeorm_1.getRepository(users_entity_1.UsersEntity)
            .createQueryBuilder('user')
            .where('user.id = :uId', { uId: userId })
            .getOne();
        if (user.rules.indexOf(rule) > -1) {
            return 'duplicated';
        }
        user.rules.push(rule);
        await typeorm_1.getRepository(users_entity_1.UsersEntity).update(user.id, { rules: user.rules });
        return 'ok';
    }
    async finalizarGrabado(userId) {
        return await typeorm_1.getRepository(users_entity_1.UsersEntity).update(userId, {
            grabandoRules: false,
        });
    }
    async activarGrabado(userId, estatus = true) {
        return await typeorm_1.getRepository(users_entity_1.UsersEntity).update(userId, {
            grabandoRules: estatus,
        });
    }
    async importarEmpleados(xlsFile, sendEmails = false) {
        this.logger.verbose('Abriendo archivo ' + xlsFile);
        const rows = await readXlsxFile(xlsFile, { dateFormat: 'MM/DD/YY' });
        this.logger.verbose('Encontrados ' + rows.length + ' clientes');
        for (let r = 1; r <= rows.length - 1; r++) {
            const row = rows[r];
            const nombre = row[0]
                ? row[0].toString().trim().toUpperCase().split(' ')
                : null;
            const email = row[4] ? row[4].trim().toLowerCase() : null;
            if (email) {
                const firstName = nombre[2] + ' ' + nombre[3] + (nombre.lenght === 5 ? nombre[4] : '');
                const lastName = nombre[0] + ' ' + nombre[1];
                const existe = await typeorm_1.getRepository(users_entity_1.UsersEntity).findOne({
                    where: { email: email },
                });
                if (!existe) {
                    const creado = await this.create({
                        firstName,
                        lastName,
                        email,
                        tipoEmpleado: profiles_enum_1.PerfilTipoEmpleado.GENERAL,
                        active: false,
                        profile: profiles_enum_1.ProfileTypes.EMPLEADO,
                    }, sendEmails);
                    this.logger.verbose('Creado empleado: ' + creado.email);
                }
                else {
                    this.logger.verbose('Existente ' + existe.email);
                }
            }
        }
        return rows;
    }
};
UsersService = UsersService_1 = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        email_service_1.MailService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map