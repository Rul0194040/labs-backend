import { SucursalesService } from './services/sucursales.service';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
export declare class SucursalesPublicController {
    private readonly sucursalesService;
    constructor(sucursalesService: SucursalesService);
    paginate(options: PaginationOptions): Promise<any>;
}
