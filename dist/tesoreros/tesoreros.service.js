"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TesorerosService = void 0;
const cajas_service_1 = require("./../cajas/cajas.service");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const ventas_entity_1 = require("../ventas/ventas.entity");
const estadosCancelacion_enum_1 = require("../ventas/estadosCancelacion.enum");
const cajas_entity_1 = require("../cajas/cajas.entity");
const profiles_enum_1 = require("../users/profiles.enum");
const movimientos_caja_entity_1 = require("../cajas/movimientos-caja.entity");
const estatusMovimiento_enum_1 = require("../cajas/estatusMovimiento.enum");
const lodash_1 = require("lodash");
const moment = require("moment");
const cortesTesorero_entity_1 = require("./cortesTesorero/cortesTesorero.entity");
const estatusCorte_enum_1 = require("./cortesTesorero/estatusCorte.enum");
const estatusCaja_enum_1 = require("../cajas/estatusCaja.enum");
let TesorerosService = class TesorerosService {
    constructor(cajaService) {
        this.cajaService = cajaService;
    }
    async verSolicitudesCancelacion() {
        return await typeorm_1.getRepository(ventas_entity_1.VentaEntity)
            .createQueryBuilder('venta')
            .leftJoin('venta.sucursal', 'sucursal')
            .leftJoin('venta.cliente', 'cliente')
            .leftJoin('venta.paciente', 'paciente')
            .leftJoin('venta.medico', 'medico')
            .select([
            'venta',
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
            .where('venta.estatusCancelacion = :estatusCancelacion', {
            estatusCancelacion: estadosCancelacion_enum_1.EstadosCancelacionVenta.SOLICITUD,
        })
            .getMany();
    }
    async setObservaciones(cajaId, data) {
        return await typeorm_1.getRepository(cajas_entity_1.CajaEntity)
            .createQueryBuilder()
            .update()
            .set({ faltante: data.faltante, observacionTesorero: data.observaciones })
            .where('id = :cajaId', {
            cajaId: cajaId,
        })
            .execute();
    }
    async paginate(options) {
        const dataQuery = typeorm_1.getRepository(cortesTesorero_entity_1.CorteTesoreroEntity)
            .createQueryBuilder('cortes')
            .leftJoin('cortes.cajas', 'cajas')
            .leftJoin('cajas.sucursal', 'sucursal')
            .leftJoin('cajas.usuario', 'usuario')
            .select([
            'cortes',
            'cajas',
            'sucursal.id',
            'sucursal.nombre',
            'usuario.id',
            'usuario.firstName',
            'usuario.lastName',
        ])
            .where('cortes.active = :active', {
            active: true,
        });
        lodash_1.forIn(options.filters, (value, key) => {
            switch (key) {
                case 'fecha':
                    const fecha = value.split('*');
                    const inicio = moment(fecha[0]).format('YYYY-MM-DD 00:00:00');
                    const fin = moment(fecha[1]).format('YYYY-MM-DD 23:59:59');
                    dataQuery.andWhere('cortes.createdAt BETWEEN :inicio AND :fin', {
                        inicio,
                        fin,
                    });
                    break;
                case 'estatus':
                    dataQuery.andWhere('cortes.estatus = :estatus', {
                        estatus: value,
                    });
                    break;
                default:
                    break;
            }
        });
        const count = await dataQuery.getCount();
        if (options.sort === undefined) {
            options.sort = 'createdAt';
        }
        const data = await dataQuery
            .skip(options.skip)
            .take(options.take)
            .orderBy(options.sort, 'DESC')
            .getMany();
        const dataR = data;
        if (dataR.length) {
            for (let idx = 0; idx < dataR.length; idx++) {
                const cajas = dataR[idx].cajas;
                const cajasR = [];
                if (cajas.length) {
                    for (let j = 0; j < cajas.length; j++) {
                        const caja = await this.cajaService.getTotalMovimientosByCajaCerrada(cajas[j].id);
                        cajas[j].depositos = caja.depositos || 0;
                        cajas[j].retiros = caja.retiros || 0;
                        cajas[j].ventas = caja.ventas || 0;
                        cajas[j].cancelaciones = caja.cancelaciones || 0;
                        cajas[j].transferencias = caja.transferencias || 0;
                        cajas[j].tarjeta = caja.tarjeta || 0;
                        cajas[j].efectivo = caja.efectivo || 0;
                        cajas[j].cheque = caja.cheque || 0;
                        cajas[j].credito = caja.credito || 0;
                        cajasR.push(cajas[j]);
                    }
                    dataR[idx].cajas = cajasR;
                }
            }
        }
        return {
            data: dataR,
            skip: options.skip,
            totalItems: count,
        };
    }
    async verVentasCanceladas() {
        return await typeorm_1.getRepository(ventas_entity_1.VentaEntity)
            .createQueryBuilder('ventas')
            .leftJoin('ventas.usuarioCancelo', 'usuario')
            .select([
            'ventas',
            'usuario.id',
            'usuario.email',
            'usuario.firstName',
            'usuario.lastName',
            'usuario.profile',
        ])
            .where('estatusCancelacion = :estatusCancelacion', {
            estatusCancelacion: estadosCancelacion_enum_1.EstadosCancelacionVenta.APROBADA,
        })
            .getMany();
    }
    async obtenerCajasAbiertas(user, options) {
        const cajasQuery = typeorm_1.getRepository(cajas_entity_1.CajaEntity)
            .createQueryBuilder('caja')
            .leftJoinAndSelect('caja.sucursal', 'sucursal')
            .leftJoinAndSelect('caja.usuario', 'usuario')
            .select([
            'sucursal.id',
            'sucursal.nombre',
            'sucursal.esMatriz',
            'sucursal.esLaboratorio',
            'sucursal.esForanea',
            'sucursal.responsable',
            'usuario.id',
            'usuario.email',
            'usuario.firstName',
            'usuario.lastName',
            'usuario.profile',
            'caja.id',
            'caja.active',
            'caja.sucursalId',
            'caja.usuarioId',
            'caja.fechaApertura',
            'caja.fechaCierre',
            'caja.notas',
            'caja.estatus',
            'caja.total',
        ]);
        if (user.profile === profiles_enum_1.ProfileTypes.TESORERO_SUCURSALES_CENTRALES) {
            cajasQuery.andWhere('sucursal.esForanea = :esForanea', {
                esForanea: false,
            });
        }
        if (user.profile === profiles_enum_1.ProfileTypes.TESORERO_SUCURSALES_FORANEAS) {
            cajasQuery.andWhere('sucursal.esForanea = :esForanea', {
                esForanea: true,
            });
        }
        lodash_1.forIn(options.filters, (value, key) => {
            if (key === 'estatus') {
                cajasQuery.andWhere('caja.estatus = :estatus', {
                    estatus: value,
                });
            }
            if (key === 'sucursal') {
                cajasQuery.andWhere('( sucursal.nombre LIKE :term )', {
                    term: `%${value.split(' ').join('%')}%`,
                });
            }
            if (key === 'fecha') {
                const inicio = moment(value).format('YYYY-MM-DD 00:00:00');
                const fin = moment(value).format('YYYY-MM-DD 23:59:59');
                cajasQuery.andWhere('fechaApertura BETWEEN :inicio AND :fin', {
                    inicio: inicio,
                    fin: fin,
                });
            }
        });
        const count = await cajasQuery.getCount();
        const data = await cajasQuery
            .skip(options.skip)
            .take(options.take)
            .orderBy(options.sort)
            .getMany();
        return {
            data: data,
            skip: options.skip,
            totalItems: count,
        };
    }
    async movimientosSolicitudCancelacion() {
        return await typeorm_1.getRepository(movimientos_caja_entity_1.MovimientoCajaEntity)
            .createQueryBuilder('movimiento')
            .leftJoinAndSelect('movimiento.caja', 'caja')
            .leftJoinAndSelect('caja.sucursal', 'sucursal')
            .leftJoinAndSelect('caja.usuario', 'usuario')
            .select([
            'movimiento',
            'sucursal.id',
            'sucursal.nombre',
            'sucursal.esMatriz',
            'sucursal.esLaboratorio',
            'sucursal.esForanea',
            'usuario.id',
            'usuario.email',
            'usuario.firstName',
            'usuario.lastName',
            'usuario.profile',
            'caja.id',
            'caja.active',
            'caja.sucursalId',
            'caja.usuarioId',
            'caja.fechaApertura',
            'caja.notas',
            'caja.estatus',
        ])
            .where('movimiento.estatusMovimiento = :status', {
            status: estatusMovimiento_enum_1.EstatusMovimientoCancelacionE.SOLICITUD,
        })
            .getMany();
    }
    async finalizarCorte(corteId) {
        await typeorm_1.getRepository(cajas_entity_1.CajaEntity)
            .createQueryBuilder()
            .update()
            .set({ estatus: estatusCaja_enum_1.EstatusCaja.ENTREGADA })
            .where('corteTesoreroId = :corteId', {
            corteId: corteId,
        })
            .execute();
        return await typeorm_1.getRepository(cortesTesorero_entity_1.CorteTesoreroEntity)
            .createQueryBuilder()
            .update()
            .set({
            estatus: estatusCorte_enum_1.EstatusCorte.ENTREGADO,
        })
            .where('id = :corteId', { corteId })
            .execute();
    }
};
TesorerosService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [cajas_service_1.CajasService])
], TesorerosService);
exports.TesorerosService = TesorerosService;
//# sourceMappingURL=tesoreros.service.js.map