"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacientesService = void 0;
const common_1 = require("@nestjs/common");
const pagination_prime_Ng_result_dto_1 = require("../common/DTO/pagination-prime-Ng-result.dto");
const paginationPrimeNg_dto_1 = require("../common/DTO/paginationPrimeNg.dto");
const class_transformer_1 = require("class-transformer");
const lodash_1 = require("lodash");
const typeorm_1 = require("typeorm");
const pacientes_entity_1 = require("./pacientes.entity");
const clientes_entity_1 = require("../clientes/clientes.entity");
let PacientesService = class PacientesService {
    constructor() {
        this.notFoundMessage = 'paciente no encontrada';
    }
    async create(paciente, user) {
        if (paciente.email) {
            const pacienteEmail = await typeorm_1.getRepository(pacientes_entity_1.PacienteEntity).findOne({
                email: paciente.email,
            });
            if (pacienteEmail)
                throw new common_1.HttpException('El correo ya ha sido registrado en un paciente', common_1.HttpStatus.BAD_REQUEST);
        }
        const pacienteToCreate = class_transformer_1.plainToClass(pacientes_entity_1.PacienteEntity, paciente);
        pacienteToCreate.usuario = user;
        if (paciente.cliente) {
            const cliente = await typeorm_1.getRepository(clientes_entity_1.ClienteEntity).findOne(paciente.cliente);
            if (!cliente) {
                throw new common_1.HttpException('El cliente no existe', common_1.HttpStatus.NOT_FOUND);
            }
            pacienteToCreate.cliente = cliente;
        }
        return await typeorm_1.getRepository(pacientes_entity_1.PacienteEntity).save(pacienteToCreate);
    }
    async getById(id) {
        const paciente = typeorm_1.getRepository(pacientes_entity_1.PacienteEntity)
            .createQueryBuilder('paciente')
            .leftJoinAndSelect('paciente.cliente', 'cliente')
            .leftJoinAndSelect('paciente.usuario', 'usuario')
            .select([
            'paciente',
            'cliente.id',
            'cliente.nombre',
            'cliente.tipoConvenio',
            'usuario.id',
            'usuario.email',
            'usuario.firstName',
            'usuario.lastName',
            'usuario.profile',
        ])
            .where('paciente.id = :pacienteId', { pacienteId: id })
            .getOne();
        if (!paciente) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        return paciente;
    }
    async update(id, paciente) {
        if (paciente.email) {
            const pacienteEmail = await typeorm_1.getRepository(pacientes_entity_1.PacienteEntity).findOne({
                email: paciente.email,
            });
            if (pacienteEmail && (pacienteEmail === null || pacienteEmail === void 0 ? void 0 : pacienteEmail.id) !== id)
                throw new common_1.HttpException('El correo ya ha sido registrado en un paciente', common_1.HttpStatus.BAD_REQUEST);
        }
        const record = await this.getById(id);
        if (!record) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        if (paciente.cliente) {
            const cliente = await typeorm_1.getRepository(clientes_entity_1.ClienteEntity).findOne(paciente.cliente);
            if (!cliente) {
                throw new common_1.HttpException('El cliente no existe', common_1.HttpStatus.NOT_FOUND);
            }
            record.cliente = cliente;
        }
        const updatePaciente = {
            cliente: record.cliente,
            nombre: paciente.nombre,
            apellidoPaterno: paciente.apellidoPaterno,
            apellidoMaterno: paciente.apellidoMaterno,
            email: paciente.email,
            telefono: paciente.telefono,
            fechaNac: paciente.fechaNac,
            descripcion: paciente.descripcion,
            sexo: paciente.sexo,
        };
        await typeorm_1.getRepository(pacientes_entity_1.PacienteEntity).update({ id }, updatePaciente);
        return await this.getById(id);
    }
    async updateStatus(id, active) {
        const record = await this.getById(id);
        if (!record) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        return await typeorm_1.getRepository(pacientes_entity_1.PacienteEntity)
            .createQueryBuilder('paciente')
            .update()
            .set({ active })
            .where({ id: record.id })
            .execute();
    }
    async delete(id) {
        return typeorm_1.getRepository(pacientes_entity_1.PacienteEntity).delete({ id });
    }
    async paginate(options) {
        const dataQuery = typeorm_1.getRepository(pacientes_entity_1.PacienteEntity)
            .createQueryBuilder('paciente')
            .leftJoinAndSelect('paciente.cliente', 'cliente')
            .leftJoinAndSelect('paciente.usuario', 'usuario')
            .select([
            'paciente',
            'cliente.id',
            'cliente.nombre',
            'cliente.descuento',
            'cliente.diasCredito',
            'cliente.tipoConvenio',
            'usuario.id',
            'usuario.email',
            'usuario.firstName',
            'usuario.lastName',
            'usuario.profile',
        ]);
        lodash_1.forIn(options.filters, (value, key) => {
            if (key === 'nombre') {
                dataQuery.andWhere('( paciente.nombre LIKE :term )', {
                    term: `%${value.split(' ').join('%')}%`,
                });
                dataQuery.orWhere('( paciente.apellidoPaterno LIKE :term )', {
                    term: `%${value.split(' ').join('%')}%`,
                });
                dataQuery.orWhere('( paciente.apellidoMaterno LIKE :term )', {
                    term: `%${value.split(' ').join('%')}%`,
                });
                dataQuery.orWhere('( paciente.email LIKE :term )', {
                    term: `%${value.split(' ').join('%')}%`,
                });
            }
            if (key === 'cliente') {
                dataQuery.andWhere('( cliente.id = :clienteId )', {
                    clienteId: value,
                });
            }
        });
        const count = await dataQuery.getCount();
        if (options.sort === undefined) {
            options.sort = 'paciente.createdAt';
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
PacientesService = __decorate([
    common_1.Injectable()
], PacientesService);
exports.PacientesService = PacientesService;
//# sourceMappingURL=pacientes.service.js.map