import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { ZonaEnum } from '../zona.enum';
export declare class CreateSucursalDTO {
    nombre: string;
    apiKey: string;
    descripcion: string;
    esMatriz: boolean;
    telefono?: string;
    responsableId?: number;
    puedeHacerRequisicion?: boolean;
    esForanea?: boolean;
    zona: ZonaEnum;
    seleccionarZona?: boolean;
    userResponsable?: UsersEntity;
}
