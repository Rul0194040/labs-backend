"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncentivosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const incentivos_entity_1 = require("./entity/incentivos.entity");
const pagination_prime_Ng_result_dto_1 = require("../../common/DTO/pagination-prime-Ng-result.dto");
const paginationPrimeNg_dto_1 = require("../../common/DTO/paginationPrimeNg.dto");
const lodash_1 = require("lodash");
let IncentivosService = class IncentivosService {
    async crearIncentivo(incentivo) {
        return await typeorm_1.getRepository(incentivos_entity_1.IncentivoEntity).save(incentivo);
    }
    async actualizarIncentivo(incentivoId, incentivo) {
        return await typeorm_1.getRepository(incentivos_entity_1.IncentivoEntity).update(incentivoId, incentivo);
    }
    async getbyInsentivo(incentivoId) {
        return await typeorm_1.getRepository(incentivos_entity_1.IncentivoEntity).findOne(incentivoId);
    }
    async paginate(options) {
        const dataQuery = typeorm_1.getRepository(incentivos_entity_1.IncentivoEntity).createQueryBuilder();
        lodash_1.forIn(options.filters, (value, key) => {
            if (key === 'nombre') {
                dataQuery.andWhere('( nombre LIKE :term )', {
                    term: `%${value.split(' ').join('%')}%`,
                });
            }
        });
        if (options.sort === undefined || !Object.keys(options.sort).length) {
            options.sort = 'createdAt';
        }
        const count = await dataQuery.getCount();
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
IncentivosService = __decorate([
    common_1.Injectable()
], IncentivosService);
exports.IncentivosService = IncentivosService;
//# sourceMappingURL=incentivos.service.js.map