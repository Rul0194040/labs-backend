import { VentaEntity } from '@sanfrancisco/ventas/ventas.entity';
import { PagoEntity } from '@sanfrancisco/pagos/pagos.entity';
import { Injectable } from '@nestjs/common';
import { getConnectionManager, getRepository } from 'typeorm';
import * as moment from 'moment';
import { forIn } from 'lodash';
import { buildExport } from 'node-excel-export';
import { DetalleVentasEntity } from '@sanfrancisco/ventas/ventasDetalle.entity';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
@Injectable()
export class ReportesVentasService {
  async getServiciosVentas(
    options: PaginationOptions,
    sucursalId: number,
  ): Promise<PaginationPrimeNgResult> {
    // TODO: limpiar campos necesarios
    const detVentaQuery = getRepository(DetalleVentasEntity)
      .createQueryBuilder('detVenta')
      .leftJoin('detVenta.venta', 'venta')
      .leftJoin('venta.paciente', 'paciente')
      .leftJoin('venta.cliente', 'cliente')
      .leftJoin('venta.medico', 'medico')
      .leftJoin('detVenta.servicio', 'servicio')
      .select([
        'detVenta',
        'venta.id',
        'venta.folio',
        'venta.fecha',
        'venta.estatus',
        'venta.descuentoPesos',
        'venta.descuento',
        'venta.total',
        'venta.saldo',
        'venta.credito',
        'venta.sucursalId',
        'cliente.id',
        'cliente.nombre',
        'paciente.id',
        'paciente.nombre',
        'paciente.apellidoPaterno',
        'paciente.apellidoMaterno',
        'medico.id',
        'medico.nombre',
        'servicio.id',
        'servicio.clave',
        'servicio.nombre',
        'servicio.realizaEstudioEn',
      ])
      .where('venta.sucursalId =:sucursalId', { sucursalId: sucursalId });

    forIn(options.filters, (value, key) => {
      switch (key) {
        case 'fecha':
          const inicio = moment(value).format('YYYY-MM-DD 00:00:00');
          const fin = moment(value).format('YYYY-MM-DD 23:59:59');
          detVentaQuery.andWhere(
            'detVenta.createdAt BETWEEN :inicio AND :fin',
            {
              inicio,
              fin,
            },
          );
          break;
        case 'realizaEstudioEn':
          detVentaQuery.andWhere('servicio.realizaEstudioEn like :term', {
            term: `%${value.split(' ').join('%')}%`,
          });
          break;
        default:
          break;
      }
    });

    const count = await detVentaQuery.getCount();

    const data = await detVentaQuery
      .skip(options.skip)
      .take(options.take)
      .orderBy(options.sort, 'DESC')
      .getMany();

    return {
      data: data,
      skip: options.skip,
      totalItems: count,
    };
  }
  async serviciosVentasXLS(
    filter: string,
    sucursalId: number,
  ): Promise<Uint8Array> {
    const filters = JSON.parse(filter);
    const detVentaQuery = getRepository(DetalleVentasEntity)
      .createQueryBuilder('detVenta')
      .leftJoin('detVenta.venta', 'venta')
      .leftJoin('venta.paciente', 'paciente')
      .leftJoin('venta.cliente', 'cliente')
      .leftJoin('venta.medico', 'medico')
      .leftJoin('detVenta.servicio', 'servicio')
      .select([
        'detVenta',
        'venta.id',
        'venta.folio',
        'venta.fecha',
        'venta.estatus',
        'venta.descuentoPesos',
        'venta.descuento',
        'venta.total',
        'venta.saldo',
        'venta.credito',
        'cliente.id',
        'cliente.nombre',
        'paciente.id',
        'paciente.nombre',
        'paciente.apellidoPaterno',
        'paciente.apellidoMaterno',
        'medico.id',
        'medico.nombre',
        'servicio.id',
        'servicio.clave',
        'servicio.nombre',
      ])
      .where('venta.sucursalId =:sucursalId', { sucursalId: sucursalId });
    forIn(filters, (value, key) => {
      switch (key) {
        case 'fecha':
          const inicio = moment(value).format('YYYY-MM-DD 00:00:00');
          const fin = moment(value).format('YYYY-MM-DD 23:59:59');
          detVentaQuery.andWhere(
            'detVenta.createdAt BETWEEN :inicio AND :fin',
            {
              inicio,
              fin,
            },
          );
          break;
        case 'realizaEstudioEn':
          detVentaQuery.andWhere(
            'servicio.realizaEstudioEn :realizaEstudioEn',
            {
              realizaEstudioEn: value,
            },
          );
          break;
        default:
          break;
      }
    });
    const data = await detVentaQuery.getMany();

    const result = [];
    for (let i = 0; i < data.length; i++) {
      const obj = {
        folio: data[i].venta.folio,
        clave: data[i].servicio.clave,
        servicio: data[i].servicio.nombre,
        precio: data[i].precio,
        paciente: !data[i].venta.paciente
          ? ''
          : `${data[i].venta.paciente.nombre} ${data[i].venta.paciente.apellidoPaterno} ${data[i].venta.paciente.apellidoMaterno}`,
        cliente: data[i].venta.cliente ? data[i].venta.cliente.nombre : '',
        medico: !data[i].venta.medico ? '' : `${data[i].venta.medico.nombre}`,
      };
      result.push(obj);
    }
    const styles = {
      header: {
        font: { color: { rgb: 'FF000000' }, sz: 15, bold: true },
        alignment: { horizontal: 'center' },
        height: 80,
        with: 400,
      },
      header2: {
        font: { color: { rgb: 'FF000000' }, sz: 10, bold: true },
        alignment: { horizontal: 'center' },
      },
      header3: {
        font: { color: { rgb: 'FF000000' }, sz: 8, bold: true },
        alignment: { horizontal: 'center' },
      },
      cellHeader: {
        font: {
          color: { rgb: 'FF000000' },
          sz: 10,
          bold: true,
        },
        alignment: { horizontal: 'center' },
      },
      cell: { alignment: { horizontal: 'left' }, font: { sz: 10 } },
      cellCenter: {
        alignment: { horizontal: 'center' },
        font: { sz: 10 },
      },
      cellNumber: {
        alignment: { horizontal: 'right' },
        font: { sz: 10 },
      },
      cellRight: {
        alignment: { horizontal: 'right' },
        font: { sz: 10 },
      },
    };

    const heading = [
      [{ value: 'Laboratorio San Francisco', style: styles.header }],
      [
        {
          value: `Reporte de Servicios en ventas`,
          style: styles.header2,
        },
      ],
    ];

    const specification = {
      folio: {
        displayName: 'Folio Venta',
        headerStyle: styles.cellHeader,
        cellStyle: styles.cellCenter,
        width: 100,
      },
      clave: {
        displayName: 'Clave',
        headerStyle: styles.cellHeader,
        cellStyle: styles.cellCenter,
        width: 100,
      },
      servicio: {
        displayName: 'Servicio',
        headerStyle: styles.cellHeader,
        cellStyle: styles.cell,
        width: 200,
      },
      precio: {
        displayName: 'Precio',
        headerStyle: styles.cellHeader,
        cellStyle: styles.cellRight,
        width: 100,
      },

      paciente: {
        displayName: 'Paciente',
        headerStyle: styles.cellHeader,
        cellStyle: styles.cell,
        width: 200,
      },

      cliente: {
        displayName: 'Cliente',
        headerStyle: styles.cellHeader,
        cellStyle: styles.cell,
        width: 150,
      },
      medico: {
        displayName: 'Médico',
        headerStyle: styles.cellHeader,
        cellStyle: styles.cell,
        width: 150,
      },
    };

    const merges = [
      { start: { row: 1, column: 1 }, end: { row: 1, column: 5 } },
      { start: { row: 2, column: 1 }, end: { row: 2, column: 5 } },
    ];

    const report = buildExport([
      {
        name: 'Reporte de Servicios en Ventas',
        heading: heading,
        merges: merges,
        specification: specification,
        data: result,
      },
    ]);

    return report;
  }

