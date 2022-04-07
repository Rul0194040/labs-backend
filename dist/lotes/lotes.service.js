"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LotesService = void 0;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const typeorm_1 = require("typeorm");
const lotes_entity_1 = require("./lotes.entity");
const pagination_prime_Ng_result_dto_1 = require("../common/DTO/pagination-prime-Ng-result.dto");
const lodash_1 = require("lodash");
let LotesService = class LotesService {
    async create(lote) {
        const createLote = class_transformer_1.plainToClass(lotes_entity_1.LoteEntity, lote);
        return await typeorm_1.getRepository(lotes_entity_1.LoteEntity).save(createLote);
    }
    async getById(id) {
        const lote = await typeorm_1.getRepository(lotes_entity_1.LoteEntity).findOne(id);
        if (!lote) {
            throw new common_1.HttpException('El lote no existe', common_1.HttpStatus.NOT_FOUND);
        }
        return lote;
    }
    async update(id, updateLote) {
        const lote = await this.getById(id);
        if (!lote) {
            throw new common_1.HttpException('El lote no existe', common_1.HttpStatus.NOT_FOUND);
        }
        return await typeorm_1.getRepository(lotes_entity_1.LoteEntity).update({ id }, updateLote);
    }
    async delete(id) {
        return typeorm_1.getRepository(lotes_entity_1.LoteEntity).delete({ id });
    }
    async paginate(options) {
        const dataQuery = typeorm_1.getRepository(lotes_entity_1.LoteEntity).createQueryBuilder('lote');
        lodash_1.forIn(options.filters, (value, key) => {
            if (key === 'nombre') {
                dataQuery.andWhere('lote.numero like :term', {
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
LotesService = __decorate([
    common_1.Injectable()
], LotesService);
exports.LotesService = LotesService;
//# sourceMappingURL=lotes.service.js.map