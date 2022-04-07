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
exports.EmailEntity = void 0;
const typeorm_1 = require("typeorm");
const commonEntity_abstract_1 = require("../../commonEntity.abstract");
let EmailEntity = class EmailEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.Column({
        name: 'name',
        type: 'text',
        nullable: false,
    }),
    __metadata("design:type", String)
], EmailEntity.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        name: 'mail',
        type: 'text',
        nullable: false,
    }),
    __metadata("design:type", String)
], EmailEntity.prototype, "mail", void 0);
__decorate([
    typeorm_1.Column({
        name: 'subject',
        type: 'text',
        nullable: false,
    }),
    __metadata("design:type", String)
], EmailEntity.prototype, "subject", void 0);
__decorate([
    typeorm_1.Column({
        name: 'message',
        type: 'text',
        nullable: false,
    }),
    __metadata("design:type", String)
], EmailEntity.prototype, "message", void 0);
EmailEntity = __decorate([
    typeorm_1.Entity('emails')
], EmailEntity);
exports.EmailEntity = EmailEntity;
//# sourceMappingURL=email.entity.js.map