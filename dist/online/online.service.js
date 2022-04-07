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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var OnlineService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnlineService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const schedule_1 = require("@nestjs/schedule");
const profiles_enum_1 = require("../users/profiles.enum");
const monitorEvents_enum_1 = require("../events/monitorEvents.enum");
const tareas_estatus_enum_1 = require("../pxlab/tareas-estatus.enum");
const tareas_entity_1 = require("../pxlab/tareas.entity");
const sucursal_entity_1 = require("../sucursales/sucursal.entity");
const lodash_1 = require("lodash");
const typeorm_1 = require("typeorm");
const logger_1 = require("../logger");
const users_entity_1 = require("../users/users.entity");
let OnlineService = OnlineService_1 = class OnlineService {
    constructor(eventEmitter, cacheManager) {
        this.eventEmitter = eventEmitter;
        this.cacheManager = cacheManager;
        this.logger = new logger_1.MyLogger(OnlineService_1.name);
        this.sockets = [];
        this.timeouts = [];
        this.timeoutThreshold = 8000;
        this.horasCache = 8;
        this.pendientes = [];
        this.monitores = [];
    }
    async handleSocketConnected(socket) {
        const socketsRaw = await this.cacheManager.get('sockets');
        if (socketsRaw) {
            this.sockets = JSON.parse(socketsRaw);
        }
        const monitoresRaw = await this.cacheManager.get('sockets');
        if (monitoresRaw) {
            this.monitores = JSON.parse(monitoresRaw);
        }
        const idxSocket = this.sockets.findIndex((s) => {
            return socket.user.id === s.user.id;
        });
        if (idxSocket === -1) {
            const pendientesRaw = await this.cacheManager.get('pendientes');
            if (pendientesRaw) {
                this.pendientes = JSON.parse(pendientesRaw);
            }
            const idxPendiente = this.pendientes.indexOf(socket.user.id);
            if (idxPendiente === -1) {
                this.logger.verbose(`User ${socket.user.id} (${socket.user.firstName} ${socket.user.lastName}) is online.`);
                this.eventEmitter.emit('gateway.send', {
                    channel: 'general',
                    event: 'userOnLine',
                    data: lodash_1.pick(socket.user, [
                        'id',
                        'uuid',
                        'firstName',
                        'lastName',
                        'email',
                        'telefono',
                        'profile',
                    ]),
                });
            }
        }
        else {
            this.logger.verbose(`User ${socket.user.id} (${socket.user.firstName} ${socket.user.lastName}) is already online.`);
        }
        this.sockets.push({ id: socket.id, user: socket.user });
        await this.cacheManager.set('sockets', JSON.stringify(this.sockets), {
            ttl: 60 * 60 * this.horasCache,
        });
        const users = await this.getOnlineUsers();
        socket.emit('usersOnLine', users);
        if (socket.user.profile === profiles_enum_1.ProfileTypes.SYSADMIN) {
            socket.emit(monitorEvents_enum_1.MonitorEvents.ONLINE_LIST, this.monitores);
        }
    }
    async getOnlineUsers() {
        const socketsRaw = await this.cacheManager.get('sockets');
        if (socketsRaw) {
            this.sockets = JSON.parse(socketsRaw);
        }
        const userGroups = lodash_1.groupBy(this.sockets, 'user.id');
        const userIds = Object.keys(userGroups);
        const users = [];
        for (let i = 0; i <= userIds.length - 1; i++) {
            users.push(userGroups[userIds[i]][0].user);
        }
        return users;
    }
    async handleSocketDisconnected(socket) {
        const socketsRaw = await this.cacheManager.get('sockets');
        if (socketsRaw) {
            this.sockets = JSON.parse(socketsRaw);
        }
        const idx = this.sockets.findIndex((s) => s.id === socket.id);
        if (idx > -1) {
            this.sockets.splice(idx, 1);
            await this.cacheManager.set('sockets', JSON.stringify(this.sockets), {
                ttl: 60 * 60 * this.horasCache,
            });
            if (this.sockets.findIndex((s) => {
                return s.user.id === socket.user.id;
            }) === -1) {
                const pendientesRaw = await this.cacheManager.get('pendientes');
                if (pendientesRaw) {
                    this.pendientes = JSON.parse(pendientesRaw);
                }
                this.pendientes.push(socket.user.id);
                await this.cacheManager.set('pendientes', JSON.stringify(this.pendientes), {
                    ttl: 60 * 60 * this.horasCache,
                });
                setTimeout(async () => {
                    const onlineUsers = await this.getOnlineUsers();
                    if (onlineUsers.findIndex((u) => u.id === socket.user.id) === -1) {
                        this.logger.verbose(`User ${socket.user.id} (${socket.user.firstName} ${socket.user.lastName})  is offline.`);
                        this.eventEmitter.emit('gateway.send', {
                            channel: 'general',
                            event: 'userOffLine',
                            data: socket.user,
                        });
                        const pendientesRaw = await this.cacheManager.get('pendientes');
                        if (pendientesRaw) {
                            this.pendientes = JSON.parse(pendientesRaw);
                        }
                        this.pendientes.splice(this.pendientes.indexOf(socket.user.id));
                        await this.cacheManager.set('pendientes', JSON.stringify(this.pendientes), {
                            ttl: 60 * 60 * this.horasCache,
                        });
                    }
                }, this.timeoutThreshold);
            }
        }
        const monitoresRaw = await this.cacheManager.get('monitores');
        if (monitoresRaw) {
            this.monitores = JSON.parse(monitoresRaw);
        }
        const idxMonitores = this.monitores.findIndex((s) => s.socketId === socket.id);
        if (idxMonitores > -1) {
            this.logger.verbose(`Monitor fuera de linea: ${this.monitores[idxMonitores].sucursal.nombre}`);
            this.eventEmitter.emit('gateway.send', {
                channel: profiles_enum_1.ProfileTypes.SYSADMIN,
                event: monitorEvents_enum_1.MonitorEvents.OFF_LINE,
                data: this.monitores[idxMonitores],
            });
            this.monitores.splice(idxMonitores, 1);
            await this.cacheManager.set('monitores', JSON.stringify(this.monitores), {
                ttl: 60 * 60 * this.horasCache,
            });
        }
    }
    async handleMonitorConnected(monitor) {
        this.logger.verbose(`Monitor conectado: ${monitor.sucursal.nombre}`);
        const monitoresRaw = await this.cacheManager.get('monitores');
        if (monitoresRaw) {
            this.monitores = JSON.parse(monitoresRaw);
        }
        this.monitores.push(monitor);
        await this.cacheManager.set('monitores', JSON.stringify(this.monitores), {
            ttl: 60 * 60 * this.horasCache,
        });
    }
    async handleCron() {
        if (!process.env.NODE_APP_INSTANCE ||
            process.env.NODE_APP_INSTANCE === '0') {
            const monitoresRaw = await this.cacheManager.get('monitores');
            if (monitoresRaw) {
                this.monitores = JSON.parse(monitoresRaw);
            }
            if (this.monitores.length) {
                const monitoresApiKeys = this.monitores.map((m) => m.apiKey);
                const tareas = await typeorm_1.getRepository(tareas_entity_1.TareasEntity).find({
                    where: { status: tareas_estatus_enum_1.TareasEstatus.NUEVA, channel: typeorm_1.In(monitoresApiKeys) },
                });
                if (monitoresApiKeys.length && tareas.length) {
                    this.logger.verbose(`Tareas para ${monitoresApiKeys.length} monitores en línea.`);
                    this.logger.verbose('Encontradas ' + tareas.length + ' por ejecutar');
                    for (let idx = 0; idx < tareas.length; idx++) {
                        const tarea = tareas[idx];
                        this.logger.verbose('Enviando tarea ' + tarea.data);
                        this.eventEmitter.emit('gateway.send', {
                            event: tarea.event,
                            channel: tarea.channel,
                            data: tarea,
                        });
                    }
                }
            }
        }
    }
};
__decorate([
    event_emitter_1.OnEvent('socket.connected'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OnlineService.prototype, "handleSocketConnected", null);
__decorate([
    event_emitter_1.OnEvent('socket.disconnected'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OnlineService.prototype, "handleSocketDisconnected", null);
__decorate([
    event_emitter_1.OnEvent(monitorEvents_enum_1.MonitorEvents.CONNECTED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OnlineService.prototype, "handleMonitorConnected", null);
__decorate([
    schedule_1.Cron('1 */1 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OnlineService.prototype, "handleCron", null);
OnlineService = OnlineService_1 = __decorate([
    common_1.Injectable(),
    __param(1, common_1.Inject(common_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2, Object])
], OnlineService);
exports.OnlineService = OnlineService;
//# sourceMappingURL=online.service.js.map