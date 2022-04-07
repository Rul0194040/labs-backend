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
exports.UserSucursalesEntity = void 0;
const sucursal_entity_1 = require("../sucursales/sucursal.entity");
const typeorm_1 = require("typeorm");
const users_entity_1 = require("./users.entity");
let UserSucursalesEntity = class UserSucursalesEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], UserSucursalesEntity.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => users_entity_1.UsersEntity),
    __metadata("design:type", users_entity_1.UsersEntity)
], UserSucursalesEntity.prototype, "user", void 0);
__decorate([
    typeorm_1.ManyToOne(() => sucursal_entity_1.SucursalEntity),
    __metadata("design:type", sucursal_entity_1.SucursalEntity)
], UserSucursalesEntity.prototype, "sucursal", void 0);
__decorate([
    typeorm_1.Column({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], UserSucursalesEntity.prototype, "responsable", void 0);
UserSucursalesEntity = __decorate([
    typeorm_1.Entity('userSucursales')
], UserSucursalesEntity);
exports.UserSucursalesEntity = UserSucursalesEntity;
//# sourceMappingURL=userSucursales.entity.js.map