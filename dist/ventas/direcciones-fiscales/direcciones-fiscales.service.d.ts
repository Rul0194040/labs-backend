import { UpdateResult, DeleteResult } from 'typeorm';
import { DireccionFiscalEntity } from './direccionesFiscales.entity';
import { CreateDireccionDTO } from './DTOs/create-direcciones-fiscales.dto';
import { UpdateDireccionDTO } from './DTOs/update-direcciones-fiscales.dto';
export declare class DireccionesFiscalesService {
    private readonly notFoundMessage;
    create(direccion: CreateDireccionDTO): Promise<DireccionFiscalEntity>;
    getById(id: number): Promise<DireccionFiscalEntity>;
    getDirecciones(esCliente: boolean, id: number): Promise<DireccionFiscalEntity[]>;
    update(id: number, direccion: UpdateDireccionDTO): Promise<UpdateResult>;
    delete(id: number): Promise<DeleteResult>;
}
