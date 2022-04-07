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
exports.LoteEntity = void 0;
const commonEntity_abstract_1 = require("../common/commonEntity.abstract");
const typeorm_1 = require("typeorm");
let LoteEntity = class LoteEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.Column({
        name: 'numero',
        type: 'varchar',
        length: 100,
        nullable: false,
        unique: true,
    }),
    __metadata("design:type", String)
], LoteEntity.prototype, "numero", void 0);
__decorate([
    typeorm_1.Column({
        name: 'descripcion',
        type: 'varchar',
        length: 150,
        nullable: true,
    }),
    __metadata("design:type", String)
], LoteEntity.prototype, "descripcion", void 0);
__decorate([
    typeorm_1.Column({ type: 'timestamp', nullable: true, default: null }),
    __metadata("design:type", Date)
], LoteEntity.prototype, "caducidad", void 0);
LoteEntity = __decorate([
    typeorm_1.Entity('lotes')
], LoteEntity);
exports.LoteEntity = LoteEntity;
//# sourceMappingURL=lotes.entity.js.map