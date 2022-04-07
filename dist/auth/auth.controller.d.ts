import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { LoginResponseDTO } from './dto/loginresponse.dto';
import { UsersService } from '@sanfrancisco/users/users.service';
import { LoginEmailDataDTO } from './dto/loginEmailData.dto';
import { UpdateResult } from 'typeorm';
export declare class AuthController {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UsersService);
    login(body: LoginDTO, req: any): Promise<LoginResponseDTO>;
    optionsLogin(): string;
    getLoginData(data: LoginEmailDataDTO): Promise<{
        username: string;
        sucursales: Partial<import("../sucursales/sucursal.entity").SucursalEntity>[];
    }>;
    getLoginDataOptions(): string;
    passwordReset(email: string): Promise<void>;
    getPasswordToken(token: string, newPassword: string, email: string): Promise<UpdateResult>;
}
