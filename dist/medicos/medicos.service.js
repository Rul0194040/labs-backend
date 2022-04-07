"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const medico_entity_1 = require("./medico.entity");
const lodash_1 = require("lodash");
const paginationPrimeNg_dto_1 = require("../common/DTO/paginationPrimeNg.dto");
const pagination_prime_Ng_result_dto_1 = require("../common/DTO/pagination-prime-Ng-result.dto");
let MedicosService = class MedicosService {
    async create(createMedicoDto) {
        if (createMedicoDto.email) {
            const emailMedico = await typeorm_1.getRepository(medico_entity_1.MedicoEntity).findOne({
                email: createMedicoDto.email,
            });
            if (emailMedico) {
                throw new common_1.HttpException('El correo ya ha sido registrado en un médico', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        return await typeorm_1.getRepository(medico_entity_1.MedicoEntity).save(createMedicoDto);
    }
    async getById(id) {
        return await typeorm_1.getRepository(medico_entity_1.MedicoEntity).findOne(id);
    }
    async update(id, updateMedicoDto) {
        await typeorm_1.getRepository(medico_entity_1.MedicoEntity).update(id, updateMedicoDto);
        return await this.getById(id);
    }
    async delete(id) {
        return await typeorm_1.getRepository(medico_entity_1.MedicoEntity).delete(id);
    }
    async paginate(options) {
        const dataQuery = typeorm_1.getRepository(medico_entity_1.MedicoEntity).createQueryBuilder();
        lodash_1.forIn(options.filters, (value, key) => {
            if (key === 'nombre') {
                dataQuery.andWhere('( nombre LIKE :term )', {
                    term: `%${value.split(' ').join('%')}%`,
                });
                dataQuery.orWhere('( email LIKE :term )', {
                    term: `%${value.split(' ').join('%')}%`,
                });
            }
        });
        const count = await dataQuery.getCount();
        const data = await dataQuery
            .skip(options.skip)
            .take(options.take)
            .orderBy(options.sort)
            .getMany();
        return {
            data: data,
            skip: options.skip,
            totalItems: count,
        };
    }
};
MedicosService = __decorate([
    common_1.Injectable()
], MedicosService);
exports.MedicosService = MedicosService;
//# sourceMappingURL=medicos.service.js.map