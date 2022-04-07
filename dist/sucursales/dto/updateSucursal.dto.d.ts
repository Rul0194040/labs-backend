import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { ZonaEnum } from '../zona.enum';
export declare class UpdateSucursalDTO {
    nombre: string;
    descripcion: string;
    calle: string;
    numExt: string;
    colonia: string;
    cp: number;
    municipio: string;
    esMatriz: boolean;
    lat: string;
    lng: string;
    telefono?: string;
    responsableId?: number;
    puedeHacerRequisicion?: boolean;
    esForanea?: boolean;
    zona: ZonaEnum;
    seleccionarZona: boolean;
    userResponsable?: UsersEntity;
}
