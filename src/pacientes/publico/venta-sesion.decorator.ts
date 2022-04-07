import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { VentaEntity } from '@sanfrancisco/ventas/ventas.entity';
/**
 * El objetivo de este decorador es para obtener el usuario que
 * se encuentra en el req, (puesto ahi por passport) una vez que
 * es autenticado su token, se usa a nivel método de controller.
 */
export const SesionVenta = createParamDecorator(
  (data: any, ctx: ExecutionContext): Partial<VentaEntity> => {
    const req = ctx.switchToHttp().getRequest();
    return req.venta && req.venta.id ? req.venta : {};
  },
);
