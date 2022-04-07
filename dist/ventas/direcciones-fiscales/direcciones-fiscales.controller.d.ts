import { UpdateResult, DeleteResult } from 'typeorm';
import { DireccionesFiscalesService } from './direcciones-fiscales.service';
import { DireccionFiscalEntity } from './direccionesFiscales.entity';
import { CreateDireccionDTO } from './DTOs/create-direcciones-fiscales.dto';
import { UpdateDireccionDTO } from './DTOs/update-direcciones-fiscales.dto';
export declare class DireccionesFiscalesController {
    private readonly direccionesFiscalesService;
    constructor(direccionesFiscalesService: DireccionesFiscalesService);
    create(direccion: CreateDireccionDTO): Promise<DireccionFiscalEntity>;
    getById(id: number): Promise<DireccionFiscalEntity>;
    getDireccionesPaciente(id: number): Promise<DireccionFiscalEntity[]>;
    getDireccionesCliente(id: number): Promise<DireccionFiscalEntity[]>;
    update(id: number, direccion: UpdateDireccionDTO): Promise<UpdateResult>;
    delete(id: number): Promise<DeleteResult>;
}