  /**
   * Paginar pagos por sucursal
   * @param options para paginar los registros
   */
  async paginateIngresos(
    options: PaginationOptions,
    sucursalId: number,
  ): Promise<PaginationPrimeNgResult> {
    const dataQuery = getRepository(PagoEntity)
      .createQueryBuilder('pago')
      .leftJoin('pago.venta', 'venta')
      .leftJoin('venta.sucursal', 'sucursal')
      .leftJoin('venta.paciente', 'paciente')
      .leftJoin('venta.cliente', 'cliente')
      .select([
        'pago.id',
        'pago.referencia',
        'pago.fecha',
        'pago.monto',
        'pago.tipo',
        'venta.id',
        'venta.fecha',
        'venta.folio',
        'venta.descuento',
        'venta.total',
        'venta.saldo',
        'venta.estatus',
        'cliente.id',
        'cliente.nombre',
        'paciente.nombre',
        'paciente.apellidoPaterno',
        'paciente.apellidoMaterno',
        'sucursal.nombre',
      ])
      .where('sucursal.id =:sucursalId', { sucursalId });

    forIn(options.filters, (value, key) => {
      if (key === 'fecha') {
        const inicio = moment(value).format('YYYY-MM-DD 00:00:00');
        const fin = moment(value).format('YYYY-MM-DD 23:59:59');
        dataQuery.andWhere('venta.fecha BETWEEN :inicio AND :fin', {
          inicio,
          fin,
        });
      }
    });

    const count = await dataQuery.getCount();

    if (options.sort === undefined) {
      options.sort = 'id';
    }

    let direction: 'ASC' | 'DESC' = 'ASC';

    if (options.direction) {
      direction = options.direction;
    }

    const data = await dataQuery
      .skip(options.skip)
      .take(options.take)
      .orderBy(options.sort, direction)
      .getMany();

    return {
      data: data,
      skip: options.skip,
      totalItems: count,
    };
  }

