"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ClientesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientesService = void 0;
const common_1 = require("@nestjs/common");
const pagination_prime_Ng_result_dto_1 = require("../common/DTO/pagination-prime-Ng-result.dto");
const paginationPrimeNg_dto_1 = require("../common/DTO/paginationPrimeNg.dto");
const class_transformer_1 = require("class-transformer");
const lodash_1 = require("lodash");
const typeorm_1 = require("typeorm");
const clientes_entity_1 = require("./clientes.entity");
const pxlab_service_1 = require("../pxlab/pxlab.service");
const readXlsxFile = require("read-excel-file/node");
const tipos_convenios_enum_1 = require("../common/enum/tipos-convenios.enum");
const logger_1 = require("../logger");
let ClientesService = ClientesService_1 = class ClientesService {
    constructor(pxService) {
        this.pxService = pxService;
        this.logger = new logger_1.MyLogger(ClientesService_1.name);
    }
    async create(cliente, user) {
        const clienteToCreate = class_transformer_1.plainToClass(clientes_entity_1.ClienteEntity, cliente);
        clienteToCreate.usuario = user;
        const nuevoCliente = await typeorm_1.getRepository(clientes_entity_1.ClienteEntity).save(clienteToCreate);
        const cuentaPxLab = '9' + nuevoCliente.id.toString().padStart(6, '0');
        await typeorm_1.getRepository(clientes_entity_1.ClienteEntity).update(nuevoCliente.id, { cuentaPxLab });
        nuevoCliente.cuentaPxLab = cuentaPxLab;
        this.pxService.enviarCliente(nuevoCliente.cuentaPxLab, nuevoCliente.nombre, nuevoCliente.email, true);
        return nuevoCliente;
    }
    async getById(id) {
        const cliente = typeorm_1.getRepository(clientes_entity_1.ClienteEntity)
            .createQueryBuilder('cliente')
            .leftJoin('cliente.usuario', 'usuario')
            .select([
            'cliente',
            'usuario.id',
            'usuario.email',
            'usuario.firstName',
            'usuario.lastName',
            'usuario.profile',
        ])
            .where('cliente.id = :insumoId', { insumoId: id })
            .getOne();
        if (!cliente) {
            throw new common_1.HttpException('cliente no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        return cliente;
    }
    async update(id, cliente) {
        const Record = await this.getById(id);
        if (!Record) {
            throw new common_1.HttpException('cliente no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        const clienteActualizado = await typeorm_1.getRepository(clientes_entity_1.ClienteEntity).update({ id }, cliente);
        this.pxService.enviarCliente(Record.cuentaPxLab, cliente.nombre, cliente.email, false);
        return clienteActualizado;
    }
    async updateStatus(id, active) {
        const Record = await this.getById(id);
        if (!Record) {
            throw new common_1.HttpException('cliente no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        return await typeorm_1.getRepository(clientes_entity_1.ClienteEntity)
            .createQueryBuilder('cliente')
            .update()
            .set({ active })
            .where({ id: Record.id })
            .execute();
    }
    async delete(id) {
        return typeorm_1.getRepository(clientes_entity_1.ClienteEntity).delete({ id });
    }
    async paginate(options) {
        const dataQuery = typeorm_1.getRepository(clientes_entity_1.ClienteEntity)
            .createQueryBuilder('cliente')
            .leftJoin('cliente.usuario', 'usuario')
            .select([
            'cliente',
            'usuario.id',
            'usuario.email',
            'usuario.firstName',
            'usuario.lastName',
            'usuario.profile',
        ]);
        lodash_1.forIn(options.filters, (value, key) => {
            if (key === 'nombre') {
                dataQuery.andWhere('( cliente.nombre LIKE :term )', {
                    term: `%${value.split(' ').join('%')}%`,
                });
                dataQuery.orWhere('( cliente.codigo LIKE :term )', {
                    term: `%${value.split(' ').join('%')}%`,
                });
                dataQuery.orWhere('( cliente.email LIKE :term )', {
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
    updateStripeId(clienteId, stripeId) {
        return typeorm_1.getRepository(clientes_entity_1.ClienteEntity).update(clienteId, { stripeId });
    }
    async importarClientesXLS(xlsFile) {
        this.logger.verbose('Abriendo archivo ' + xlsFile);
        const rows = await readXlsxFile(xlsFile, { dateFormat: 'MM/DD/YY' });
        this.logger.verbose('Encontrados ' + rows.length + ' clientes');
        const clienteRepo = typeorm_1.getRepository(clientes_entity_1.ClienteEntity);
        const tipoPersona = 'MORAL';
        const telefono = '';
        const tipoConvenio = tipos_convenios_enum_1.TiposConvenios.EMPLEADO;
        for (let r = 1; r <= rows.length - 1; r++) {
            const row = rows[r];
            const cuentaPxLab = row[0] ? row[0].toString().trim() : null;
            const nombre = row[1] ? row[1].trim() : null;
            const descuento = row[2]
                ? Number((parseFloat(row[2]) * 100).toFixed(2))
                : 0;
            const diasCredito = row[3] ? parseInt(row[3]) : 0;
            if (cuentaPxLab && nombre) {
                const cliente = await clienteRepo.findOne({
                    where: { cuentaPxLab },
                });
                if (!cliente) {
                    const clienteCreado = await clienteRepo.save({
                        cuentaPxLab,
                        nombre,
                        descuento,
                        diasCredito,
                        tipoPersona,
                        telefono,
                        tipoConvenio,
                    });
                    this.logger.verbose('+++Creado: ' + clienteCreado.nombre);
                }
                else {
                    await clienteRepo.update({ cuentaPxLab }, {
                        nombre,
                        descuento,
                        diasCredito,
                    });
                }
            }
        }
        return rows;
    }
};
ClientesService = ClientesService_1 = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [pxlab_service_1.PxlabService])
], ClientesService);
exports.ClientesService = ClientesService;
//# sourceMappingURL=clientes.service.js.map