"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProveedoresService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const proveedores_entity_1 = require("./proveedores.entity");
const class_transformer_1 = require("class-transformer");
const pagination_prime_Ng_result_dto_1 = require("../../common/DTO/pagination-prime-Ng-result.dto");
const lodash_1 = require("lodash");
let ProveedoresService = class ProveedoresService {
    async getById(id) {
        return await typeorm_1.getRepository(proveedores_entity_1.ProveedorEntity).findOne({ id });
    }
    async create(data) {
        const proveedor = class_transformer_1.plainToClass(proveedores_entity_1.ProveedorEntity, data);
        const proveedorCreado = typeorm_1.getRepository(proveedores_entity_1.ProveedorEntity).save(proveedor);
        return proveedorCreado;
    }
    async update(id, data) {
        return await typeorm_1.getRepository(proveedores_entity_1.ProveedorEntity)
            .createQueryBuilder()
            .update()
            .set(data)
            .where('id=:id', { id })
            .execute();
    }
    async delete(id) {
        return await typeorm_1.getRepository(proveedores_entity_1.ProveedorEntity).delete(id);
    }
    async paginate(options) {
        const dataQuery = typeorm_1.getRepository(proveedores_entity_1.ProveedorEntity).createQueryBuilder('proveedor');
        lodash_1.forIn(options.filters, (value, key) => {
            if (key === 'nombre') {
                dataQuery.andWhere('( proveedor.nombre LIKE :term )', {
                    term: `%${value.split(' ').join('%')}%`,
                });
            }
        });
        const count = await dataQuery.getCount();
        if (options.sort === undefined) {
            options.sort = 'createdAt';
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
};
ProveedoresService = __decorate([
    common_1.Injectable()
], ProveedoresService);
exports.ProveedoresService = ProveedoresService;
//# sourceMappingURL=proveedores.service.js.map