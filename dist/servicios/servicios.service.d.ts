import { PaginationPrimeNgResult } from './../common/DTO/pagination-prime-Ng-result.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateServicioDTO } from './DTOs/createServicio.dto';
import { UpdateServicioDTO } from './DTOs/updateServicio.dto';
import { ServicioEntity } from './servicio.entity';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { ServiciosInsumosEntity } from './servicios-insumos.entity';
import { CreateServiciosInsumosDTO } from './DTOs/createServicioInsumo.dto';
import { UpdateServiceCatalogsDTO } from './DTOs/updateServiceCatalogs.dto';
import { PxlabService } from '@sanfrancisco/pxlab/pxlab.service';
export declare class ServiciosService {
    private readonly pxService;
    private logger;
    constructor(pxService: PxlabService);
    create(servicio: CreateServicioDTO): Promise<ServicioEntity>;
    getById(id: number): Promise<ServicioEntity>;
    update(id: number, data: UpdateServicioDTO): Promise<UpdateResult>;
    updateServiceCatalogs(id: number, catalogs: UpdateServiceCatalogsDTO): Promise<UpdateResult>;
    delete(id: number): Promise<DeleteResult>;
    paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    agregarInsumo(idServicio: number, insumosToAdd: CreateServiciosInsumosDTO): Promise<ServiciosInsumosEntity>;
    quitarInsumo(servicioInsumoId: number): Promise<DeleteResult>;
    InsumoByServicio(servicioId: number): Promise<ServiciosInsumosEntity>;
    paginateServicioInsumo(idServicio: number, options: PaginationOptions): Promise<any>;
    importarServiciosXLS(xlsFile: string): Promise<any>;
}
