import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { DocumentoEntity } from './documento.entity';
export declare class DocumentoEmpleadoEntity {
    id: number;
    documento: DocumentoEntity;
    empleado: UsersEntity;
    file: string;
}
