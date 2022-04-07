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
var EventsGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsGateway = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const websockets_1 = require("@nestjs/websockets");
const profiles_enum_1 = require("../users/profiles.enum");
const qrs_entity_1 = require("../empleados/qrs/qrs.entity");
const qrs_service_1 = require("../empleados/qrs/qrs.service");
const logger_1 = require("../logger");
const tareas_estatus_enum_1 = require("../pxlab/tareas-estatus.enum");
const tareas_entity_1 = require("../pxlab/tareas.entity");
const sucursal_entity_1 = require("../sucursales/sucursal.entity");
const users_entity_1 = require("../users/users.entity");
const ventas_entity_1 = require("../ventas/ventas.entity");
const lodash_1 = require("lodash");
const socket_io_1 = require("socket.io");
const typeorm_1 = require("typeorm");
const event_dto_1 = require("./event.dto");
const monitorEvents_enum_1 = require("./monitorEvents.enum");
const parsewsbody_pipe_1 = require("./parsewsbody.pipe");
const websocketApiKey_guard_1 = require("./websocketApiKey.guard");
const websocketAuthorization_guard_1 = require("./websocketAuthorization.guard");
let EventsGateway = EventsGateway_1 = class EventsGateway {
    constructor(eventEmitter, qrsService) {
        this.eventEmitter = eventEmitter;
        this.qrsService = qrsService;
        this.logger = new logger_1.MyLogger(EventsGateway_1.name);
    }
    handleBroadcastEvent(event) {
        this.server.to(event.channel).emit(event.event, event.data);
    }
    enviarMensaje(data, socket) {
        this.eventEmitter.emit('chat.mensaje', {
            origenUuid: socket.user.uuid,
            texto: data.texto,
            destinoUuid: data.destinoUuid,
        });
        return 'OK';
    }
    async channels(data, socket) {
        const canales = [
            'general',
            'profile_' + socket.user.profile,
            socket.user.uuid,
        ];
        this.logger.verbose(`User ${socket.user.id} (${socket.user.firstName} ${socket.user.lastName}) has new socket ${socket.id}.`);
        await socket.join(canales);
        this.eventEmitter.emit('socket.connected', socket);
        return { channels: canales };
    }
    async qrEscaneado(data, socket) {
        const qrEncontrado = await this.qrsService.getByUuid(data.uuid);
        let qrEntrada;
        if (!qrEncontrado) {
            return { error: 'El código no se encuentra, inténtelo de nuevo.' };
        }
        if (data.entrada) {
            qrEntrada = await this.qrsService.getByUuid(data.entrada);
        }
        this.handleBroadcastEvent({
            event: 'quemandoQr',
            channel: qrEncontrado.sucursal.uuid,
            data: qrEncontrado,
        });
        const resultQuemar = await this.qrsService.quemarQr(qrEncontrado.uuid, socket.user.id, qrEntrada, data.lat, data.lng);
        const codigoNuevo = await this.qrsService.generarQr(qrEncontrado.sucursal.id);
        this.handleBroadcastEvent({
            event: 'nuevoQr',
            channel: qrEncontrado.sucursal.uuid,
            data: { codigoNuevo, usuarioQuema: socket.user, resultQuemar },
        });
        const success = { resultQuemar };
        if (!qrEntrada) {
            success['qrEntrada'] = qrEncontrado;
            this.handleBroadcastEvent({
                event: 'checador.entrada',
                channel: profiles_enum_1.ProfileTypes.SYSADMIN,
                data: socket.user,
            });
        }
        else {
            success['qrSalida'] = qrEncontrado;
            this.handleBroadcastEvent({
                event: 'checador.salida',
                channel: profiles_enum_1.ProfileTypes.SYSADMIN,
                data: socket.user,
            });
        }
        return success;
    }
    async monitorOnline(data, socket) {
        const canales = [socket.sucursal.uuid, socket.apiKey, 'monitores'];
        const userAgent = socket.handshake.headers['user-agent'];
        const monitorIp = socket.handshake.address;
        await socket.join(canales);
        const sucursal = lodash_1.pick(socket.sucursal, [
            'id',
            'uuid',
            'nombre',
        ]);
        this.eventEmitter.emit(monitorEvents_enum_1.MonitorEvents.CONNECTED, {
            socketId: socket.id,
            sucursal: sucursal,
            apiKey: socket.apiKey,
            since: socket.handshake.time,
            userAgent,
            monitorIp,
        });
        this.handleBroadcastEvent({
            channel: 'profile_' + profiles_enum_1.ProfileTypes.SYSADMIN,
            event: monitorEvents_enum_1.MonitorEvents.ON_LINE,
            data: {
                socketId: socket.id,
                sucursal: sucursal,
                since: socket.handshake.time,
                userAgent,
                monitorIp,
            },
        });
        const newQr = await this.qrsService.generarQr(socket.sucursal.id);
        return {
            sucursal: sucursal,
            channels: canales,
            qr: newQr.uuid,
        };
    }
    async folioPXListo(data) {
        await typeorm_1.getRepository(tareas_entity_1.TareasEntity).update({ id: data.tareaId }, { status: tareas_estatus_enum_1.TareasEstatus.FINALIZADA });
        const folioPx = data.response.MuestraResult.split('|');
        if (data.response && data.response.MuestraResult && folioPx[0] === '1') {
            if (folioPx[1].length === 8) {
                this.logger.verbose('Recibido folio pxlab: ' + JSON.stringify(data.response));
                return await typeorm_1.getRepository(ventas_entity_1.VentaEntity)
                    .createQueryBuilder()
                    .update()
                    .set({ folioPxLab: folioPx[1] })
                    .where('id = :idVenta', { idVenta: data.idVenta })
                    .execute();
            }
            else {
                this.logger.log('Respuesta de folio pxlab aceptada.' + folioPx[1]);
            }
        }
        else {
            this.logger.log('Respuesta de folio pxlab desconocida.' + JSON.stringify(data));
        }
        return 'OK';
    }
    async estudioOk(data) {
        this.logger.verbose('pxlab.responseNuevoEstudio: ' + JSON.stringify(data));
        await typeorm_1.getRepository(tareas_entity_1.TareasEntity).update({ id: data.tareaId }, { status: tareas_estatus_enum_1.TareasEstatus.FINALIZADA });
        return 'OK';
    }
    async clienteOk(data) {
        this.logger.verbose('pxlab.responseNuevoCliente:' + JSON.stringify(data));
        await typeorm_1.getRepository(tareas_entity_1.TareasEntity).update({ id: data.tareaId }, { status: tareas_estatus_enum_1.TareasEstatus.FINALIZADA });
        return 'OK';
    }
    async afterInit() {
        this.logger.verbose('EventsGateway initialized.');
        return;
    }
    async handleConnection(socket) {
        this.logger.verbose('EventsGateway->handleConnection->socket: ' + socket.id);
        return;
    }
    async handleDisconnect(socket) {
        var _a;
        this.logger.verbose(`EventsGateway->handleDisconnect->socket: ${socket.id}, ${(_a = socket.user) === null || _a === void 0 ? void 0 : _a.email}`);
        this.eventEmitter.emit('socket.disconnected', socket);
    }
};
__decorate([
    websockets_1.WebSocketServer(),
    __metadata("design:type", socket_io_1.Server)
], EventsGateway.prototype, "server", void 0);
__decorate([
    event_emitter_1.OnEvent('gateway.send'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [event_dto_1.EventDTO]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleBroadcastEvent", null);
__decorate([
    websockets_1.SubscribeMessage('enviarMensaje'),
    common_1.UseGuards(websocketAuthorization_guard_1.WebsocketGuardAuthorization),
    __param(0, websockets_1.MessageBody(parsewsbody_pipe_1.ParseWSBodyPipe)),
    __param(1, websockets_1.ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "enviarMensaje", null);
__decorate([
    websockets_1.SubscribeMessage('channels'),
    common_1.UseGuards(websocketAuthorization_guard_1.WebsocketGuardAuthorization),
    __param(0, websockets_1.MessageBody(parsewsbody_pipe_1.ParseWSBodyPipe)),
    __param(1, websockets_1.ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "channels", null);
__decorate([
    websockets_1.SubscribeMessage(monitorEvents_enum_1.MonitorEvents.QR_SCAN),
    common_1.UseGuards(websocketAuthorization_guard_1.WebsocketGuardAuthorization),
    __param(0, websockets_1.MessageBody(parsewsbody_pipe_1.ParseWSBodyPipe)),
    __param(1, websockets_1.ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "qrEscaneado", null);
__decorate([
    websockets_1.SubscribeMessage('monitor.online'),
    common_1.UseGuards(websocketApiKey_guard_1.WebsocketGuardApiKey),
    __param(0, websockets_1.MessageBody(parsewsbody_pipe_1.ParseWSBodyPipe)),
    __param(1, websockets_1.ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "monitorOnline", null);
__decorate([
    websockets_1.SubscribeMessage('pxlab.responseVenta'),
    common_1.UseGuards(websocketApiKey_guard_1.WebsocketGuardApiKey),
    __param(0, websockets_1.MessageBody(parsewsbody_pipe_1.ParseWSBodyPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "folioPXListo", null);
__decorate([
    websockets_1.SubscribeMessage('pxlab.responseNuevoEstudio'),
    common_1.UseGuards(websocketApiKey_guard_1.WebsocketGuardApiKey),
    __param(0, websockets_1.MessageBody(parsewsbody_pipe_1.ParseWSBodyPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "estudioOk", null);
__decorate([
    websockets_1.SubscribeMessage('pxlab.responseNuevoCliente'),
    common_1.UseGuards(websocketApiKey_guard_1.WebsocketGuardApiKey),
    __param(0, websockets_1.MessageBody(parsewsbody_pipe_1.ParseWSBodyPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "clienteOk", null);
EventsGateway = EventsGateway_1 = __decorate([
    websockets_1.WebSocketGateway(),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2,
        qrs_service_1.QrsService])
], EventsGateway);
exports.EventsGateway = EventsGateway;
//# sourceMappingURL=events.gateway.js.map