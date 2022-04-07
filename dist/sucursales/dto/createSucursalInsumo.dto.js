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
exports.CreateSucursalesInsumosDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const lotes_entity_1 = require("../../lotes/lotes.entity");
const class_validator_1 = require("class-validator");
class CreateSucursalesInsumosDTO {
}
__decorate([
    swagger_1.ApiProperty({
        description: 'id del insumo',
    }),
    __metadata("design:type", Number)
], CreateSucursalesInsumosDTO.prototype, "insumo", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'cantidad a agregar',
    }),
    __metadata("design:type", Number)
], CreateSucursalesInsumosDTO.prototype, "cantidad", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'id del lote',
    }),
    class_validator_1.IsOptional(),
    __metadata("design:type", lotes_entity_1.LoteEntity)
], CreateSucursalesInsumosDTO.prototype, "lote", void 0);
exports.CreateSucursalesInsumosDTO = CreateSucursalesInsumosDTO;
//# sourceMappingURL=createSucursalInsumo.dto.js.map