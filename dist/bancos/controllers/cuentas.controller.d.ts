import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { UpdateResult, DeleteResult } from 'typeorm';
import { BancosService } from '../bancos.service';
import { CreateCuentaDto } from '../dto/create-cuenta.dto';
import { UpdateCuentaDto } from '../dto/update-cuenta.dto';
import { CuentaBancariaEntity } from './../entities/cuenta-bancaria.entity';
export declare class CuentasController {
    private readonly bancoService;
    constructor(bancoService: BancosService);
    create(cuenta: CreateCuentaDto): Promise<CuentaBancariaEntity>;
    paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    getById(id: number): Promise<CuentaBancariaEntity>;
    update(id: number, cuenta: UpdateCuentaDto): Promise<UpdateResult>;
    delete(id: number): Promise<DeleteResult>;
}
