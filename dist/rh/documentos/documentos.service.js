"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentosService = void 0;
const documento_entity_1 = require("./entity/documento.entity");
const common_1 = require("@nestjs/common");
const pagination_prime_Ng_result_dto_1 = require("../../common/DTO/pagination-prime-Ng-result.dto");
const paginationPrimeNg_dto_1 = require("../../common/DTO/paginationPrimeNg.dto");
const class_transformer_1 = require("class-transformer");
const lodash_1 = require("lodash");
const typeorm_1 = require("typeorm");
let DocumentosService = class DocumentosService {
    async create(documento) {
        const documentoToCreate = class_transformer_1.plainToClass(documento_entity_1.DocumentoEntity, documento);
        const nuevoDocumento = await typeorm_1.getRepository(documento_entity_1.DocumentoEntity).save(documentoToCreate);
        return nuevoDocumento;
    }
    async getById(id) {
        const documento = typeorm_1.getRepository(documento_entity_1.DocumentoEntity).findOne(id);
        if (!documento) {
            throw new common_1.HttpException('documento no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        return documento;
    }
    async update(id, documento) {
        const Record = await this.getById(id);
        if (!Record) {
            throw new common_1.HttpException('documento no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        const documentoActualizado = await typeorm_1.getRepository(documento_entity_1.DocumentoEntity).update({ id }, documento);
        return documentoActualizado;
    }
    async delete(id) {
        return typeorm_1.getRepository(documento_entity_1.DocumentoEntity).delete({ id });
    }
    async paginate(options) {
        const dataQuery = typeorm_1.getRepository(documento_entity_1.DocumentoEntity)
            .createQueryBuilder('documento')
            .select(['documento.nombre', 'documento.fileName']);
        lodash_1.forIn(options.filters, (value, key) => {
            if (key === 'nombre') {
                dataQuery.andWhere('( documento.nombre LIKE :term )', {
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
DocumentosService = __decorate([
    common_1.Injectable()
], DocumentosService);
exports.DocumentosService = DocumentosService;
//# sourceMappingURL=documentos.service.js.map