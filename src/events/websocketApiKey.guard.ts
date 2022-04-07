import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { MyLogger } from '@sanfrancisco/logger';
import { SucursalesService } from '@sanfrancisco/sucursales/services/sucursales.service';
import { WSMessageMonitorBodyDTO } from './messageMonitor.dto';
/**
 * Guard para socket, utilizamos la misma metodología...
 */
@Injectable()
export class WebsocketGuardApiKey implements CanActivate {
  constructor(private readonly sucursalesService: SucursalesService) {}
  private readonly logger = new MyLogger(WebsocketGuardApiKey.name);

  /**
   * Puede o no puede?
   * @param context
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    //obtenemos el cliente del contexto para insertarle su identidad
    const wsClient = context.switchToWs().getClient();

    // data del contexto, será modificada
    const data: WSMessageMonitorBodyDTO = context.switchToWs().getData();

    const sucursal = await this.validateApiKey(data.ApiKey);

    if (sucursal) {
      wsClient.sucursal = {
        id: sucursal.id,
        uuid: sucursal.uuid,
        nombre: sucursal.nombre,
      }; //inserción de identidad en el cliente
      wsClient.apiKey = data.ApiKey;
      return true; //ok, pasele
    } else {
      return false;
    }
  }

  async validateApiKey(ApiKey: string) {
    return await this.sucursalesService.getByApiKey(ApiKey);
  }
}
