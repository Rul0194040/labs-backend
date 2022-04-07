import { CanActivate, ExecutionContext } from '@nestjs/common';
import { SucursalesService } from '@sanfrancisco/sucursales/services/sucursales.service';
export declare class WebsocketGuardApiKey implements CanActivate {
    private readonly sucursalesService;
    constructor(sucursalesService: SucursalesService);
    private readonly logger;
    canActivate(context: ExecutionContext): Promise<boolean>;
    validateApiKey(ApiKey: string): Promise<import("../sucursales/sucursal.entity").SucursalEntity>;
}
