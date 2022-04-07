import { CreateIncentivoDTO } from './DTOs/create-incentivo.dto';
import { UpdateResult } from 'typeorm';
import { IncentivoEntity } from './entity/incentivos.entity';
import { UpdateIncentivosDTO } from './DTOs/update-incentivo.dto';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
export declare class IncentivosService {
    crearIncentivo(incentivo: CreateIncentivoDTO): Promise<IncentivoEntity>;
    actualizarIncentivo(incentivoId: number, incentivo: UpdateIncentivosDTO): Promise<UpdateResult>;
    getbyInsentivo(incentivoId: number): Promise<IncentivoEntity>;
    paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
}
