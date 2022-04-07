import { SucursalEntity } from '../../sucursales/sucursal.entity';
export declare class LoginIdentityDTO {
    id: number;
    uuid: string;
    sub: number;
    email: string;
    firstName: string;
    lastName: string;
    grabandoRules: boolean;
    profile: string;
    rules: string[];
    picUrl: string;
    createdAt: Date;
    validEmail: boolean;
    sucursal?: Partial<SucursalEntity>;
}
export declare class JWTPayload {
    uuid: string;
    sub: number;
    sucursalId?: number;
}
