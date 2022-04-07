"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TiposUnidadesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const tipos_unidades_entity_1 = require("./tipos-unidades.entity");
const class_transformer_1 = require("class-transformer");
const paginationPrimeNg_dto_1 = require("../../common/DTO/paginationPrimeNg.dto");
const lodash_1 = require("lodash");
let TiposUnidadesService = class TiposUnidadesService {
    constructor() {
        this.notFoundMessage = 'Grupo no encontrado';
    }
    async create(tipounidad) {
        const tipounidadToCreate = class_transformer_1.plainToClass(tipos_unidades_entity_1.TipoUnidadEntity, tipounidad);
        return typeorm_1.getRepository(tipos_unidades_entity_1.TipoUnidadEntity).save(tipounidadToCreate);
    }
    async getById(id) {
        const tipounidad = await typeorm_1.getRepository(tipos_unidades_entity_1.TipoUnidadEntity).findOne({
            id,
        });
        if (!tipounidad) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        return tipounidad;
    }
    async update(id, tipo) {
        const tipounidad = await this.getById(id);
        if (!tipounidad) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        return await typeorm_1.getRepository(tipos_unidades_entity_1.TipoUnidadEntity).update({ id }, tipo);
    }
    async updateStatus(id, active) {
        const tipounidad = await this.getById(id);
        if (!tipounidad) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        return await typeorm_1.getRepository(tipos_unidades_entity_1.TipoUnidadEntity)
            .createQueryBuilder('grupo')
            .update()
            .set({ active })
            .where({ id: tipounidad.id })
            .execute();
    }
    async delete(id) {
        return typeorm_1.getRepository(tipos_unidades_entity_1.TipoUnidadEntity).delete({ id });
    }
    async paginate(options) {
        const dataQuery = typeorm_1.getRepository(tipos_unidades_entity_1.TipoUnidadEntity).createQueryBuilder('tipounidad');
        lodash_1.forIn(options.filters, (value, key) => {
            if (key === 'nombre') {
                dataQuery.andWhere('( tipounidad.nombre LIKE :term )', {
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
TiposUnidadesService = __decorate([
    common_1.Injectable()
], TiposUnidadesService);
exports.TiposUnidadesService = TiposUnidadesService;
//# sourceMappingURL=tipos-unidades.service.js.map