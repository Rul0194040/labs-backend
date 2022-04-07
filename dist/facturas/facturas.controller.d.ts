import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { UpdateResult, DeleteResult } from 'typeorm';
import { DatosFacturaDTO } from './dto/datos-factura.dto';
import { FacturaEntity } from './facturas.entity';
import { FacturasService } from './facturas.service';
import { UpdateFacturaDTO } from './dto/update-factura.dto';
export declare class FacturasController {
    private readonly facturaService;
    constructor(facturaService: FacturasService);
    create(factura: DatosFacturaDTO): Promise<FacturaEntity>;
    paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
    getById(id: number): Promise<FacturaEntity>;
    update(id: number, factura: UpdateFacturaDTO): Promise<UpdateResult>;
    delete(id: number): Promise<DeleteResult>;
}