  async getIngresosBySucursalXLS(
    filter: string,
    sucursalId: number,
  ): Promise<Uint8Array> {
    const filters = JSON.parse(filter);
    const detVentaQuery = getRepository(PagoEntity)
      .createQueryBuilder('pago')
      .leftJoin('pago.venta', 'venta')
      .leftJoin('venta.sucursal', 'sucursal')
      .leftJoin('venta.paciente', 'paciente')
      .leftJoin('venta.cliente', 'cliente')
      .select([
        'pago.id',
        'pago.referencia',
        'pago.fecha',
        'pago.monto',
        'pago.tipo',
        'venta.id',
        'venta.fecha',
        'venta.folio',
        'venta.descuento',
        'venta.total',
        'venta.saldo',
        'venta.estatus',
        'cliente.id',
        'cliente.nombre',
        'paciente.id',
        'paciente.nombre',
        'paciente.apellidoPaterno',
        'paciente.apellidoMaterno',
        'sucursal.id',
        'sucursal.nombre',
      ])
      .where('sucursal.id =:sucursalId', { sucursalId });
    forIn(filters, (value, key) => {
      switch (key) {
        case 'fecha':
          const inicio = moment(value).format('YYYY-MM-DD 00:00:00');
          const fin = moment(value).format('YYYY-MM-DD 23:59:59');
          detVentaQuery.andWhere('venta.fecha BETWEEN :inicio AND :fin', {
            inicio,
            fin,
          });
          break;
        default:
          break;
      }
    });
    const data = await detVentaQuery.getMany();

    const inversoVentas = {
      B: 'BORRADOR',
      P: 'EN_PROCESO',
      A: 'AUTORIZADA',
      F: 'FINALIZADA',
      C: 'CANCELADA',
    };

    const result = [];
    for (let i = 0; i < data.length; i++) {
      const obj = {
        folio: data[i].venta.folio ? data[i].venta.folio : '',
        fecha: data[i].fecha ? data[i].fecha : '',
        sucursal: data[i].venta.sucursal ? data[i].venta.sucursal.nombre : '',
        paciente: data[i].venta.paciente
          ? `${data[i].venta.paciente.nombre} ${data[i].venta.paciente.apellidoPaterno} ${data[i].venta.paciente.apellidoMaterno}`
          : '',
        tipo: data[i].tipo ? data[i].tipo : '',
        referencia: data[i].referencia ? data[i].referencia : '',
        monto: data[i].monto ? data[i].monto : '',
        estatus: data[i].venta.estatus
          ? inversoVentas[data[i].venta.estatus]
          : '',
      };
      result.push(obj);
    }
    const styles = {
      header: {
        font: { color: { rgb: 'FF000000' }, sz: 15, bold: true },
        alignment: { horizontal: 'center' },
        height: 80,
        with: 400,
      },
      header2: {
        font: { color: { rgb: 'FF000000' }, sz: 10, bold: true },
        alignment: { horizontal: 'center' },
      },
      header3: {
        font: { color: { rgb: 'FF000000' }, sz: 8, bold: true },
        alignment: { horizontal: 'center' },
      },
      cellHeader: {
        font: {
          color: { rgb: 'FF000000' },
          sz: 10,
          bold: true,
        },
        alignment: { horizontal: 'center' },
      },
      cell: { alignment: { horizontal: 'left' }, font: { sz: 10 } },
      cellCenter: {
        alignment: { horizontal: 'center' },
        font: { sz: 10 },
      },
      cellNumber: {
        alignment: { horizontal: 'right' },
        font: { sz: 10 },
      },
      cellRight: {
        alignment: { horizontal: 'right' },
        font: { sz: 10 },
      },
    };

    const heading = [
      [{ value: 'Laboratorio San Francisco', style: styles.header }],
      [
        {
          value: `Reporte de ingresos por sucursal`,
          style: styles.header2,
        },
      ],
    ];

    const specification = {
      folio: {
        displayName: 'Folio Venta',
        headerStyle: styles.cellHeader,
        cellStyle: styles.cellCenter,
        width: 100,
      },
      fecha: {
        displayName: 'Fecha Venta',
        headerStyle: styles.cellHeader,
        cellStyle: styles.cellCenter,
        width: 100,
      },
      sucursal: {
        displayName: 'Sucursal Vendedora',
        headerStyle: styles.cellHeader,
        cellStyle: styles.cellCenter,
        width: 100,
      },
      paciente: {
        displayName: 'Paciente',
        headerStyle: styles.cellHeader,
        cellStyle: styles.cell,
        width: 150,
      },
      tipo: {
        displayName: 'Tipo Pago',
        headerStyle: styles.cellHeader,
        cellStyle: styles.cell,
        width: 100,
      },
      referencia: {
        displayName: 'Referencia',
        headerStyle: styles.cellHeader,
        cellStyle: styles.cell,
        width: 100,
      },
      monto: {
        displayName: 'Monto',
        headerStyle: styles.cellHeader,
        cellStyle: styles.cellRight,
        width: 100,
      },
      estatus: {
        displayName: 'Estatus',
        headerStyle: styles.cellHeader,
        cellStyle: styles.cell,
        width: 150,
      },
    };

    const merges = [
      { start: { row: 1, column: 1 }, end: { row: 1, column: 8 } },
      { start: { row: 2, column: 1 }, end: { row: 2, column: 8 } },
    ];

    const report = buildExport([
      {
        name: 'Reporte de Ingresos por Sucursal',
        heading: heading,
        merges: merges,
        specification: specification,
        data: result,
      },
    ]);

    return report;
  }

