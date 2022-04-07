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
exports.MensajeEntity = void 0;
const commonEntity_abstract_1 = require("../common/commonEntity.abstract");
const users_entity_1 = require("../users/users.entity");
const typeorm_1 = require("typeorm");
let MensajeEntity = class MensajeEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.ManyToOne(() => users_entity_1.UsersEntity, { nullable: true }),
    __metadata("design:type", users_entity_1.UsersEntity)
], MensajeEntity.prototype, "origen", void 0);
__decorate([
    typeorm_1.ManyToOne(() => users_entity_1.UsersEntity, { nullable: false }),
    __metadata("design:type", users_entity_1.UsersEntity)
], MensajeEntity.prototype, "destino", void 0);
__decorate([
    typeorm_1.Column({ type: 'text' }),
    __metadata("design:type", String)
], MensajeEntity.prototype, "texto", void 0);
__decorate([
    typeorm_1.Column({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], MensajeEntity.prototype, "leido", void 0);
MensajeEntity = __decorate([
    typeorm_1.Entity('mensajes')
], MensajeEntity);
exports.MensajeEntity = MensajeEntity;
//# sourceMappingURL=mensaje.entity.js.map