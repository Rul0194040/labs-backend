"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpleadosService = void 0;
const users_entity_1 = require("../users/users.entity");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const qrs_entity_1 = require("./qrs/qrs.entity");
const pagination_prime_Ng_result_dto_1 = require("../common/DTO/pagination-prime-Ng-result.dto");
const paginationPrimeNg_dto_1 = require("../common/DTO/paginationPrimeNg.dto");
const lodash_1 = require("lodash");
let EmpleadosService = class EmpleadosService {
    async getEntradasSalidas(empleadoId) {
        const result = await typeorm_1.getRepository(qrs_entity_1.QrsEntity).find({
            where: { empleadoId: empleadoId },
            relations: ['entrada', 'sucursal'],
            order: { fechaHora: 'ASC' },
        });
        return result;
    }
    async createEmpleado(empleado) {
        if (empleado.email) {
            const emailMedico = await typeorm_1.getRepository(users_entity_1.UsersEntity).findOne({
                email: empleado.email,
            });
            if (emailMedico) {
                throw new common_1.HttpException('El correo ya ha sido registrado en un médico', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        return await typeorm_1.getRepository(users_entity_1.UsersEntity).save(empleado);
    }
    async getEmpleadoById(id) {
        return await typeorm_1.getRepository(users_entity_1.UsersEntity).findOne(id);
    }
    async updateEmpleado(id, empleado) {
        await typeorm_1.getRepository(users_entity_1.UsersEntity).update(id, empleado);
        return await this.getEmpleadoById(id);
    }
    async delete(id) {
        return await typeorm_1.getRepository(users_entity_1.UsersEntity).delete(id);
    }
    async empleadosPaginate(options) {
        const dataQuery = typeorm_1.getRepository(users_entity_1.UsersEntity).createQueryBuilder('empleado');
        lodash_1.forIn(options.filters, (value, key) => {
            if (key === 'nombre') {
                dataQuery.orWhere('( empleado.nombre LIKE :term )', {
                    term: `%${value.split(' ').join('%')}%`,
                });
            }
            if (key === 'email') {
                dataQuery.orWhere('( empleado.email LIKE :term )', {
                    term: `%${value.split(' ').join('%')}%`,
                });
            }
            if (key === 'telefono') {
                dataQuery.orWhere('( empleado.telefono LIKE :term )', {
                    term: `%${value.split(' ').join('%')}%`,
                });
            }
            if (key === 'curp') {
                dataQuery.orWhere('( empleado.curp LIKE :term )', {
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
EmpleadosService = __decorate([
    common_1.Injectable()
], EmpleadosService);
exports.EmpleadosService = EmpleadosService;
//# sourceMappingURL=empleados.service.js.map