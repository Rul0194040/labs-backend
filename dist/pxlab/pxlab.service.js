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
var PxlabService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PxlabService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const event_emitter_1 = require("@nestjs/event-emitter");
const configkeys_enum_1 = require("../common/enum/configkeys.enum");
const logger_1 = require("../logger");
const api_keys_entity_1 = require("../sucursales/api-keys.entity");
const informe_folio_dto_1 = require("../ventas/DTOs/informe-folio.dto");
const moment = require("moment");
const typeorm_1 = require("typeorm");
const tareas_entity_1 = require("./tareas.entity");
let PxlabService = PxlabService_1 = class PxlabService {
    constructor(configService, eventEmitter) {
        this.configService = configService;
        this.eventEmitter = eventEmitter;
        this.logger = new logger_1.MyLogger(PxlabService_1.name);
        this.pxLabServiceURL = this.configService.get(configkeys_enum_1.ConfigKeys.PX_LAB_SERVER);
    }
    async enviarVenta(venta, tipo = 'N') {
        const clienteId = venta.venta.cliente && venta.venta.cliente.cuentaPxLab
            ? venta.venta.cliente.cuentaPxLab
            : 1;
        let stringServicio = `${venta.venta.id}|0|${tipo}|${clienteId}|${venta.venta.paciente.nombre}|${venta.venta.paciente.apellidoPaterno}|${venta.venta.paciente.apellidoMaterno}|${venta.venta.paciente.sexo[0]}|${moment(venta.venta.paciente.fechaNac).format('DD/MM/YYYY')}|${venta.venta.paciente.email}|${venta.venta.medico.nombre}|0|${venta.venta.fechaUltimaRegla
            ? moment(venta.venta.fechaUltimaRegla).format('DD/MM/YYYY')
            : ''}|${venta.venta.diagnostico || ''}|${venta.venta.observaciones || ''}|`;
        for (let i = 0; i < venta.detalle.length; i++) {
            const d = venta.detalle[i];
            stringServicio += `${d.servicio.clave}|`;
        }
        this.logger.verbose(`Nueva tarea (venta ${venta.venta.sucursal.nombre}): ${stringServicio}`);
        const apikeys = await typeorm_1.getRepository(api_keys_entity_1.ApiKeyEntity).find({
            where: { sucursal: venta.venta.sucursal.id, active: true },
            relations: ['sucursal'],
        });
        this.logger.verbose('Encontrados ' + apikeys.length + ' destinos para tarea.');
        const tareas = [];
        for (let index = 0; index < apikeys.length; index++) {
            const apikey = apikeys[index];
            if (apikey) {
                const tareaNueva = await typeorm_1.getRepository(tareas_entity_1.TareasEntity).save({
                    event: 'nuevaVenta',
                    data: stringServicio,
                    channel: apikey.key,
                    sucursal: apikey.sucursal,
                });
                this.eventEmitter.emit('gateway.send', {
                    event: tareaNueva.event,
                    channel: tareaNueva.channel,
                    data: tareaNueva,
                });
                tareas.push(tareaNueva);
            }
        }
        this.logger.verbose('Generadas ' + tareas.length + ' tareas.');
        return tareas;
    }
    async enviarCliente(cuentaPxLab, nombre, email, esNuevo = true) {
        const ClienteString = `${cuentaPxLab}|${esNuevo ? 'N' : 'M'}|${nombre}|${email}`;
        this.logger.verbose(`Nueva tarea (cliente): ${ClienteString}`);
        const apikeys = await typeorm_1.getRepository(api_keys_entity_1.ApiKeyEntity)
            .createQueryBuilder('a')
            .leftJoin('a.sucursal', 's')
            .select(['a', 's'])
            .where('a.active = :activos AND s.active = :activos', { activos: true })
            .getMany();
        this.logger.verbose('Encontrados ' + apikeys.length + ' destinos para tarea.');
        const tareas = [];
        for (let index = 0; index < apikeys.length; index++) {
            const apikey = apikeys[index];
            if (apikey) {
                const tareaNueva = await typeorm_1.getRepository(tareas_entity_1.TareasEntity).save({
                    event: 'nuevoCliente',
                    data: ClienteString,
                    channel: apikey.key,
                    sucursal: apikey.sucursal,
                });
                this.eventEmitter.emit('gateway.send', {
                    event: tareaNueva.event,
                    channel: tareaNueva.channel,
                    data: tareaNueva,
                });
                tareas.push(tareaNueva);
            }
        }
        this.logger.verbose('Generadas ' + tareas.length + ' tareas.');
        return tareas;
    }
    async enviarEstudio(clave, nombre, esNuevo = true) {
        const EstudioString = `${clave}|${esNuevo ? 'N' : 'M'}|${nombre}|`;
        this.logger.verbose('enviando estudio' + EstudioString);
        this.logger.verbose(`Nueva tarea (estudio): ${EstudioString}`);
        const apikeys = await typeorm_1.getRepository(api_keys_entity_1.ApiKeyEntity)
            .createQueryBuilder('a')
            .leftJoin('a.sucursal', 's')
            .select(['a', 's'])
            .where('a.active = :activos AND s.active = :activos AND s.esMatriz = :activos', { activos: true })
            .getMany();
        this.logger.verbose('Encontrados ' + apikeys.length + ' destinos para tarea.');
        const tareas = [];
        for (let index = 0; index < apikeys.length; index++) {
            const apikey = apikeys[index];
            if (apikey) {
                const tareaNueva = await typeorm_1.getRepository(tareas_entity_1.TareasEntity).save({
                    event: 'nuevoEstudio',
                    data: EstudioString,
                    channel: apikey.key,
                    sucursal: apikey.sucursal,
                });
                this.eventEmitter.emit('gateway.send', {
                    event: tareaNueva.event,
                    channel: tareaNueva.channel,
                    data: tareaNueva,
                });
                tareas.push(tareaNueva);
            }
        }
        this.logger.verbose('Generadas ' + tareas.length + ' tareas.');
        return tareas;
    }
};
PxlabService = PxlabService_1 = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        event_emitter_1.EventEmitter2])
], PxlabService);
exports.PxlabService = PxlabService;
//# sourceMappingURL=pxlab.service.js.map