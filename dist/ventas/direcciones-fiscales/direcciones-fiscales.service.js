"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DireccionesFiscalesService = void 0;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const typeorm_1 = require("typeorm");
const direccionesFiscales_entity_1 = require("./direccionesFiscales.entity");
const pacientes_entity_1 = require("../../pacientes/pacientes.entity");
const clientes_entity_1 = require("../../clientes/clientes.entity");
let DireccionesFiscalesService = class DireccionesFiscalesService {
    constructor() {
        this.notFoundMessage = 'direccion no encontrada';
    }
    async create(direccion) {
        if (direccion.pacienteId) {
            const paciente = await typeorm_1.getRepository(pacientes_entity_1.PacienteEntity).findOne({
                id: direccion.pacienteId,
            });
            if (!paciente)
                throw new common_1.HttpException('El paciente no existe', common_1.HttpStatus.NOT_FOUND);
        }
        if (direccion.clienteId) {
            const cliente = await typeorm_1.getRepository(clientes_entity_1.ClienteEntity).findOne({
                id: direccion.clienteId,
            });
            if (!cliente)
                throw new common_1.HttpException('El cliente no existe', common_1.HttpStatus.NOT_FOUND);
        }
        const direccionToCreate = class_transformer_1.plainToClass(direccionesFiscales_entity_1.DireccionFiscalEntity, direccion);
        return typeorm_1.getRepository(direccionesFiscales_entity_1.DireccionFiscalEntity).save(direccionToCreate);
    }
    async getById(id) {
        const direccion = typeorm_1.getRepository(direccionesFiscales_entity_1.DireccionFiscalEntity)
            .createQueryBuilder('direccion')
            .where('direccion.id = :direccionId', { direccionId: id })
            .getOne();
        if (!direccion) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        return direccion;
    }
    async getDirecciones(esCliente, id) {
        const direcciones = typeorm_1.getRepository(direccionesFiscales_entity_1.DireccionFiscalEntity).createQueryBuilder();
        if (esCliente) {
            direcciones.where('clienteId = :id', { id });
        }
        else {
            direcciones.where('pacienteId = :id', { id });
        }
        return await direcciones.getMany();
    }
    async update(id, direccion) {
        const theDireccion = await this.getById(id);
        if (!theDireccion) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        if (direccion.pacienteId) {
            const paciente = await typeorm_1.getRepository(pacientes_entity_1.PacienteEntity).findOne({
                id: direccion.pacienteId,
            });
            if (!paciente)
                throw new common_1.HttpException('El paciente no existe', common_1.HttpStatus.NOT_FOUND);
        }
        if (direccion.clienteId) {
            const cliente = await typeorm_1.getRepository(clientes_entity_1.ClienteEntity).findOne({
                id: direccion.clienteId,
            });
            if (!cliente)
                throw new common_1.HttpException('El cliente no existe', common_1.HttpStatus.NOT_FOUND);
        }
        return await typeorm_1.getRepository(direccionesFiscales_entity_1.DireccionFiscalEntity).update({ id }, direccion);
    }
    async delete(id) {
        return typeorm_1.getRepository(direccionesFiscales_entity_1.DireccionFiscalEntity).delete({ id });
    }
};
DireccionesFiscalesService = __decorate([
    common_1.Injectable()
], DireccionesFiscalesService);
exports.DireccionesFiscalesService = DireccionesFiscalesService;
//# sourceMappingURL=direcciones-fiscales.service.js.map