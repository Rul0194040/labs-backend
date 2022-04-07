import { ConfigService } from '@nestjs/config';
import { JWTPayload, LoginIdentityDTO } from '@sanfrancisco/auth/dto/loginIdentity.dto';
import { UsersService } from '@sanfrancisco/users/users.service';
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly _configService;
    private readonly usersService;
    constructor(_configService: ConfigService, usersService: UsersService);
    validate(payload: JWTPayload): Promise<LoginIdentityDTO>;
}
export {};