  /**
   * Paginar pagos por sucursal
   * @param options para paginar los registros
   */
  async paginateVentasBySucursal(
    options: PaginationOptions,
    sucursalId: number,
  ): Promise<PaginationPrimeNgResult> {
    const dataQuery = getRepository(VentaEntity)
      .createQueryBuilder('venta')
      .leftJoin('venta.sucursal', 'sucursal')
      .leftJoin('venta.caja', 'caja')
      .leftJoin('venta.paciente', 'paciente')
      .leftJoin('venta.cliente', 'cliente')
      .select([
        'venta.id',
        'venta.fecha',
        'venta.folio',
        'venta.descuento',
        'venta.total',
        'venta.saldo',
        'venta.estatus',
        'venta.descuentoPesos',
        'cliente.id',
        'cliente.nombre',
        'paciente.nombre',
        'paciente.apellidoPaterno',
        'paciente.apellidoMaterno',
      ])
      .where('sucursal.id =:sucursalId', { sucursalId });

    forIn(options.filters, (value, key) => {
      if (key === 'fecha') {
        const inicio = moment(value).format('YYYY-MM-DD 00:00:00');
        const fin = moment(value).format('YYYY-MM-DD 23:59:59');
        dataQuery.andWhere('venta.fecha BETWEEN :inicio AND :fin', {
          inicio,
          fin,
        });
      }
    });

    const count = await dataQuery.getCount();

    if (options.sort === undefined) {
      options.sort = 'id';
    }

    let direction: 'ASC' | 'DESC' = 'ASC';

    if (options.direction) {
      direction = options.direction;
    }

    const data = await dataQuery
      .skip(options.skip)
      .take(options.take)
      .orderBy(options.sort, direction)
      .getMany();

    return {
      data: data,
      skip: options.skip,
      totalItems: count,
    };
  }

