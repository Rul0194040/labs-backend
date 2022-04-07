import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { BancosService } from '../bancos.service';
import { CreateBancoDto } from '../dto/create-banco.dto';
import { UpdateBancoDto } from '../dto/update-banco.dto';
import { BancoEntity } from '../entities/banco.entity';
export declare class BancosController {
    private readonly bancoService;
    constructor(bancoService: BancosService);
    create(banco: CreateBancoDto): Promise<BancoEntity>;
    paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    getById(id: number): Promise<BancoEntity>;
    update(id: number, banco: UpdateBancoDto): Promise<UpdateResult>;
    delete(id: number): Promise<DeleteResult>;
}
