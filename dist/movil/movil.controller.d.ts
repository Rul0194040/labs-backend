import { SucursalesInsumosService } from '../sucursales/services/sucursalesInsumos.service';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { MovilService } from './movil.service';
import { CajaEntity } from '@sanfrancisco/cajas/cajas.entity';
import { CajasService } from '@sanfrancisco/cajas/cajas.service';
export declare class MovilController {
    private readonly sucursalesInsumosService;
    private readonly movilService;
    private readonly cajasService;
    constructor(sucursalesInsumosService: SucursalesInsumosService, movilService: MovilService, cajasService: CajasService);
    getById(id: number): Promise<CajaEntity>;
    paginateInsumosBySucursal(idSucursal: number, options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    obtenerCajasActivas(): Promise<CajaEntity[]>;
}
