import { CreateMedicoDto } from './DTO/create-medico.dto';
import { UpdateMedicoDto } from './DTO/update-medico.dto';
import { DeleteResult } from 'typeorm';
import { MedicoEntity } from './medico.entity';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
export declare class MedicosService {
    create(createMedicoDto: CreateMedicoDto): Promise<MedicoEntity>;
    getById(id: number): Promise<MedicoEntity>;
    update(id: number, updateMedicoDto: UpdateMedicoDto): Promise<MedicoEntity>;
    delete(id: number): Promise<DeleteResult>;
    paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
}
