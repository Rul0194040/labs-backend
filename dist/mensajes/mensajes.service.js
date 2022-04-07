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
exports.MensajesService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const users_entity_1 = require("../users/users.entity");
const typeorm_1 = require("typeorm");
const mensaje_entity_1 = require("./mensaje.entity");
let MensajesService = class MensajesService {
    constructor(eventEmitter) {
        this.eventEmitter = eventEmitter;
    }
    handleAbrirConversacion(origenUuid, destinoUuid) {
        return typeorm_1.getRepository(mensaje_entity_1.MensajeEntity)
            .createQueryBuilder('mensaje')
            .leftJoin('mensaje.origen', 'origen')
            .leftJoin('mensaje.destino', 'destino')
            .where(new typeorm_1.Brackets((qb) => {
            qb.where('origen.uuid=:origenUuid', {
                origenUuid: origenUuid,
            }).andWhere('destino.uuid=:destinoUuid', {
                destinoUuid: destinoUuid,
            });
        }))
            .orWhere(new typeorm_1.Brackets((qb1) => {
            qb1
                .where('origen.uuid=:destinoUuid', {
                origenUuid: destinoUuid,
            })
                .andWhere('destino.uuid=:origenUuid', {
                destinoUuid: origenUuid,
            });
        }))
            .select([
            'mensaje',
            'origen.id',
            'origen.uuid',
            'origen.firstName',
            'origen.lastName',
            'destino.id',
            'destino.uuid',
            'destino.firstName',
            'destino.lastName',
        ])
            .orderBy('mensaje.createdAt', 'ASC')
            .getMany();
    }
    async handleBroadcastEvent(mensajeToSend) {
        const userRepository = typeorm_1.getRepository(users_entity_1.UsersEntity);
        let origen;
        if (mensajeToSend.origenUuid) {
            origen = await userRepository.findOne({
                where: { uuid: mensajeToSend.origenUuid },
            });
            if (!origen) {
                throw new common_1.HttpException('El origen no existe', common_1.HttpStatus.NOT_FOUND);
            }
        }
        const destino = await userRepository.findOne({
            where: { uuid: mensajeToSend.destinoUuid },
        });
        if (!destino) {
            throw new common_1.HttpException('El destino no existe', common_1.HttpStatus.NOT_FOUND);
        }
        const mensaje = await typeorm_1.getRepository(mensaje_entity_1.MensajeEntity).save({
            origen,
            destino,
            texto: mensajeToSend.texto,
        });
        this.eventEmitter.emit('gateway.send', {
            event: 'nuevoMensaje',
            channel: destino.uuid,
            data: mensaje,
        });
        this.eventEmitter.emit('gateway.send', {
            event: 'nuevoMensaje',
            channel: origen.uuid,
            data: mensaje,
        });
        return mensaje;
    }
};
__decorate([
    event_emitter_1.OnEvent('chat.mensaje'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MensajesService.prototype, "handleBroadcastEvent", null);
MensajesService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2])
], MensajesService);
exports.MensajesService = MensajesService;
//# sourceMappingURL=mensajes.service.js.map