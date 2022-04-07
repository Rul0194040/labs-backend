import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PaginationOptions } from '../common/DTO/paginationPrimeNg.dto';
import { ReportesService } from './reportes.service';
import { JwtAuthGuard } from '../auth/guards/jwt/jwt-auth.guard';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { Response } from 'express';
import { ReportesVentasService } from './reportes-ventas.service';

@Controller('reportes')
@UseGuards(JwtAuthGuard)
export class ReportesController {
  constructor(
    private readonly reportesService: ReportesService,
    private readonly reportesVentasService: ReportesVentasService,
  ) {}

  /**
   * datos de ventas
   *
   * @param options opciones de paginacion
   * @returns {PaginationPrimeNgResult}
   */
  @Post('ventas')
  reporteVentas(
    @Body() options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    return this.reportesService.reporteVentas(options);
  }

  /**
   * datos de adeudos
   *
   * @param options opciones de paginacion
   * @returns {PaginationPrimeNgResult}
   */
  @Post('ventas/adeudos')
  reporteAdeudos(
    @Body() options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    return this.reportesService.reporteVentasAdeudos(options);
  }

  /**
   * regresa el reporte de ventas
   * @param filter
   * @param res
   */
  @Get('ventas-xls/:filter')
  async filtroMovimientos(
    @Param('filter') filter: string,
    @Res() res: Response,
  ) {
    const buffer = await this.reportesService.getVentasXLS(filter);
    const outputFileName = 'ventas.xlsx';
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=' + outputFileName,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  /**
   * Regresa el reporte de insumos por sucursal
   * @param sucursalId
   * @param res
   */
  @Get('insumos-xls/:sucursalId')
  async filtroInsumos(
    @Param('sucursalId') sucursalId: number,
    @Res() res: Response,
  ) {
    const buffer = await this.reportesService.getInsumosBySucursalXLS(
      sucursalId,
    );
    const outputFileName = 'insumos.xlsx';
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=' + outputFileName,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  /**
   * regresa un reporte de los detalles de un movimiento
   * @param movimientoId
   * @param res
   */
  @Get('movimiento-xls/:movimientoId')
  async filtromovimiento(
    @Param('movimientoId') movimientoId: number,
    @Res() res: Response,
  ) {
    const buffer = await this.reportesService.getMovimientoXLS(movimientoId);
    const outputFileName = 'insumos.xlsx';
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=' + outputFileName,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }
  //get front
  @Post('servicios-ventas/sucursal/:sucursalId')
  ReportesVentasService(
    @Param('sucursalId') sucursalId: number,
    @Body() options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    return this.reportesVentasService.getServiciosVentas(options, sucursalId);
  }
  //xsl
  @Get('servicios-ventas/sucursal/:sucursalId/:filter')
  async serviciosVentasXLS(
    @Param('sucursalId') sucursalId: number,
    @Param('filter') filter: string,
    @Res() res: Response,
  ) {
    const buffer = await this.reportesVentasService.serviciosVentasXLS(
      filter,
      sucursalId,
    );
    const outputFileName = 'servicios-ventas.xlsx';
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=' + outputFileName,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  /**
   * regresa las ventas de una sucursal en un periodo especifico en json
   * @param inicio
   * @param fin
   * @returns
   */
  @Get('ventas-sucursales-periodo/:inicio/:fin/json')
  reporte(@Param('inicio') inicio: string, @Param('fin') fin: string) {
    return this.reportesVentasService.reporteVentasPeriodoJson(inicio, fin);
  }

  /**
   * ventas de sucursales de un periodo especifico en una xls
   * @param inicio
   * @param fin
   * @param res
   */
  @Get('ventas-sucursales-periodo/:inicio/:fin/xls')
  async reporteXls(
    @Param('inicio') inicio: string,
    @Param('fin') fin: string,
    @Res() res: Response,
  ) {
    const buffer = await this.reportesVentasService.reporteVentasPeriodoXls(
      inicio,
      fin,
    );
    const outputFileName = 'reporte_ventas.xlsx';
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=' + outputFileName,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  /**
   * Regresa el reporte de ingresos por sucursal
   * @param sucursalId
   * @param res
   */
  @Get('ingresos-xls/:sucursalId/:filter')
  async filtroIngresos(
    @Param('sucursalId') sucursalId: number,
    @Param('filter') filter: string,
    @Res() res: Response,
  ) {
    const buffer = await this.reportesVentasService.getIngresosBySucursalXLS(
      filter,
      sucursalId,
    );
    const outputFileName = 'insumos.xlsx';
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=' + outputFileName,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  /**
   * Pagina los ingresos por sucursal
   *
   * @tests ['Paginar sucursales']
   * @param options Opciones de paginacion
   * @returns sucursales paginadas
   */
  @Post('paginate/ingresos/:sucursalId')
  paginateIngresos(
    @Body() options: PaginationOptions,
    @Param('sucursalId') sucursalId: number,
  ): Promise<any> {
    return this.reportesVentasService.paginateIngresos(options, sucursalId);
  }

  /**
   * Pagina los ingresos por sucursal
   *
   * @tests ['Paginar sucursales']
   * @param options Opciones de paginacion
   * @returns sucursales paginadas
   */
  @Post('paginate/ventas/:sucursalId')
  paginateVentasBySucursal(
    @Body() options: PaginationOptions,
    @Param('sucursalId') sucursalId: number,
  ): Promise<any> {
    return this.reportesVentasService.paginateVentasBySucursal(
      options,
      sucursalId,
    );
  }

  /**
   * Regresa el reporte de ingresos por sucursal
   * @param sucursalId
   * @param res
   */
  @Get('ventas-xls/:sucursalId/:filter')
  async filtroVentasBySucursal(
    @Param('sucursalId') sucursalId: number,
    @Param('filter') filter: string,
    @Res() res: Response,
  ) {
    const buffer = await this.reportesVentasService.getVentasBySucursalXLS(
      filter,
      sucursalId,
    );
    const outputFileName = 'insumos.xlsx';
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=' + outputFileName,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }
}
