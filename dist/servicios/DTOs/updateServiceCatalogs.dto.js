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
exports.UpdateServiceCatalogsEntityDTO = exports.UpdateServiceCatalogsDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const grupo_servicio_entity_1 = require("../../catalogos/grupos-servicios/grupo-servicio.entity");
const tipos_muestras_entity_1 = require("../../catalogos/tipos-muestras/tipos-muestras.entity");
const tipos_unidades_entity_1 = require("../../catalogos/tipos-unidades/tipos-unidades.entity");
class UpdateServiceCatalogsDTO {
}
__decorate([
    swagger_1.ApiProperty({
        description: 'Grupo de servicio al que pertenece',
    }),
    __metadata("design:type", Number)
], UpdateServiceCatalogsDTO.prototype, "grupoServicio", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'Tipo de muestra al que pertenece',
    }),
    __metadata("design:type", Number)
], UpdateServiceCatalogsDTO.prototype, "tipoMuestra", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'Tipo de unidad',
    }),
    __metadata("design:type", Number)
], UpdateServiceCatalogsDTO.prototype, "tipoUnidad", void 0);
exports.UpdateServiceCatalogsDTO = UpdateServiceCatalogsDTO;
class UpdateServiceCatalogsEntityDTO {
}
__decorate([
    swagger_1.ApiProperty({
        description: 'Grupo de servicio al que pertenece',
    }),
    __metadata("design:type", grupo_servicio_entity_1.GrupoServicioEntity)
], UpdateServiceCatalogsEntityDTO.prototype, "grupoServicio", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'Tipo de muestra al que pertenece',
    }),
    __metadata("design:type", tipos_muestras_entity_1.TipoMuestraEntity)
], UpdateServiceCatalogsEntityDTO.prototype, "tipoMuestra", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'Tipo de unidad',
    }),
    __metadata("design:type", tipos_unidades_entity_1.TipoUnidadEntity)
], UpdateServiceCatalogsEntityDTO.prototype, "tipoUnidad", void 0);
exports.UpdateServiceCatalogsEntityDTO = UpdateServiceCatalogsEntityDTO;
//# sourceMappingURL=updateServiceCatalogs.dto.js.map