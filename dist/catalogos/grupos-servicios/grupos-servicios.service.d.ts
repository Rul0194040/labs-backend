import { PaginationPrimeNgResult } from './../../common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { GrupoServicioEntity } from './grupo-servicio.entity';
import { CreateGrupoServiciosDTO } from './DTOs/createGrupoServicio.dto';
import { UpdateGrupoServiciosDTO } from './DTOs/updateGrupoServicio.dto';
export declare class GruposServiciosService {
    private readonly notFoundMessage;
    create(grupoServicios: CreateGrupoServiciosDTO): Promise<GrupoServicioEntity>;
    getById(id: number): Promise<GrupoServicioEntity>;
    update(id: number, grupo: UpdateGrupoServiciosDTO): Promise<UpdateResult>;
    updateStatus(id: number, active: boolean): Promise<UpdateResult>;
    delete(id: number): Promise<DeleteResult>;
    paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
}
