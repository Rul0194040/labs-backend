import { createParamDecorator, ExecutionContext } from '@nestjs/common';
/**
 * El objetivo de este decorador es para obtener el usuario que
 * se encuentra en el req, (puesto ahi por passport) una vez que
 * es autenticado su token, se usa a nivel método de controller.
 */
export const User = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return req.user && req.user.id ? req.user : {};
});
