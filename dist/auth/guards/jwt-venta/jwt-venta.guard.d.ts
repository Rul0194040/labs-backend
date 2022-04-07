import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MyLogger } from '@sanfrancisco/logger';
export declare class JwtVentaGuard implements CanActivate {
    private readonly configService;
    constructor(configService: ConfigService);
    logger: MyLogger;
    canActivate(context: ExecutionContext): Promise<boolean>;
    validateJWT(jwt: string): any;
}
