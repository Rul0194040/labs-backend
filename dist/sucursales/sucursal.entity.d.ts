import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { ZonaEnum } from './zona.enum';
import { ApiKeyEntity } from './api-keys.entity';
export declare class SucursalEntity extends CommonEntity {
    nombre: string;
    descripcion: string;
    calle: string;
    numExt: string;
    colonia: string;
    cp: number;
    municipio: string;
    esMatriz: boolean;
    esLaboratorio: boolean;
    esForanea: boolean;
    lat: string;
    lng: string;
    telefono: string;
    responsable: string;
    userResponsable: UsersEntity;
    puedeHacerRequisicion: boolean;
    zona: ZonaEnum;
    apikeys: ApiKeyEntity[];
    seleccionarZona: boolean;
    usuarios: UsersEntity;
}
