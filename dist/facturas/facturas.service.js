"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacturasService = void 0;
const common_1 = require("@nestjs/common");
const pagination_prime_Ng_result_dto_1 = require("../common/DTO/pagination-prime-Ng-result.dto");
const paginationPrimeNg_dto_1 = require("../common/DTO/paginationPrimeNg.dto");
const class_transformer_1 = require("class-transformer");
const lodash_1 = require("lodash");
const typeorm_1 = require("typeorm");
const facturas_entity_1 = require("./facturas.entity");
let FacturasService = class FacturasService {
    constructor() {
        this.notFoundMessage = 'factura no encontrada';
    }
    async create(factura) {
        const facturaToCreate = class_transformer_1.plainToClass(facturas_entity_1.FacturaEntity, factura);
        return typeorm_1.getRepository(facturas_entity_1.FacturaEntity).save(facturaToCreate);
    }
    async getById(id) {
        const factura = typeorm_1.getRepository(facturas_entity_1.FacturaEntity)
            .createQueryBuilder('factura')
            .where('factura.id = :id', { id: id })
            .getOne();
        if (!factura) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        return factura;
    }
    async update(id, factura) {
        const thefactura = await this.getById(id);
        if (!thefactura) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        return await typeorm_1.getRepository(facturas_entity_1.FacturaEntity).update({ id }, factura);
    }
    async delete(id) {
        return typeorm_1.getRepository(facturas_entity_1.FacturaEntity).delete({ id });
    }
    async paginate(options) {
        const dataQuery = typeorm_1.getRepository(facturas_entity_1.FacturaEntity).createQueryBuilder('factura');
        lodash_1.forIn(options.filters, (value, key) => {
            if (key === 'nombre') {
                dataQuery.andWhere('( factura.constribuyente LIKE :term )', {
                    term: `%${value.split(' ').join('%')}%`,
                });
            }
        });
        const count = await dataQuery.getCount();
        const data = await dataQuery
            .skip(options.skip)
            .take(options.take)
            .getMany();
        return {
            data: data,
            skip: options.skip,
            totalItems: count,
        };
    }
};
FacturasService = __decorate([
    common_1.Injectable()
], FacturasService);
exports.FacturasService = FacturasService;
//# sourceMappingURL=facturas.service.js.map