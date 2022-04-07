import { PuestoEntity } from '@sanfrancisco/rh/puestos-departamentos/entity/puesto.entity';
import { DocumentoEntity } from './documento.entity';
export declare class DocumentoPuestoEntity {
    id: number;
    documento: DocumentoEntity;
    puesto: PuestoEntity;
}
