import { SucursalEntity } from '../../sucursales/sucursal.entity';
export class LoginIdentityDTO {
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

export class JWTPayload {
  uuid: string;
  sub: number;
  sucursalId?: number;
}
