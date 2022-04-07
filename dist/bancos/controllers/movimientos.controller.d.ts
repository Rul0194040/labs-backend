import { UpdateMovimientoDTO } from './../../almacen/DTOs/update-movimiento.dto';
import { BancosService } from './../bancos.service';
import { MovimientoCuentaBanco } from './../entities/movimientos-bancos.entity';
import { CreateMovBancarioDTO } from './../dto/create-mov-bancario.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { UpdateResult, DeleteResult } from 'typeorm';
export declare class MovimientosController {
    private readonly bancoService;
    constructor(bancoService: BancosService);
    create(movimiento: CreateMovBancarioDTO): Promise<MovimientoCuentaBanco>;
    paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    getById(id: number): Promise<MovimientoCuentaBanco>;
    update(id: number, mov: UpdateMovimientoDTO): Promise<UpdateResult>;
    delete(id: number): Promise<DeleteResult>;
}
