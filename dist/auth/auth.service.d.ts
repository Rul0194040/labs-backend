import { UsersService } from '@sanfrancisco/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDTO } from './dto/loginresponse.dto';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { ConfigService } from '@nestjs/config';
import { ProfileTypes } from '@sanfrancisco/users/profiles.enum';
import { SucursalEntity } from '@sanfrancisco/sucursales/sucursal.entity';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly configService;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService);
    validateUser(email: string, pass: string, scope: ProfileTypes): Promise<any>;
    login(user: UsersEntity, rememberme: boolean, device: any, sucursalId: number): Promise<LoginResponseDTO>;
    cajasCajero(email: string): Promise<{
        username: string;
        sucursales: Partial<SucursalEntity>[];
    }>;
}
