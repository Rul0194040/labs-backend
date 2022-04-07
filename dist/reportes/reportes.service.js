"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportesService = void 0;
const sucursalesInsumos_entity_1 = require("./../sucursales/sucursalesInsumos.entity");
const common_1 = require("@nestjs/common");
const ventas_entity_1 = require("../ventas/ventas.entity");
const lodash_1 = require("lodash");
const moment = require("moment");
const pagination_prime_Ng_result_dto_1 = require("../common/DTO/pagination-prime-Ng-result.dto");
const node_excel_export_1 = require("node-excel-export");
const sucursal_entity_1 = require("../sucursales/sucursal.entity");
const detalleMovimientos_entity_1 = require("../almacen/detalleMovimientos.entity");
const typeorm_1 = require("typeorm");
let ReportesService = class ReportesService {
    async reporteVentas(options) {
        const ventasQuery = typeorm_1.getRepository(ventas_entity_1.VentaEntity)
            .createQueryBuilder('ventas')
            .leftJoin('ventas.sucursal', 'sucursal')
            .leftJoin('ventas.cliente', 'cliente')
            .leftJoin('ventas.paciente', 'paciente')
            .select(['ventas', 'sucursal', 'cliente', 'paciente'])
            .where('ventas.total > 0');
        lodash_1.forIn(options.filters, (value, key) => {
            switch (key) {
                case 'fecha':
                    const fecha = value.split('*');
                    const inicio = moment(fecha[0]).format('YYYY-MM-DD 00:00:00');
                    const fin = moment(fecha[1]).format('YYYY-MM-DD 23:59:59');
                    ventasQuery.andWhere('ventas.fecha BETWEEN :inicio AND :fin', {
                        inicio,
                        fin,
                    });
                    break;
                case 'sucursalId':
                    ventasQuery.andWhere('sucursal.id = :sucursalId', {
                        sucursalId: value,
                    });
                    break;
                case 'clienteId':
                    ventasQuery.andWhere('cliente.id = :clienteId', {
                        clienteId: value,
                    });
                    break;
                case 'pacienteId':
                    ventasQuery.andWhere('paciente.id = :pacienteId', {
                        pacienteId: value,
                    });
                    break;
                case 'estatus':
                    ventasQuery.andWhere('ventas.estatus = :estatus', {
                        estatus: value,
                    });
                    break;
                default:
                    break;
            }
        });
        if (options.sort === undefined || !Object.keys(options.sort).length) {
            options.sort = 'ventas.fecha';
        }
        const count = await ventasQuery.getCount();
        const data = await ventasQuery
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
    async reporteVentasAdeudos(options) {
        const ventasQuery = typeorm_1.getRepository(ventas_entity_1.VentaEntity)
            .createQueryBuilder('ventas')
            .leftJoin('ventas.sucursal', 'sucursal')
            .leftJoin('ventas.cliente', 'cliente')
            .leftJoin('ventas.paciente', 'paciente')
            .where('ventas.saldo > 0');
        lodash_1.forIn(options.filters, (value, key) => {
            switch (key) {
                case 'fecha':
                    const fecha = value.split('*');
                    const inicio = moment(fecha[0]).format('YYYY-MM-DD 00:00:00');
                    const fin = moment(fecha[1]).format('YYYY-MM-DD 23:59:59');
                    ventasQuery.andWhere('ventas.fecha BETWEEN :inicio AND :fin', {
                        inicio,
                        fin,
                    });
                    break;
                case 'sucursal':
                    ventasQuery.andWhere('sucursal.nombre like :term', {
                        term: `%${value.split(' ').join('%')}%`,
                    });
                    break;
                case 'cliente':
                    ventasQuery.andWhere('cliente.nombre like :term', {
                        term: `%${value.split(' ').join('%')}%`,
                    });
                    break;
                case 'paciente':
                    ventasQuery.andWhere('paciente.nombre like :term', {
                        term: `%${value.split(' ').join('%')}%`,
                    });
                    break;
                default:
                    break;
            }
        });
        if (options.sort === undefined || !Object.keys(options.sort).length) {
            options.sort = 'ventas.fecha';
        }
        const count = await ventasQuery.getCount();
        const data = await ventasQuery
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
    async getVentasXLS(filter) {
        const filters = JSON.parse(filter);
        let title = '';
        const ventasQuery = typeorm_1.getRepository(ventas_entity_1.VentaEntity)
            .createQueryBuilder('ventas')
            .leftJoin('ventas.sucursal', 'sucursal')
            .leftJoin('ventas.cliente', 'cliente')
            .leftJoin('ventas.paciente', 'paciente')
            .leftJoin('ventas.medico', 'medico')
            .select([
            'ventas',
            'sucursal.id',
            'sucursal.nombre',
            'cliente.id',
            'cliente.nombre',
            'paciente.id',
            'paciente.nombre',
            'paciente.apellidoPaterno',
            'paciente.apellidoMaterno',
            'medico.id',
            'medico.nombre',
        ])
            .where('ventas.total > 0');
        if (filters.fecha) {
            const fecha = filters.fecha.split('*');
            const inicio = moment(fecha[0]).format('YYYY-MM-DD 00:00:00');
            const fin = moment(fecha[1]).format('YYYY-MM-DD 23:59:59');
            title = 'Filtro por Fecha ' + fecha[0] + ' y ' + fecha[1];
            ventasQuery.andWhere('ventas.fecha BETWEEN :inicio AND :fin', {
                inicio,
                fin,
            });
        }
        if (filters.sucursalId) {
            const sucursal = await typeorm_1.getRepository(sucursal_entity_1.SucursalEntity).findOne(filters.sucursalId);
            title = title + ' Sucursal: ' + sucursal.nombre;
            ventasQuery.andWhere('sucursal.id = :sucursalId', {
                sucursalId: filters.sucursalId,
            });
        }
        if (filters.clienteId) {
            ventasQuery.andWhere('cliente.id = :clienteId', {
                clienteId: filters.clienteId,
            });
        }
        if (filters.pacienteId) {
            ventasQuery.andWhere('paciente.id = :pacienteId', {
                pacienteId: filters.pacienteId,
            });
        }
        if (filters.estatus) {
            ventasQuery.andWhere('ventas.estatus = :estado', {
                estado: filters.estatus,
            });
        }
        const data = await ventasQuery.getMany();
        const enumInverso = {
            B: 'BORRADOR',
            P: 'EN_PROCESO',
            A: 'AUTORIZADA',
            F: 'FINALIZADA',
            C: 'CANCELADA',
        };
        const result = [];
        for (let i = 0; i < data.length; i++) {
            const obj = {
                id: data[i].id,
                folio: data[i].folio,
                fecha: moment(data[i].fecha).format('DD/MM/YYYY hh:mm'),
                folioPxLaB: data[i].folioPxLab,
                sucursal: data[i].sucursal.nombre,
                paciente: !data[i].paciente
                    ? ''
                    : `${data[i].paciente.nombre} ${data[i].paciente.apellidoPaterno} ${data[i].paciente.apellidoMaterno}`,
                cliente: !data[i].cliente ? '' : `${data[i].paciente.nombre}`,
                medico: !data[i].medico ? '' : `${data[i].medico.nombre}`,
                estado: enumInverso[data[i].estatus],
                subtotal: data[i].total + data[i].descuentoPesos,
                descuento: data[i].descuento + '%',
                descuentoPesos: data[i].descuentoPesos,
                total: data[i].total,
                saldoPendiente: data[i].saldo,
                credito: data[i].credito ? 'SI' : 'NO',
                pagado: data[i].pagado ? 'SI' : 'NO',
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
            cellRight: {
                alignment: { horizontal: 'right' },
                font: { sz: 10 },
            },
            cellNumber: {
                alignment: { horizontal: 'right' },
                font: { sz: 10 },
            },
        };
        const heading = [
            [{ value: 'Laboratorio San Francisco', style: styles.header }],
            [{ value: 'Reporte de Ventas', style: styles.header2 }],
            [
                {
                    value: `${title}`,
                    style: styles.header2,
                },
            ],
            [''],
        ];
        const specification = {
            id: {
                displayName: 'Id',
                headerStyle: styles.cellHeader,
                cellStyle: styles.cellCenter,
                width: 50,
            },
            folio: {
                displayName: 'Folio',
                headerStyle: styles.cellHeader,
                cellStyle: styles.cellCenter,
                width: 50,
            },
            fecha: {
                displayName: 'Fecha',
                headerStyle: styles.cellHeader,
                cellStyle: styles.cellRight,
                width: 100,
            },
            folioPxLaB: {
                displayName: 'folio PxLaB',
                headerStyle: styles.cellHeader,
                cellStyle: styles.cell,
                width: 80,
            },
            sucursal: {
                displayName: 'Sucursal',
                headerStyle: styles.cellHeader,
                cellStyle: styles.cell,
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
                width: 100,
            },
            medico: {
                displayName: 'Médico',
                headerStyle: styles.cellHeader,
                cellStyle: styles.cell,
                width: 100,
            },
            estado: {
                displayName: 'Estado Venta',
                headerStyle: styles.cellHeader,
                cellStyle: styles.cellCenter,
                width: 80,
            },
            subtotal: {
                displayName: 'Subtotal',
                headerStyle: styles.cellHeader,
                cellStyle: styles.cellNumber,
                width: 100,
            },
            descuento: {
                displayName: 'Descuento',
                headerStyle: styles.cellHeader,
                cellStyle: styles.cellCenter,
                width: 100,
            },
            descuentoPesos: {
                displayName: 'Descuento En Pesos',
                headerStyle: styles.cellHeader,
                cellStyle: styles.cellNumber,
                width: 100,
            },
            total: {
                displayName: 'Total',
                headerStyle: styles.cellHeader,
                cellStyle: styles.cellNumber,
                width: 100,
            },
            saldoPendiente: {
                displayName: 'Saldo Pendiente',
                headerStyle: styles.cellHeader,
                cellStyle: styles.cellNumber,
                width: 100,
            },
            credito: {
                displayName: 'Crédito',
                headerStyle: styles.cellHeader,
                cellStyle: styles.cellCenter,
                width: 80,
            },
            pagado: {
                displayName: 'Pagado',
                headerStyle: styles.cellHeader,
                cellStyle: styles.cellCenter,
                width: 80,
            },
        };
        const merges = [
            { start: { row: 1, column: 1 }, end: { row: 1, column: 5 } },
            { start: { row: 2, column: 1 }, end: { row: 2, column: 5 } },
            { start: { row: 3, column: 1 }, end: { row: 3, column: 5 } },
        ];
        const report = node_excel_export_1.buildExport([
            {
                name: 'Reporte Ventas por fechas',
                heading: heading,
                merges: merges,
                specification: specification,
                data: result,
            },
        ]);
        return report;
    }
    async getInsumosBySucursalXLS(sucursalId) {
        const title = '';
        const insumosQuery = typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity)
            .createQueryBuilder('sucIn')
            .leftJoin('sucIn.sucursal', 'sucursal')
            .leftJoin('sucIn.insumo', 'insumo')
            .leftJoin('sucIn.lote', 'lote')
            .select([
            'sucIn.id',
            'sucIn.existencia',
            'sucIn.minimo',
            'sucIn.maximo',
            'sucursal.id',
            'sucursal.nombre',
            'insumo.id',
            'insumo.nombre',
            'lote.numero',
            'lote.caducidad',
        ])
            .where('sucIn.existencia > 0 AND  sucursal.id = :id', { id: sucursalId });
        const data = await insumosQuery.getMany();
        const result = [];
        for (let i = 0; i < data.length; i++) {
            const obj = {
                id: data[i].insumo.id,
                sucursal: data[0].sucursal.nombre,
                insumo: data[i].insumo.nombre,
                existencia: data[i].existencia,
                ubicacion: data[i].ubicacion ? data[i].ubicacion : '',
                lote: data[i].lote ? data[i].lote.numero : '',
                caducidad: data[i].lote ? data[i].lote.caducidad : '',
                minimo: data[i].minimo ? data[i].minimo : 0,
                maximo: data[i].maximo ? data[i].maximo : 0,
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
        };
        const heading = [
            [{ value: 'Laboratorio San Francisco', style: styles.header }],
            [
                {
                    value: `Reporte de insumos en la sucursal ${data.length ? data[0].sucursal.nombre : '-Sin nombre-'}`,
                    style: styles.header2,
                },
            ],
            [
                {
                    value: `${title}`,
                    style: styles.header2,
                },
            ],
            [''],
        ];
        const specification = {
            id: {
                displayName: 'número',
                headerStyle: styles.cellHeader,
                cellStyle: styles.cellCenter,
                width: 50,
            },
            insumo: {
                displayName: 'insumo',
                headerStyle: styles.cellHeader,
                cellStyle: styles.cell,
                width: 150,
            },
            existencia: {
                displayName: 'existencia',
                headerStyle: styles.cellHeader,
                cellStyle: styles.cellCenter,
                width: 100,
            },
            ubicacion: {
                displayName: 'ubicación',
                headerStyle: styles.cellHeader,
                cellStyle: styles.cell,
                width: 150,
            },
            lote: {
                displayName: 'lote',
                headerStyle: styles.cellHeader,
                cellStyle: styles.cell,
                width: 100,
            },
            caducidad: {
                displayName: 'caducidad',
                headerStyle: styles.cellHeader,
                cellStyle: styles.cell,
                width: 150,
            },
            minimo: {
                displayName: 'mínimo',
                headerStyle: styles.cellHeader,
                cellStyle: styles.cellCenter,
                width: 100,
            },
            maximo: {
                displayName: 'máximo',
                headerStyle: styles.cellHeader,
                cellStyle: styles.cellCenter,
                width: 100,
            },
        };
        const merges = [
            { start: { row: 1, column: 1 }, end: { row: 1, column: 6 } },
            { start: { row: 2, column: 1 }, end: { row: 2, column: 6 } },
            { start: { row: 3, column: 1 }, end: { row: 3, column: 6 } },
        ];
        const report = node_excel_export_1.buildExport([
            {
                name: 'Reporte Insumos en Sucursal',
                heading: heading,
                merges: merges,
                specification: specification,
                data: result,
            },
        ]);
        return report;
    }
    async getMovimientoXLS(movimientoId) {
        const title = '';
        const movimientoQuery = typeorm_1.getRepository(detalleMovimientos_entity_1.DetalleMovimientosEntity)
            .createQueryBuilder('detMovimiento')
            .leftJoin('detMovimiento.lote', 'lote')
            .leftJoin('detMovimiento.insumo', 'insumo')
            .leftJoin('insumo.tipoUnidad', 'tipoUnidad')
            .leftJoin('detMovimiento.movimiento', 'movimiento')
            .leftJoin('movimiento.sucursalOrigen', 'sucursalOrigen')
            .leftJoin('movimiento.sucursalDestino', 'sucursalDestino')
            .select([
            'detMovimiento.id',
            'detMovimiento.cantidad',
            'sucursalOrigen.nombre',
            'sucursalDestino.nombre',
            'movimiento.fecha',
            'movimiento.tipoMovimiento',
            'insumo.nombre',
            'tipoUnidad.nombre',
            'lote.numero',
            'lote.caducidad',
        ])
            .where('detMovimiento.movimientoId =:id', { id: movimientoId });
        const data = await movimientoQuery.getMany();
        const result = [];
        for (let i = 0; i < data.length; i++) {
            const obj = {
                insumo: data[i].insumo.nombre,
                cantidad: data[i].cantidad,
                tipoUnidad: data[i].insumo.tipoUnidad
                    ? data[i].insumo.tipoUnidad.nombre
                    : '',
                lote: data[i].lote ? data[i].lote.numero : '',
                caducidad: data[i].lote ? data[i].lote.caducidad : '',
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
        };
        const heading = [
            [{ value: 'Laboratorio San Francisco', style: styles.header }],
            [
                {
                    value: `Reporte de Movimiento: ${data[0].movimiento.tipoMovimiento} - Fecha: ${moment(data[0].movimiento.createdAt).format('DD/MM/YYYY')}`,
                    style: styles.header2,
                },
            ],
            [
                {
                    value: `Sucursal Origen: ${data[0].movimiento.sucursalOrigen
                        ? data[0].movimiento.sucursalOrigen.nombre
                        : ''} -- Sucursal Destino: ${data[0].movimiento.sucursalDestino
                        ? data[0].movimiento.sucursalDestino.nombre
                        : ''}`,
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
            insumo: {
                displayName: 'Insumo',
                headerStyle: styles.cellHeader,
                cellStyle: styles.cellCenter,
                width: 250,
            },
            cantidad: {
                displayName: 'Cantidad',
                headerStyle: styles.cellHeader,
                cellStyle: styles.cellCenter,
                width: 50,
            },
            tipoUnidad: {
                displayName: 'Tipo de Unidad',
                headerStyle: styles.cellHeader,
                cellStyle: styles.cell,
                width: 250,
            },
            lote: {
                displayName: 'Lote',
                headerStyle: styles.cellHeader,
                cellStyle: styles.cell,
                width: 100,
            },
            caducidad: {
                displayName: 'Caducidad',
                headerStyle: styles.cellHeader,
                cellStyle: styles.cell,
                width: 150,
            },
        };
        const merges = [
            { start: { row: 1, column: 1 }, end: { row: 1, column: 5 } },
            { start: { row: 2, column: 1 }, end: { row: 2, column: 5 } },
            { start: { row: 3, column: 1 }, end: { row: 3, column: 5 } },
        ];
        const report = node_excel_export_1.buildExport([
            {
                name: 'Reporte de Movimientos',
                heading: heading,
                merges: merges,
                specification: specification,
                data: result,
            },
        ]);
        return report;
    }
};
ReportesService = __decorate([
    common_1.Injectable()
], ReportesService);
exports.ReportesService = ReportesService;
//# sourceMappingURL=reportes.service.js.map