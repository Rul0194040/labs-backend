import { PerfilTipoEmpleado, ProfileTypes } from '../profiles.enum';
export declare class createUserDTO {
    email: string;
    firstName: string;
    lastName: string;
    profile?: ProfileTypes;
    tipoEmpleado?: PerfilTipoEmpleado;
    password?: string;
    active?: boolean;
    comisionVendedor?: number;
    rules?: string[];
    telefono?: string;
    sucursal?: number;
    nip?: string;
    maxDescuento?: number;
    constructor(email: string, firstName: string, lastName: string, password: string, profile?: ProfileTypes, active?: boolean, rules?: string[], telefono?: string, sucursal?: number, nip?: string, maxDescuento?: number, tipoEmpleado?: PerfilTipoEmpleado, comisionVendedor?: number);
}
