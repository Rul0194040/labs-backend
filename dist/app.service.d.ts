import { ConfigService } from '@nestjs/config';
import { UsersService } from './users/users.service';
export declare class AppService {
    private readonly usersService;
    private readonly configService;
    constructor(usersService: UsersService, configService: ConfigService);
    private readonly logger;
    initDatabase(): Promise<void>;
    private createSuperUsers;
    private createSysAdminUsers;
    private createUserAlmacenGeneral;
    private createUserSucursal;
    private createUserTesoreroSucursalesCentrales;
    private createUserTesoreroSucursalesForaneas;
    private createUserCompras;
    private createUserDirectivos;
    private createUserGerenteSucursales;
    private createUserVentaGeneral;
}
