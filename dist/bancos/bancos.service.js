"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BancosService = void 0;
const movimientos_bancos_entity_1 = require("./entities/movimientos-bancos.entity");
const common_1 = require("@nestjs/common");
const pagination_prime_Ng_result_dto_1 = require("../common/DTO/pagination-prime-Ng-result.dto");
const paginationPrimeNg_dto_1 = require("../common/DTO/paginationPrimeNg.dto");
const class_transformer_1 = require("class-transformer");
const lodash_1 = require("lodash");
const typeorm_1 = require("typeorm");
const banco_entity_1 = require("./entities/banco.entity");
const cuenta_bancaria_entity_1 = require("./entities/cuenta-bancaria.entity");
const tipos_cuenta_gasto_entity_1 = require("./entities/tipos-cuenta-gasto.entity");
let BancosService = class BancosService {
    async create(banco) {
        const bancoToCreate = class_transformer_1.plainToClass(banco_entity_1.BancoEntity, banco);
        const nuevoBanco = await typeorm_1.getRepository(banco_entity_1.BancoEntity).save(bancoToCreate);
        return nuevoBanco;
    }
    async getById(id) {
        const banco = typeorm_1.getRepository(banco_entity_1.BancoEntity).findOne(id);
        if (!banco) {
            throw new common_1.HttpException('banco no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        return banco;
    }
    async update(id, banco) {
        const Record = await this.getById(id);
        if (!Record) {
            throw new common_1.HttpException('banco no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        const bancoActualizado = await typeorm_1.getRepository(banco_entity_1.BancoEntity).update({ id }, banco);
        return bancoActualizado;
    }
    async delete(id) {
        return typeorm_1.getRepository(banco_entity_1.BancoEntity).delete({ id });
    }
    async paginate(options) {
        const dataQuery = typeorm_1.getRepository(banco_entity_1.BancoEntity)
            .createQueryBuilder('banco')
            .select(['banco.nombre', 'banco.telefono']);
        lodash_1.forIn(options.filters, (value, key) => {
            if (key === 'nombre') {
                dataQuery.andWhere('( banco.nombre LIKE :term )', {
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
    async createCuenta(cuenta) {
        let banco;
        const cuentaToCreate = class_transformer_1.plainToClass(cuenta_bancaria_entity_1.CuentaBancariaEntity, cuenta);
        if (cuenta.banco) {
            banco = await typeorm_1.getRepository(banco_entity_1.BancoEntity).findOne(cuenta.banco);
        }
        const nuevaCuenta = await typeorm_1.getRepository(cuenta_bancaria_entity_1.CuentaBancariaEntity).save(cuentaToCreate);
        nuevaCuenta.banco = banco;
        return nuevaCuenta;
    }
    async getCuentaById(id) {
        const cuenta = typeorm_1.getRepository(cuenta_bancaria_entity_1.CuentaBancariaEntity).findOne(id);
        if (!cuenta) {
            throw new common_1.HttpException('cuenta no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        return cuenta;
    }
    async updateCuenta(id, cuenta) {
        const Record = await this.getById(id);
        if (!Record) {
            throw new common_1.HttpException('cuenta no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        const cuentaActualizado = await typeorm_1.getRepository(cuenta_bancaria_entity_1.CuentaBancariaEntity).update(id, {
            nombre: cuenta.nombre,
            saldo: cuenta.saldo,
        });
        return cuentaActualizado;
    }
    async deleteCuenta(id) {
        return typeorm_1.getRepository(cuenta_bancaria_entity_1.CuentaBancariaEntity).delete({ id });
    }
    async paginateCuenta(options) {
        const dataQuery = typeorm_1.getRepository(cuenta_bancaria_entity_1.CuentaBancariaEntity)
            .createQueryBuilder('cuenta')
            .select(['cuenta.nombre', 'cuenta.saldo']);
        lodash_1.forIn(options.filters, (value, key) => {
            if (key === 'nombre') {
                dataQuery.andWhere('( cuenta.nombre LIKE :term )', {
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
    async crearTipoCuentaGasto(tipoCuentaGasto) {
        let parent = null;
        if (tipoCuentaGasto.parentId) {
            parent = await typeorm_1.getRepository(tipos_cuenta_gasto_entity_1.TipoCuentaGastoEntity).findOne(tipoCuentaGasto.parentId);
        }
        return await typeorm_1.getRepository(tipos_cuenta_gasto_entity_1.TipoCuentaGastoEntity).save({
            nombre: tipoCuentaGasto.nombre,
            clave: tipoCuentaGasto.clave,
            parent,
        });
    }
    async actualizarTipoCuentaGasto(id, tipocuentaGasto) {
        return await typeorm_1.getRepository(tipos_cuenta_gasto_entity_1.TipoCuentaGastoEntity).update(id, tipocuentaGasto);
    }
    async cuentaGastoPaginate(options) {
        const dataQuery = typeorm_1.getRepository(tipos_cuenta_gasto_entity_1.TipoCuentaGastoEntity).createQueryBuilder('cuentaG');
        lodash_1.forIn(options.filters, (value, key) => {
            if (key === 'nombre') {
                dataQuery.orWhere('( cuentaG.nombre LIKE :term )', {
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
    async getCuentaGastoById(id) {
        return await typeorm_1.getRepository(tipos_cuenta_gasto_entity_1.TipoCuentaGastoEntity).findOne(id);
    }
    async createMov(movimiento) {
        const movToCreate = class_transformer_1.plainToClass(movimientos_bancos_entity_1.MovimientoCuentaBanco, movimiento);
        const nuevoMov = await typeorm_1.getRepository(movimientos_bancos_entity_1.MovimientoCuentaBanco).save(movToCreate);
        return nuevoMov;
    }
    async updateMov(id, mov) {
        return await typeorm_1.getRepository(movimientos_bancos_entity_1.MovimientoCuentaBanco).update(id, mov);
    }
    async paginateMov(options) {
        const dataQuery = typeorm_1.getRepository(movimientos_bancos_entity_1.MovimientoCuentaBanco).createQueryBuilder('movCuenta');
        lodash_1.forIn(options.filters, (value, key) => {
            if (key === 'nombre') {
                dataQuery.orWhere('( movCuenta.referencia LIKE :term )', {
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
    async getMovById(id) {
        return await typeorm_1.getRepository(movimientos_bancos_entity_1.MovimientoCuentaBanco).findOne(id);
    }
    async deleteMov(id) {
        return await typeorm_1.getRepository(movimientos_bancos_entity_1.MovimientoCuentaBanco).delete(id);
    }
};
BancosService = __decorate([
    common_1.Injectable()
], BancosService);
exports.BancosService = BancosService;
//# sourceMappingURL=bancos.service.js.map