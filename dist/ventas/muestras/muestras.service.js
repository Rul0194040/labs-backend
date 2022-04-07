"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MuestrasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const ventasDetalle_entity_1 = require("../ventasDetalle.entity");
const muestras_entity_1 = require("./muestras.entity");
let MuestrasService = class MuestrasService {
    async create(usuario, data) {
        const ventaDetalle = await typeorm_1.getRepository(ventasDetalle_entity_1.DetalleVentasEntity).findOne(data.ventaDetalleId);
        if (!ventaDetalle)
            throw new common_1.HttpException('Detalle de venta no encontrado', common_1.HttpStatus.NOT_FOUND);
        const muestraCrear = {
            ventaDetalle,
            usuario,
            notas: data.notas,
        };
        return await typeorm_1.getRepository(muestras_entity_1.MuestraEntity).save(muestraCrear);
    }
    async delete(id) {
        return typeorm_1.getRepository(muestras_entity_1.MuestraEntity).delete(id);
    }
};
MuestrasService = __decorate([
    common_1.Injectable()
], MuestrasService);
exports.MuestrasService = MuestrasService;
//# sourceMappingURL=muestras.service.js.map