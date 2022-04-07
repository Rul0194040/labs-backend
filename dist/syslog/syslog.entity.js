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
exports.SyslogEntity = void 0;
const commonEntity_abstract_1 = require("../common/commonEntity.abstract");
const users_entity_1 = require("../users/users.entity");
const typeorm_1 = require("typeorm");
let SyslogEntity = class SyslogEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.ManyToOne(() => users_entity_1.UsersEntity, { nullable: true }),
    __metadata("design:type", users_entity_1.UsersEntity)
], SyslogEntity.prototype, "user", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], SyslogEntity.prototype, "userId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 10,
        nullable: false,
    }),
    __metadata("design:type", String)
], SyslogEntity.prototype, "method", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 150,
        nullable: false,
    }),
    __metadata("design:type", String)
], SyslogEntity.prototype, "baseUrl", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
        nullable: false,
        default: 0,
    }),
    __metadata("design:type", Number)
], SyslogEntity.prototype, "statusCode", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
        nullable: false,
        default: 0,
    }),
    __metadata("design:type", Number)
], SyslogEntity.prototype, "contentLength", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 150,
        nullable: false,
    }),
    __metadata("design:type", String)
], SyslogEntity.prototype, "userAgent", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 15,
        nullable: false,
    }),
    __metadata("design:type", String)
], SyslogEntity.prototype, "ip", void 0);
SyslogEntity = __decorate([
    typeorm_1.Entity('syslog')
], SyslogEntity);
exports.SyslogEntity = SyslogEntity;
//# sourceMappingURL=syslog.entity.js.map