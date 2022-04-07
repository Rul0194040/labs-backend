import { PaginationPrimeNgResult } from './../common/DTO/pagination-prime-Ng-result.dto';
import { CreateServiciosInsumosDTO } from './DTOs/createServicioInsumo.dto';
import { UpdateResult, DeleteResult } from 'typeorm';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { CreateServicioDTO } from './DTOs/createServicio.dto';
import { UpdateServicioDTO } from './DTOs/updateServicio.dto';
import { ServicioEntity } from './servicio.entity';
import { ServiciosService } from './servicios.service';
import { ServiciosInsumosEntity } from './servicios-insumos.entity';
import { UpdateServiceCatalogsDTO } from './DTOs/updateServiceCatalogs.dto';
export declare class ServiciosController {
    private readonly serviciosService;
    constructor(serviciosService: ServiciosService);
    create(servicio: CreateServicioDTO): Promise<ServicioEntity>;
    updateCatalogs(id: number, catalogs: UpdateServiceCatalogsDTO): Promise<UpdateResult>;
    paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    agragar(idServicio: number, insumo: CreateServiciosInsumosDTO): Promise<ServiciosInsumosEntity>;
    paginateInsumo(idServicio: number, options: PaginationOptions): Promise<any>;
    getById(id: number): Promise<ServicioEntity>;
    update(id: number, data: UpdateServicioDTO): Promise<UpdateResult>;
    delete(id: number): Promise<DeleteResult>;
    quitarInsumo(id: number): Promise<DeleteResult>;
    importarServiciosXLS(file: any): Promise<any>;
}
