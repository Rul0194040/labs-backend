"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SucursalesService = void 0;
const ventas_entity_1 = require("../../ventas/ventas.entity");
const pagos_entity_1 = require("../../pagos/pagos.entity");
const common_1 = require("@nestjs/common");
const sucursal_entity_1 = require("../sucursal.entity");
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const paginationPrimeNg_dto_1 = require("../../common/DTO/paginationPrimeNg.dto");
const lodash_1 = require("lodash");
const api_keys_entity_1 = require("../api-keys.entity");
const userSucursales_entity_1 = require("../../users/userSucursales.entity");
const users_entity_1 = require("../../users/users.entity");
let SucursalesService = class SucursalesService {
    constructor() {
        this.notFoundMessage = 'Sucursal no encontrada';
    }
    async create(sucursal) {
        if (sucursal.esMatriz) {
            const hayMatriz = await typeorm_1.getRepository(sucursal_entity_1.SucursalEntity).findOne({
                esMatriz: true,
            });
            if (hayMatriz) {
                throw new common_1.HttpException('Ya existe una matriz', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        if (sucursal.responsableId) {
            const responsable = await typeorm_1.getRepository(users_entity_1.UsersEntity).findOne(sucursal.responsableId);
            sucursal.userResponsable = responsable;
        }
        const sucursalToCreate = class_transformer_1.plainToClass(sucursal_entity_1.SucursalEntity, sucursal);
        const sucursalCreada = await typeorm_1.getRepository(sucursal_entity_1.SucursalEntity).save(sucursalToCreate);
        await typeorm_1.getRepository(api_keys_entity_1.ApiKeyEntity).save({
            sucursal: sucursalCreada,
            nombre: sucursal.apiKey,
        });
        return sucursalCreada;
    }
    async getById(id) {
        const sucursal = await typeorm_1.getRepository(sucursal_entity_1.SucursalEntity)
            .createQueryBuilder('sucursal')
            .leftJoin('sucursal.apikeys', 'apikeys')
            .leftJoin('sucursal.userResponsable', 'userResponsable')
            .select([
            'sucursal',
            'apikeys',
            'userResponsable.id',
            'userResponsable.firstName',
            'userResponsable.lastName',
            'userResponsable.email',
        ])
            .where('sucursal.id = :id', { id: id })
            .getOne();
        if (!sucursal) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        return sucursal;
    }
    async update(id, sucursal) {
        const theSucursal = await this.getById(id);
        if (!theSucursal) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        if (sucursal.responsableId) {
            const responsable = await typeorm_1.getRepository(users_entity_1.UsersEntity).findOne(sucursal.responsableId);
            sucursal.userResponsable = responsable;
            delete sucursal.responsableId;
        }
        return await typeorm_1.getRepository(sucursal_entity_1.SucursalEntity).update({ id }, sucursal);
    }
    async updateStatus(id, active) {
        const theSucursal = await this.getById(id);
        if (!theSucursal) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        return await typeorm_1.getRepository(sucursal_entity_1.SucursalEntity)
            .createQueryBuilder('sucursal')
            .update()
            .set({ active })
            .where({ id: theSucursal.id })
            .execute();
    }
    async delete(id) {
        return typeorm_1.getRepository(sucursal_entity_1.SucursalEntity).delete({ id });
    }
    async paginate(options) {
        const dataQuery = typeorm_1.getRepository(sucursal_entity_1.SucursalEntity)
            .createQueryBuilder('sucursal')
            .leftJoin('sucursal.userResponsable', 'userResponsable')
            .select([
            'sucursal',
            'userResponsable.id',
            'userResponsable.firstName',
            'userResponsable.lastName',
            'userResponsable.email',
        ]);
        lodash_1.forIn(options.filters, (value, key) => {
            if (key === 'nombre') {
                dataQuery.andWhere('( sucursal.nombre LIKE :term )', {
                    term: `%${value.split(' ').join('%')}%`,
                });
            }
        });
        const count = await dataQuery.getCount();
        if (options.sort === undefined) {
            options.sort = 'id';
        }
        let direction = 'ASC';
        if (options.direction) {
            direction = options.direction;
        }
        const data = await dataQuery
            .skip(options.skip)
            .take(options.take)
            .orderBy(options.sort, direction)
            .getMany();
        return {
            data: data,
            skip: options.skip,
            totalItems: count,
        };
    }
    async getSucursalMatriz() {
        return await typeorm_1.getRepository(sucursal_entity_1.SucursalEntity)
            .createQueryBuilder('sucursal')
            .where('sucursal.esMatriz = :esMatriz', { esMatriz: true })
            .getOne();
    }
    async getUsersBySucursal(idSucursal) {
        const uss = await typeorm_1.getRepository(userSucursales_entity_1.UserSucursalesEntity).find({
            where: { sucursal: idSucursal },
            relations: ['user'],
        });
        const usuarios = uss.map((us) => {
            return {
                email: us.user.email,
                firstName: us.user.firstName,
                lastName: us.user.lastName,
                profile: us.user.profile,
                active: us.user.active,
                id: us.user.id,
                rules: us.user.rules,
                uuid: us.user.uuid,
                picUrl: us.user.picUrl,
                telefono: us.user.telefono,
            };
        });
        return usuarios;
    }
    async getByApiKey(apikey) {
        return typeorm_1.getRepository(sucursal_entity_1.SucursalEntity)
            .createQueryBuilder('sucursal')
            .leftJoinAndSelect('sucursal.apikeys', 'apikeys')
            .where('apikeys.active = :activos AND apikeys.key = :theKey', {
            activos: true,
            theKey: apikey,
        })
            .getOne();
    }
    async crearApiKey(sucursalId, nombre) {
        const sucursal = await this.getById(sucursalId);
        if (!sucursal) {
            throw new common_1.HttpException('No existe la sucursal', common_1.HttpStatus.NOT_FOUND);
        }
        return typeorm_1.getRepository(api_keys_entity_1.ApiKeyEntity).save({
            sucursal,
            nombre,
        });
    }
    async estatusApiKey(key, active) {
        const apiKey = await typeorm_1.getRepository(api_keys_entity_1.ApiKeyEntity).findOne({
            where: { key: key },
        });
        if (!apiKey) {
            throw new common_1.HttpException('No existe el api key', common_1.HttpStatus.NOT_FOUND);
        }
        return typeorm_1.getRepository(api_keys_entity_1.ApiKeyEntity).update({ id: apiKey.id }, {
            active,
        });
    }
    async renameApiKey(key, nombre) {
        const apiKey = await typeorm_1.getRepository(api_keys_entity_1.ApiKeyEntity).findOne({
            where: { key: key },
        });
        if (!apiKey) {
            throw new common_1.HttpException('No existe el api key', common_1.HttpStatus.NOT_FOUND);
        }
        return typeorm_1.getRepository(api_keys_entity_1.ApiKeyEntity).update({ id: apiKey.id }, {
            nombre,
        });
    }
    async asegurarApiKeys() {
        const ss = await typeorm_1.getRepository(sucursal_entity_1.SucursalEntity).find({
            where: { active: true },
            relations: ['apikeys'],
        });
        const as = [];
        for (let index = 0; index < ss.length; index++) {
            const s = ss[index];
            if (!s.apikeys.length) {
                as.push(await typeorm_1.getRepository(api_keys_entity_1.ApiKeyEntity).save({
                    sucursal: s,
                    nombre: 'Default',
                }));
            }
        }
        return as;
    }
};
SucursalesService = __decorate([
    common_1.Injectable()
], SucursalesService);
exports.SucursalesService = SucursalesService;
//# sourceMappingURL=sucursales.service.js.map