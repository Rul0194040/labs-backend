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
exports.ApiKeyEntity = void 0;
const commonEntity_abstract_1 = require("../common/commonEntity.abstract");
const typeorm_1 = require("typeorm");
const sucursal_entity_1 = require("./sucursal.entity");
let ApiKeyEntity = class ApiKeyEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.Column({ type: 'varchar', unique: true }),
    typeorm_1.Generated('uuid'),
    __metadata("design:type", String)
], ApiKeyEntity.prototype, "key", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', nullable: false }),
    __metadata("design:type", String)
], ApiKeyEntity.prototype, "nombre", void 0);
__decorate([
    typeorm_1.ManyToOne(() => sucursal_entity_1.SucursalEntity, { nullable: false }),
    __metadata("design:type", sucursal_entity_1.SucursalEntity)
], ApiKeyEntity.prototype, "sucursal", void 0);
ApiKeyEntity = __decorate([
    typeorm_1.Entity('apikeys')
], ApiKeyEntity);
exports.ApiKeyEntity = ApiKeyEntity;
//# sourceMappingURL=api-keys.entity.js.map