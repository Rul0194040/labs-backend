import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { MyLogger } from '@sanfrancisco/logger';
import { SucursalesService } from '@sanfrancisco/sucursales/services/sucursales.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly sucursalesService: SucursalesService) {}
  logger = new MyLogger(ApiKeyGuard.name);
  async canActivate(context: ExecutionContext): Promise<boolean> {
    //obtener el request de quien lo invoca esta estrategia con el guard
    const request = context.switchToHttp().getRequest();

    //de los headers, buscamos el api-key
    if (request.headers['api-key']) {
      const sucursal = await this.validateApiKey(request.headers['api-key']);
      if (sucursal) {
        request.sucursal = sucursal;
        return true;
      }
    } else {
      return false;
    }
  }

  async validateApiKey(ApiKey: string) {
    return await this.sucursalesService.getByApiKey(ApiKey);
  }
}
