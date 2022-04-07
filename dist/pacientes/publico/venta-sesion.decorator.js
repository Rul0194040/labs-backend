"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SesionVenta = void 0;
const common_1 = require("@nestjs/common");
const ventas_entity_1 = require("../../ventas/ventas.entity");
exports.SesionVenta = common_1.createParamDecorator((data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    return req.venta && req.venta.id ? req.venta : {};
});
//# sourceMappingURL=venta-sesion.decorator.js.map