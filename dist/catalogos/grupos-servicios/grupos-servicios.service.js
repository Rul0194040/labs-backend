"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GruposServiciosService = void 0;
const common_1 = require("@nestjs/common");
const paginationPrimeNg_dto_1 = require("../../common/DTO/paginationPrimeNg.dto");
const class_transformer_1 = require("class-transformer");
const typeorm_1 = require("typeorm");
const grupo_servicio_entity_1 = require("./grupo-servicio.entity");
const lodash_1 = require("lodash");
let GruposServiciosService = class GruposServiciosService {
    constructor() {
        this.notFoundMessage = 'Grupo no encontrado';
    }
    async create(grupoServicios) {
        const GrupoServiciosToCreate = class_transformer_1.plainToClass(grupo_servicio_entity_1.GrupoServicioEntity, grupoServicios);
        return typeorm_1.getRepository(grupo_servicio_entity_1.GrupoServicioEntity).save(GrupoServiciosToCreate);
    }
    async getById(id) {
        const gruposervicio = await typeorm_1.getRepository(grupo_servicio_entity_1.GrupoServicioEntity).findOne({
            id,
        });
        if (!gruposervicio) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        return gruposervicio;
    }
    async update(id, grupo) {
        const grupoServicios = await this.getById(id);
        if (!grupoServicios) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        return await typeorm_1.getRepository(grupo_servicio_entity_1.GrupoServicioEntity).update({ id }, grupo);
    }
    async updateStatus(id, active) {
        const grupoServicio = await this.getById(id);
        if (!grupoServicio) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        return await typeorm_1.getRepository(grupo_servicio_entity_1.GrupoServicioEntity)
            .createQueryBuilder('grupo')
            .update()
            .set({ active })
            .where({ id: grupoServicio.id })
            .execute();
    }
    async delete(id) {
        return typeorm_1.getRepository(grupo_servicio_entity_1.GrupoServicioEntity).delete({ id });
    }
    async paginate(options) {
        const dataQuery = typeorm_1.getRepository(grupo_servicio_entity_1.GrupoServicioEntity).createQueryBuilder('grupoServicios');
        lodash_1.forIn(options.filters, (value, key) => {
            if (key === 'nombre') {
                dataQuery.andWhere('( grupoServicios.nombre LIKE :term )', {
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
GruposServiciosService = __decorate([
    common_1.Injectable()
], GruposServiciosService);
exports.GruposServiciosService = GruposServiciosService;
//# sourceMappingURL=grupos-servicios.service.js.map