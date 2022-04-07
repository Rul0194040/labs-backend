import { MedicosService } from './medicos.service';
import { CreateMedicoDto } from './DTO/create-medico.dto';
import { UpdateMedicoDto } from './DTO/update-medico.dto';
import { MedicoEntity } from './medico.entity';
import { DeleteResult } from 'typeorm';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
export declare class MedicosController {
    private readonly medicosService;
    constructor(medicosService: MedicosService);
    create(createMedicoDto: CreateMedicoDto): Promise<MedicoEntity>;
    getById(id: number): Promise<MedicoEntity>;
    update(id: number, updateMedicoDto: UpdateMedicoDto): Promise<MedicoEntity>;
    delete(id: number): Promise<DeleteResult>;
    paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
}
