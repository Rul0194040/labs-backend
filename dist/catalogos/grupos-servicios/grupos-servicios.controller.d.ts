import { GruposServiciosService } from './grupos-servicios.service';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { UpdateResult, DeleteResult } from 'typeorm';
import { GrupoServicioEntity } from './grupo-servicio.entity';
import { CreateGrupoServiciosDTO } from './DTOs/createGrupoServicio.dto';
import { UpdateGrupoServiciosDTO } from './DTOs/updateGrupoServicio.dto';
export declare class GruposServiciosController {
    private readonly grupoServiciosService;
    constructor(grupoServiciosService: GruposServiciosService);
    create(grupo: CreateGrupoServiciosDTO): Promise<GrupoServicioEntity>;
    paginate(options: PaginationOptions): Promise<any>;
    getById(id: number): Promise<GrupoServicioEntity>;
    update(id: number, grupo: UpdateGrupoServiciosDTO): Promise<UpdateResult>;
    updateStatus(id: number, status: boolean): Promise<UpdateResult>;
    delete(id: number): Promise<DeleteResult>;
}
