import { CanActivate, ExecutionContext } from '@nestjs/common';
import { LoginIdentityDTO } from '../auth/dto/loginIdentity.dto';
import { ConfigService } from '@nestjs/config';
export declare class WebsocketGuardAuthorization implements CanActivate {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    validateJWT(jwt: string): Promise<LoginIdentityDTO | boolean>;
}
