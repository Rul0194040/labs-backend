import { CreateIncentivoDTO } from './DTOs/create-incentivo.dto';
import { IncentivosService } from './incentivos.service';
import { IncentivoEntity } from './entity/incentivos.entity';
import { UpdateIncentivosDTO } from './DTOs/update-incentivo.dto';
import { UpdateResult } from 'typeorm';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
export declare class IncentivosController {
    private readonly incentivosService;
    constructor(incentivosService: IncentivosService);
    crearIncentivo(incentivo: CreateIncentivoDTO): Promise<IncentivoEntity>;
    getbyIncentivo(incentivoId: number): Promise<IncentivoEntity>;
    actualizarIncentivo(incentivoId: number, incentivo: UpdateIncentivosDTO): Promise<UpdateResult>;
    paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
}
