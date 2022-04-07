import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { RequireRule } from '@sanfrancisco/users/decorators/require-rule.decorator';
import { UpdateResult, DeleteResult } from 'typeorm';
import { DatosFacturaDTO } from './dto/datos-factura.dto';
import { FacturaEntity } from './facturas.entity';
import { FacturasService } from './facturas.service';
import { UpdateFacturaDTO } from './dto/update-factura.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@sanfrancisco/auth/guards/jwt/jwt-auth.guard';

@ApiTags('facturas')
@UseGuards(JwtAuthGuard)
@Controller('facturas')
export class FacturasController {
  constructor(private readonly facturaService: FacturasService) {}

  @Post()
  @RequireRule('create:factura')
  create(@Body() factura: DatosFacturaDTO): Promise<FacturaEntity> {
    return this.facturaService.create(factura);
  }

  @Post('paginate')
  @RequireRule('view:facturas')
  paginate(
    @Body() options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    return this.facturaService.paginate(options);
  }

  @Get(':id')
  @RequireRule('view:facturas')
  getById(@Param('id', ParseIntPipe) id: number): Promise<FacturaEntity> {
    return this.facturaService.getById(id);
  }
  @Put(':id')
  @RequireRule('update:facturas')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() factura: UpdateFacturaDTO,
  ): Promise<UpdateResult> {
    return this.facturaService.update(id, factura);
  }

  // @Get(':ventaId/solicitud')
  // @RequireRule('update:facturas')
  // updateStatus(
  //   @Param('ventaId', ParseIntPipe) ventaId: number,
  //   @Body() solicitud: SolicitudFacturaDTO,
  // ): Promise<UpdateResult> {
  //   return this.facturaService.solicitarFactura(ventaId, solicitud);
  // }
  //TODO api controller publica para buscar la factua del cliente

  @Delete(':id')
  @RequireRule('delete:facturas')
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.facturaService.delete(id);
  }
}
