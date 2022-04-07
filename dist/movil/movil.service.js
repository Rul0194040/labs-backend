"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovilService = void 0;
const common_1 = require("@nestjs/common");
const cajas_entity_1 = require("../cajas/cajas.entity");
const estatusCaja_enum_1 = require("../cajas/estatusCaja.enum");
const typeorm_1 = require("typeorm");
let MovilService = class MovilService {
    async obtenerCajasAbiertas() {
        return await typeorm_1.getRepository(cajas_entity_1.CajaEntity)
            .createQueryBuilder('caja')
            .leftJoinAndSelect('caja.sucursal', 'sucursal')
            .leftJoinAndSelect('caja.usuario', 'usuario')
            .select([
            'caja.id',
            'caja.active',
            'caja.sucursalId',
            'caja.usuarioId',
            'caja.fechaApertura',
            'caja.notas',
            'caja.estatus',
            'caja.total',
            'caja.montoApertura',
            'sucursal.id',
            'sucursal.nombre',
            'sucursal.esMatriz',
            'sucursal.esLaboratorio',
            'sucursal.esForanea',
            'usuario.id',
            'usuario.email',
            'usuario.firstName',
            'usuario.lastName',
            'usuario.profile',
        ])
            .where('caja.estatus = :estatus', { estatus: estatusCaja_enum_1.EstatusCaja.ABIERTA })
            .getMany();
    }
};
MovilService = __decorate([
    common_1.Injectable()
], MovilService);
exports.MovilService = MovilService;
//# sourceMappingURL=movil.service.js.map