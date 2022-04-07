import { DocumentoEntity } from './entity/documento.entity';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { UpdateResult, DeleteResult } from 'typeorm';
import { CreateDocumentoDto } from './Dtos/create-documento.dto';
import { UpdateDocumentoDto } from './Dtos/update-documento.dto';
export declare class DocumentosService {
    create(documento: CreateDocumentoDto): Promise<DocumentoEntity>;
    getById(id: number): Promise<DocumentoEntity>;
    update(id: number, documento: UpdateDocumentoDto): Promise<UpdateResult>;
    delete(id: number): Promise<DeleteResult>;
    paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult>;
}
