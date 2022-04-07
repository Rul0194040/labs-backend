"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PuestosDepartamentosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const departamento_entity_1 = require("./entity/departamento.entity");
const puesto_entity_1 = require("./entity/puesto.entity");
const pagination_prime_Ng_result_dto_1 = require("../../common/DTO/pagination-prime-Ng-result.dto");
const paginationPrimeNg_dto_1 = require("../../common/DTO/paginationPrimeNg.dto");
const lodash_1 = require("lodash");
let PuestosDepartamentosService = class PuestosDepartamentosService {
    async crearDepartamento(departamento) {
        let parent = null;
        if (departamento.parentId) {
            parent = await typeorm_1.getRepository(departamento_entity_1.DepartamentoEntity).findOne(departamento.parentId);
        }
        return await typeorm_1.getRepository(departamento_entity_1.DepartamentoEntity).save({
            nombre: departamento.nombre,
            parent,
        });
    }
    async actualizarDepartamento(departamentoId, departamento) {
        const dep = await this.getDepartamentoById(departamentoId);
        return await typeorm_1.getRepository(departamento_entity_1.DepartamentoEntity).update(dep.id, departamento);
    }
    async departamentosPaginate(options) {
        const dataQuery = typeorm_1.getRepository(departamento_entity_1.DepartamentoEntity)
            .createQueryBuilder('depto')
            .leftJoin('depto.parent', 'parent')
            .select(['depto', 'parent.id', 'parent.nombre']);
        lodash_1.forIn(options.filters, (value, key) => {
            if (key === 'nombre') {
                dataQuery.andWhere('( depto.nombre LIKE :term )', {
                    term: `%${value.split(' ').join('%')}%`,
                });
            }
        });
        if (options.sort === undefined || !Object.keys(options.sort).length) {
            options.sort = 'depto.createdAt';
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
    async getDepartamentoById(id) {
        const departamento = await typeorm_1.getRepository(departamento_entity_1.DepartamentoEntity)
            .createQueryBuilder('depto')
            .leftJoin('depto.parent', 'parent')
            .select(['depto', 'parent.id', 'parent.nombre'])
            .where('depto.id=:id', { id })
            .getOne();
        if (!departamento) {
            throw new common_1.HttpException('Departamento no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        return departamento;
    }
    async deleteDepartamento(departamentoId) {
        const dep = await this.getDepartamentoById(departamentoId);
        return await typeorm_1.getRepository(departamento_entity_1.DepartamentoEntity).delete(dep.id);
    }
    async crearPuesto(puesto) {
        let puestoJefe = null;
        if (puesto.puestoJefeId) {
            puestoJefe = await typeorm_1.getRepository(puesto_entity_1.PuestoEntity).findOne(puesto.puestoJefeId);
        }
        let departamento = null;
        if (puesto.departamentoId) {
            departamento = await typeorm_1.getRepository(departamento_entity_1.DepartamentoEntity).findOne(puesto.departamentoId);
        }
        return await typeorm_1.getRepository(puesto_entity_1.PuestoEntity).save({
            nombre: puesto.nombre,
            puestoJefe,
            sueldoMensual: puesto.sueldoMensual,
            plazasDisponibles: puesto.plazasDisponibles,
            departamento,
        });
    }
    async actualizarPuesto(puestoId, puesto) {
        const puestoE = await this.getPuestoById(puestoId);
        return await typeorm_1.getRepository(puesto_entity_1.PuestoEntity).update(puestoE.id, puesto);
    }
    async puestosPaginate(options) {
        const dataQuery = typeorm_1.getRepository(puesto_entity_1.PuestoEntity)
            .createQueryBuilder('puesto')
            .leftJoin('puesto.puestoJefe', 'puestoJefe')
            .leftJoin('puesto.departamento', 'departamento')
            .select([
            'puesto.id',
            'puesto.createdAt',
            'puestoJefe.id',
            'puestoJefe.nombre',
            'departamento.id',
            'departamento.nombre',
        ]);
        lodash_1.forIn(options.filters, (value, key) => {
            if (key === 'nombre') {
                dataQuery.andWhere('( puesto.nombre LIKE :term )', {
                    term: `%${value.split(' ').join('%')}%`,
                });
            }
        });
        if (options.sort === undefined || !Object.keys(options.sort).length) {
            options.sort = 'puesto.createdAt';
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
    async getPuestoById(id) {
        const puesto = await typeorm_1.getRepository(puesto_entity_1.PuestoEntity)
            .createQueryBuilder('puesto')
            .leftJoin('puesto.departamento', 'departamento')
            .leftJoin('puesto.puestoJefe', 'jefe')
            .select(['puesto', 'departamento', 'jefe'])
            .where('puesto.id =:id', { id })
            .getOne();
        if (!puesto) {
            throw new common_1.HttpException('Puesto no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        return puesto;
    }
    async puestosDelete(id) {
        return await typeorm_1.getRepository(puesto_entity_1.PuestoEntity).delete(id);
    }
};
PuestosDepartamentosService = __decorate([
    common_1.Injectable()
], PuestosDepartamentosService);
exports.PuestosDepartamentosService = PuestosDepartamentosService;
//# sourceMappingURL=puestos-departamentos.service.js.map