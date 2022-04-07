import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { UpdateResult, DeleteResult } from 'typeorm';
import { DatosFacturaDTO } from './dto/datos-factura.dto';
import { FacturaEntity } from './facturas.entity';
import { UpdateFacturaDTO } from './dto/update-factura.dto';
export declare class FacturasService {
    private readonly notFoundMessage;
    create(factura: DatosFacturaDTO): Promise<FacturaEntity>;
    getById(id: number): Promise<FacturaEntity>;
    update(id: number, factura: UpdateFacturaDTO): Promise<UpdateResult>;
    delete(id: number): Promise<DeleteResult>;
    paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
}