  async getVentasBySucursalXLS(
    filter: string,
    sucursalId: number,
  ): Promise<Uint8Array> {
    const filters = JSON.parse(filter);
    const detVentaQuery = getRepository(VentaEntity)
      .createQueryBuilder('venta')
      .leftJoin('venta.sucursal', 'sucursal')
      .leftJoin('venta.paciente', 'paciente')
      .leftJoin('venta.cliente', 'cliente')
      .select([
        'venta.id',
        'venta.fecha',
        'venta.folio',
        'venta.descuento',
        'venta.total',
        'venta.saldo',
        'venta.estatus',
        'venta.descuentoPesos',
        'cliente.id',
        'cliente.nombre',
        'paciente.id',
        'paciente.nombre',
        'paciente.apellidoPaterno',
        'paciente.apellidoMaterno',
      ])
      .where('sucursal.id =:sucursalId', { sucursalId });
    forIn(filters, (value, key) => {
      switch (key) {
        case 'fecha':
          const inicio = moment(value).format('YYYY-MM-DD 00:00:00');
          const fin = moment(value).format('YYYY-MM-DD 23:59:59');
          detVentaQuery.andWhere('venta.fecha BETWEEN :inicio AND :fin', {
            inicio,
            fin,
          });
          break;
        default:
          break;
      }
    });
    const data = await detVentaQuery.getMany();

    const result = [];
    const inversoVentas = {
      B: 'BORRADOR',
      P: 'EN_PROCESO',
      A: 'AUTORIZADA',
      F: 'FINALIZADA',
      C: 'CANCELADA',
    };

    for (let i = 0; i < data.length; i++) {
      const obj = {
        folio: data[i].folio ? data[i].folio : '',
        fecha: data[i].fecha ? data[i].fecha : '',
        paciente: data[i].paciente
          ? `${data[i].paciente.nombre} ${data[i].paciente.apellidoPaterno} ${data[i].paciente.apellidoMaterno}`
          : '',
        cliente: data[i].cliente ? data[i].cliente.nombre : '',
        subtotal: data[i].total + data[i].descuentoPesos,
        descuento: data[i].descuento ? `${data[i].descuento}%` : '0%',
        descuentoPesos: data[i].descuentoPesos,
        total: data[i].total,
        saldo: data[i].saldo,
        estatus: data[i].estatus ? inversoVentas[data[i].estatus] : '',
      };
      result.push(obj);
    }
    const styles = {
      header: {
        font: { color: { rgb: 'FF000000' }, sz: 15, bold: true },
        alignment: { horizontal: 'center' },
        height: 80,
        with: 400,
      },
      header2: {
        font: { color: { rgb: 'FF000000' }, sz: 10, bold: true },
        alignment: { horizontal: 'center' },
      },
      header3: {
        font: { color: { rgb: 'FF000000' }, sz: 8, bold: true },
        alignment: { horizontal: 'center' },
      },
      cellHeader: {
        font: {
          color: { rgb: 'FF000000' },
          sz: 10,
          bold: true,
        },
        alignment: { horizontal: 'center' },
      },
      cell: { alignment: { horizontal: 'left' }, font: { sz: 10 } },
      cellCenter: {
        alignment: { horizontal: 'center' },
        font: { sz: 10 },
      },
      cellNumber: {
        alignment: { horizontal: 'right' },
        font: { sz: 10 },
      },
      cellRight: {
        alignment: { horizontal: 'right' },
        font: { sz: 10 },
      },
    };

    const heading = [
      [{ value: 'Laboratorio San Francisco', style: styles.header }],
      [
        {
          value: `Reporte Ventas por Sucursal`,
          style: styles.header2,
        },
      ],
    ];

    const specification = {
      folio: {
        displayName: 'Folio Venta',
        headerStyle: styles.cellHeader,
        cellStyle: styles.cellCenter,
        width: 100,
      },
      fecha: {
        displayName: 'Fecha',
        headerStyle: styles.cellHeader,
        cellStyle: styles.cellCenter,
        width: 100,
      },
      paciente: {
        displayName: 'Paciente',
        headerStyle: styles.cellHeader,
        cellStyle: styles.cell,
        width: 150,
      },
      cliente: {
        displayName: 'Cliente',
        headerStyle: styles.cellHeader,
        cellStyle: styles.cell,
        width: 150,
      },
      subtotal: {
        displayName: 'Subtotal',
        headerStyle: styles.cellHeader,
        cellStyle: styles.cellRight,
        width: 100,
      },
      descuento: {
        displayName: 'Descuento',
        headerStyle: styles.cellHeader,
        cellStyle: styles.cellRight,
        width: 150,
      },
      descuentoPesos: {
        displayName: 'Descuento en Pesos',
        headerStyle: styles.cellHeader,
        cellStyle: styles.cellRight,
        width: 100,
      },
      total: {
        displayName: 'Total',
        headerStyle: styles.cellHeader,
        cellStyle: styles.cellRight,
        width: 100,
      },
      saldo: {
        displayName: 'Saldo',
        headerStyle: styles.cellHeader,
        cellStyle: styles.cellRight,
        width: 100,
      },
      estatus: {
        displayName: 'Estatus',
        headerStyle: styles.cellHeader,
        cellStyle: styles.cell,
        width: 100,
      },
    };

    const merges = [
      { start: { row: 1, column: 1 }, end: { row: 1, column: 9 } },
      { start: { row: 2, column: 1 }, end: { row: 2, column: 9 } },
    ];

    const report = buildExport([
      {
        name: 'Reporte de Ventas por Sucursal',
        heading: heading,
        merges: merges,
        specification: specification,
        data: result,
      },
    ]);

    return report;
  }

