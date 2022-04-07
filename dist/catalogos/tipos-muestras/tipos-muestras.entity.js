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
exports.TipoMuestraEntity = void 0;
const typeorm_1 = require("typeorm");
const commonEntity_abstract_1 = require("../../common/commonEntity.abstract");
let TipoMuestraEntity = class TipoMuestraEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.Column({
        name: 'nombre',
        type: 'varchar',
        length: 150,
        nullable: false,
    }),
    __metadata("design:type", String)
], TipoMuestraEntity.prototype, "nombre", void 0);
TipoMuestraEntity = __decorate([
    typeorm_1.Entity('tiposMuestras')
], TipoMuestraEntity);
exports.TipoMuestraEntity = TipoMuestraEntity;
//# sourceMappingURL=tipos-muestras.entity.js.map