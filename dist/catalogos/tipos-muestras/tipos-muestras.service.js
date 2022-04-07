"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TiposMuestrasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const tipos_muestras_entity_1 = require("./tipos-muestras.entity");
const paginationPrimeNg_dto_1 = require("../../common/DTO/paginationPrimeNg.dto");
const class_transformer_1 = require("class-transformer");
const lodash_1 = require("lodash");
let TiposMuestrasService = class TiposMuestrasService {
    constructor() {
        this.notFoundMessage = 'Grupo no encontrado';
    }
    async create(tipoMuestra) {
        const tipoMuestraToCreate = class_transformer_1.plainToClass(tipos_muestras_entity_1.TipoMuestraEntity, tipoMuestra);
        return typeorm_1.getRepository(tipos_muestras_entity_1.TipoMuestraEntity).save(tipoMuestraToCreate);
    }
    async getById(id) {
        const tipoMuestra = await typeorm_1.getRepository(tipos_muestras_entity_1.TipoMuestraEntity).findOne({
            id,
        });
        if (!tipoMuestra) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        return tipoMuestra;
    }
    async update(id, tipo) {
        const tipoMuestra = await this.getById(id);
        if (!tipoMuestra) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        return await typeorm_1.getRepository(tipos_muestras_entity_1.TipoMuestraEntity).update({ id }, tipo);
    }
    async updateStatus(id, active) {
        const tipoMuestra = await this.getById(id);
        if (!tipoMuestra) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        return await typeorm_1.getRepository(tipos_muestras_entity_1.TipoMuestraEntity)
            .createQueryBuilder('grupo')
            .update()
            .set({ active })
            .where({ id: tipoMuestra.id })
            .execute();
    }
    async delete(id) {
        return typeorm_1.getRepository(tipos_muestras_entity_1.TipoMuestraEntity).delete({ id });
    }
    async paginate(options) {
        const dataQuery = typeorm_1.getRepository(tipos_muestras_entity_1.TipoMuestraEntity).createQueryBuilder('tipoMuestra');
        lodash_1.forIn(options.filters, (value, key) => {
            if (key === 'nombre') {
                dataQuery.andWhere('( tipoMuestra.nombre LIKE :term )', {
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
TiposMuestrasService = __decorate([
    common_1.Injectable()
], TiposMuestrasService);
exports.TiposMuestrasService = TiposMuestrasService;
//# sourceMappingURL=tipos-muestras.service.js.map