  async reporteVentasPeriodoJson(inicio: string, fin: string) {
    const result = await getConnectionManager()
      .get()
      .query('CALL CalculoIngresosSucursalesPeriodo(?, ?)', [inicio, fin]);
    return result && result[0] ? result[0] : [];
  }

  async reporteVentasPeriodoXls(
    inicio: string,
    fin: string,
  ): Promise<Uint8Array> {
    const data = await this.reporteVentasPeriodoJson(inicio, fin);
    const title = '';

    const result = [];
    for (let i = 0; i < data.length; i++) {
      const obj = {
        Num: data[i].Num,
        Sucursal: data[i].Sucursal,
        Ingreso: data[i].Ingreso,
        Gastos: data[i].Gastos,
        Voucher: data[i].Voucher,
        Caja: data[i].Caja,
        NumPX: data[i].NumPX,
        Estudios: data[i].Estudios,
      };
      result.push(obj);
    }
    const styles = {
      header: {
        font: { color: { rgb: 'FF000000' }, sz: 15, bold: true },
        alignment: { horizontal: 'center' },
        height: 120,
        with: 400,
      },
      header2: {
        font: { color: { rgb: 'FF000000' }, sz: 10, bold: true },
        height: 80,
        alignment: { horizontal: 'center' },
      },
      header3: {
        font: { color: { rgb: 'FF000000' }, sz: 8, bold: true },
        height: 80,
        alignment: { horizontal: 'center' },
      },
      cellHeader: {
        font: {
          color: { rgb: 'FF000000' },
          sz: 10,
          bold: true,
        },
        alignment: { horizontal: 'center' },
      },
      cell: { alignment: { horizontal: 'left' }, font: { sz: 10 } },
      cellCenter: {
        alignment: { horizontal: 'center' },
        font: { sz: 10 },
      },
      cellNumber: {
        alignment: { horizontal: 'right' },
        font: { sz: 10 },
        numFmt: '[$$-80A]#,##0.00;-[$$-80A]#,##0.00',
      },
      cellNumberTotal: {
        alignment: { horizontal: 'right' },
        font: { sz: 10, bold: true },
        numFmt: '[$$-80A]#,##0.00;-[$$-80A]#,##0.00',
      },
    };

    const heading = [
      [{ value: 'Laboratorio San Francisco', style: styles.header }],
      [
        {
          value: `Reporte de Ventas de Sucursales`,
          style: styles.header2,
        },
      ],
      [
        {
          value: `De: ${moment(inicio).format('DD/MM/YYYY')} a: ${moment(
            fin,
          ).format('DD/MM/YYYY')}`,
          style: styles.header2,
        },
      ],
      [
        {
          value: `${title}`,
          style: styles.header3,
        },
      ],
    ];

    const specification = {
      Num: {
        displayName: 'Num',
        headerStyle: styles.cellHeader,
        cellStyle: styles.cellCenter,
        width: 50,
      },
      Sucursal: {
        displayName: 'Sucursal',
        headerStyle: styles.cellHeader,
        cellStyle: styles.cell,
        width: 120,
      },
      Ingreso: {
        displayName: 'Ingreso',
        headerStyle: styles.cellHeader,
        cellStyle: styles.cellNumber,
        width: 80,
      },
      Gastos: {
        displayName: 'Gastos',
        headerStyle: styles.cellHeader,
        cellStyle: styles.cellNumber,
        width: 80,
      },
      Voucher: {
        displayName: 'Voucher',
        headerStyle: styles.cellHeader,
        cellStyle: styles.cellNumber,
        width: 80,
      },
      Caja: {
        displayName: 'Caja',
        headerStyle: styles.cellHeader,
        cellStyle: styles.cellNumber,
        width: 80,
      },
      NumPX: {
        displayName: 'NumPX',
        headerStyle: styles.cellHeader,
        cellStyle: styles.cellNumber,
        width: 80,
      },
      Estudios: {
        displayName: 'Estudios',
        headerStyle: styles.cellHeader,
        cellStyle: styles.cellNumber,
        width: 80,
      },
    };

    const merges = [
      { start: { row: 1, column: 1 }, end: { row: 1, column: 8 } },
      { start: { row: 2, column: 1 }, end: { row: 2, column: 8 } },
      { start: { row: 3, column: 1 }, end: { row: 3, column: 8 } },
    ];

    const report = buildExport([
      {
        name: 'Reporte de Ventas de Sucursales',
        heading: heading,
        merges: merges,
        specification: specification,
        data: result,
      },
    ]);

    return report;
  }
}
