"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsumosService = void 0;
const tipo_insumo_entity_1 = require("../catalogos/tipos-insumos/tipo-insumo.entity");
const common_1 = require("@nestjs/common");
const paginationPrimeNg_dto_1 = require("../common/DTO/paginationPrimeNg.dto");
const class_transformer_1 = require("class-transformer");
const typeorm_1 = require("typeorm");
const insumo_entity_1 = require("./insumo.entity");
const lodash_1 = require("lodash");
let InsumosService = class InsumosService {
    constructor() {
        this.notFoundMessage = 'Insumo no encontrada';
    }
    async create(insumo) {
        const tipoInsumo = await typeorm_1.getRepository(tipo_insumo_entity_1.TipoInsumoEntity).findOne({
            id: insumo.tipoInsumo,
        });
        const tipoUnidad = await typeorm_1.getRepository(tipo_insumo_entity_1.TipoInsumoEntity).findOne({
            id: insumo.tipoUnidad,
        });
        const insumoToCreate = class_transformer_1.plainToClass(insumo_entity_1.InsumoEntity, insumo);
        insumoToCreate.tipoInsumo = tipoInsumo;
        insumoToCreate.tipoUnidad = tipoUnidad;
        return typeorm_1.getRepository(insumo_entity_1.InsumoEntity).save(insumoToCreate);
    }
    async getById(id) {
        const insumo = typeorm_1.getRepository(insumo_entity_1.InsumoEntity)
            .createQueryBuilder('insumo')
            .leftJoinAndSelect('insumo.tipoInsumo', 'tipoInsumo')
            .leftJoinAndSelect('insumo.tipoUnidad', 'tipoUnidad')
            .where('insumo.id = :insumoId', { insumoId: id })
            .getOne();
        if (!insumo) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        return insumo;
    }
    async update(id, insumo) {
        const theInsumo = await this.getById(id);
        if (!theInsumo) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        return await typeorm_1.getRepository(insumo_entity_1.InsumoEntity)
            .createQueryBuilder()
            .update()
            .set({
            nombre: insumo.nombre,
            descripcion: insumo.descripcion,
            descuentaEn: insumo.descuentaEn,
            clave: insumo.clave,
            tipoInsumoId: insumo.tipoInsumoId,
            tipoUnidadId: insumo.tipoUnidadId,
        })
            .where('id=:id', { id })
            .execute();
    }
    async updateStatus(id, active) {
        const theInsumo = await this.getById(id);
        if (!theInsumo) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        return await typeorm_1.getRepository(insumo_entity_1.InsumoEntity)
            .createQueryBuilder('insumo')
            .update()
            .set({ active })
            .where({ id: theInsumo.id })
            .execute();
    }
    async delete(id) {
        return typeorm_1.getRepository(insumo_entity_1.InsumoEntity).delete({ id });
    }
    async paginate(options) {
        const dataQuery = typeorm_1.getRepository(insumo_entity_1.InsumoEntity)
            .createQueryBuilder('insumo')
            .leftJoin('insumo.tipoInsumo', 'tipoInsumo')
            .leftJoin('insumo.tipoUnidad', 'tipoUnidad')
            .select([
            'insumo',
            'tipoInsumo.id',
            'tipoInsumo.nombre',
            'tipoUnidad.id',
            'tipoUnidad.nombre',
        ]);
        lodash_1.forIn(options.filters, (value, key) => {
            if (key === 'nombre') {
                dataQuery.andWhere('( insumo.nombre LIKE :term )', {
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
InsumosService = __decorate([
    common_1.Injectable()
], InsumosService);
exports.InsumosService = InsumosService;
//# sourceMappingURL=insumos.service.js.map