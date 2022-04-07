import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateTipoCuentaGastoDTO } from '../dto/create-tipo-cuenta-gasto.dto';
import { UpdateTipoCuentaGastoDTO } from '../dto/update-tipo-cuenta-gasto.dto';
import { TipoCuentaGastoEntity } from '../entities/tipos-cuenta-gasto.entity';
import { BancosService } from '../bancos.service';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
export declare class TiposCuentasGastoController {
    private readonly bancosService;
    constructor(bancosService: BancosService);
    crearTipoCuentaGasto(tipoCuentaGasto: CreateTipoCuentaGastoDTO): Promise<TipoCuentaGastoEntity>;
    paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    getById(id: number): Promise<TipoCuentaGastoEntity>;
    actualizarTipoCuentaGasto(id: number, tipoCuentaGastos: UpdateTipoCuentaGastoDTO): Promise<UpdateResult>;
    deleteEmpleado(cuentaG: number): Promise<DeleteResult>;
}
