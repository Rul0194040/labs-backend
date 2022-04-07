import { CanActivate, ExecutionContext } from '@nestjs/common';
import { MyLogger } from '@sanfrancisco/logger';
import { SucursalesService } from '@sanfrancisco/sucursales/services/sucursales.service';
export declare class ApiKeyGuard implements CanActivate {
    private readonly sucursalesService;
    constructor(sucursalesService: SucursalesService);
    logger: MyLogger;
    canActivate(context: ExecutionContext): Promise<boolean>;
    validateApiKey(ApiKey: string): Promise<import("../../../sucursales/sucursal.entity").SucursalEntity>;
}
