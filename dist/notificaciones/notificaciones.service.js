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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificacionesService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const users_entity_1 = require("../users/users.entity");
const users_service_1 = require("../users/users.service");
const typeorm_1 = require("typeorm");
const notificaciones_entity_1 = require("./notificaciones.entity");
let NotificacionesService = class NotificacionesService {
    constructor(userService, eventEmitter) {
        this.userService = userService;
        this.eventEmitter = eventEmitter;
    }
    async misNotificaciones(user) {
        return await typeorm_1.getRepository(notificaciones_entity_1.NotificacionEntity)
            .createQueryBuilder('notif')
            .where('notif.paraId=:paraId', {
            paraId: user.id,
        })
            .getMany();
    }
    async emitMinimoAlcanzado(event) {
        console.log('minimo alcanzado', event);
        const adminsMatriz = await this.userService.getMatrizAdmins();
        console.log('adminsMatriz', adminsMatriz);
        const adminsSuc = await this.userService.getAdminsSuc(event.sucursal.id);
        console.log('adminsSuc', adminsSuc);
        let de;
        for (let index = 0; index < adminsMatriz.length; index++) {
            const adminMatriz = adminsMatriz[index];
            const notificacion = await this.crearNotificacion(de, adminMatriz, 'Alerta de mínimo', 'La sucursal ' +
                event.sucursal.nombre +
                ' reporta insumo ' +
                event.insumo.nombre +
                ' dentro de los mínimos.', '/#/stock');
            this.eventEmitter.emit('gateway.send', {
                channel: 'admin',
                event: 'notificacion',
                data: notificacion,
            });
        }
        for (let index = 0; index < adminsSuc.length; index++) {
            const adminSuc = adminsSuc[index];
            const notificacion = await this.crearNotificacion(de, adminSuc, 'Alerta de mínimo', 'Tenemos el insumo ' + event.insumo.nombre + ' dentro de los mínimos.', '/#/stock');
            this.eventEmitter.emit('gateway.send', {
                channel: 'admin',
                event: 'notificacion',
                data: notificacion,
            });
        }
    }
    async crearNotificacion(de, para, titulo, descripcion, link) {
        const aCrear = new notificaciones_entity_1.NotificacionEntity();
        aCrear.de = de;
        aCrear.para = para;
        aCrear.titulo = titulo;
        aCrear.descripcion = descripcion;
        aCrear.link = link;
        return await typeorm_1.getRepository(notificaciones_entity_1.NotificacionEntity).save(aCrear);
    }
};
NotificacionesService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        event_emitter_1.EventEmitter2])
], NotificacionesService);
exports.NotificacionesService = NotificacionesService;
//# sourceMappingURL=notificaciones.service.js.map