import { DocumentoEntity } from './entity/documento.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { DocumentosService } from './documentos.service';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { UpdateResult, DeleteResult } from 'typeorm';
import { CreateDocumentoDto } from './Dtos/create-documento.dto';
import { UpdateDocumentoDto } from './Dtos/update-documento.dto';

@Controller('documemntos')
export class DocumentosController {
  constructor(private readonly documentoService: DocumentosService) {}

  @Post()
  create(@Body() documento: CreateDocumentoDto): Promise<DocumentoEntity> {
    return this.documentoService.create(documento);
  }

  /**
   * Pagina los insumos
   *
   * @tests []
   * @param options Opciones de paginacion
   * @returns insumos paginados
   */
  @Post('paginate')
  paginate(
    @Body() options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    return this.documentoService.paginate(options);
  }

  /**
   * Busca un un objeto documento por id
   * @tests []
   * @param id del objeto documento buscado
   * @returns documento creado
   */
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number): Promise<DocumentoEntity> {
    return this.documentoService.getById(id);
  }
  /**
   * Actualiza un objeto por id
   * @tests []
   * @param id del objeto a actualizar
   * @returns el objeto actualizado
   */
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() documento: UpdateDocumentoDto,
  ): Promise<UpdateResult> {
    return this.documentoService.update(id, documento);
  }

  /**
   * Borrar un objeto documento
   * @tests []
   * @param id del objeto a borrar
   * @returns delete result, afectando un objeto
   */
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.documentoService.delete(id);
  }
}
