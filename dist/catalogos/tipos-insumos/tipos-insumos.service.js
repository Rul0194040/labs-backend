"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TiposInsumosService = void 0;
const common_1 = require("@nestjs/common");
const paginationPrimeNg_dto_1 = require("../../common/DTO/paginationPrimeNg.dto");
const class_transformer_1 = require("class-transformer");
const lodash_1 = require("lodash");
const typeorm_1 = require("typeorm");
const tipo_insumo_entity_1 = require("./tipo-insumo.entity");
let TiposInsumosService = class TiposInsumosService {
    constructor() {
        this.notFoundMessage = 'Tipo no encontrado';
    }
    async create(tipoInsumo) {
        const tipoInsumoToCreate = class_transformer_1.plainToClass(tipo_insumo_entity_1.TipoInsumoEntity, tipoInsumo);
        return typeorm_1.getRepository(tipo_insumo_entity_1.TipoInsumoEntity).save(tipoInsumoToCreate);
    }
    async getById(id) {
        const tipoInsumo = await typeorm_1.getRepository(tipo_insumo_entity_1.TipoInsumoEntity).findOne({
            id,
        });
        if (!tipoInsumo) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        return tipoInsumo;
    }
    async update(id, data) {
        const tipoInsumo = await this.getById(id);
        if (!tipoInsumo) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        return await typeorm_1.getRepository(tipo_insumo_entity_1.TipoInsumoEntity).update({ id }, data);
    }
    async updateStatus(id, active) {
        const tipoInusmo = await this.getById(id);
        if (!tipoInusmo) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        return await typeorm_1.getRepository(tipo_insumo_entity_1.TipoInsumoEntity)
            .createQueryBuilder('tipo')
            .update()
            .set({ active })
            .where({ id: tipoInusmo.id })
            .execute();
    }
    async delete(id) {
        return typeorm_1.getRepository(tipo_insumo_entity_1.TipoInsumoEntity).delete({ id });
    }
    async paginate(options) {
        const dataQuery = typeorm_1.getRepository(tipo_insumo_entity_1.TipoInsumoEntity).createQueryBuilder('tipoInsumo');
        lodash_1.forIn(options.filters, (value, key) => {
            if (key === 'nombre') {
                dataQuery.andWhere('( tipoInsumo.nombre LIKE :term )', {
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
TiposInsumosService = __decorate([
    common_1.Injectable()
], TiposInsumosService);
exports.TiposInsumosService = TiposInsumosService;
//# sourceMappingURL=tipos-insumos.service.js.map