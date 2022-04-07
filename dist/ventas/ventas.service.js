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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var VentasService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VentasService = void 0;
const pagos_entity_1 = require("./../pagos/pagos.entity");
const tipos_unidades_entity_1 = require("./../catalogos/tipos-unidades/tipos-unidades.entity");
const ventasDetalleInsumos_entity_1 = require("./ventasDetalleInsumos.entity");
const pacientes_entity_1 = require("./../pacientes/pacientes.entity");
const ventas_entity_1 = require("./ventas.entity");
const common_1 = require("@nestjs/common");
const pagination_prime_Ng_result_dto_1 = require("../common/DTO/pagination-prime-Ng-result.dto");
const paginationPrimeNg_dto_1 = require("../common/DTO/paginationPrimeNg.dto");
const lodash_1 = require("lodash");
const typeorm_1 = require("typeorm");
const estadosVentas_enum_1 = require("./estadosVentas.enum");
const ventasDetalle_entity_1 = require("./ventasDetalle.entity");
const servicio_entity_1 = require("../servicios/servicio.entity");
const sucursalesInsumos_entity_1 = require("../sucursales/sucursalesInsumos.entity");
const users_entity_1 = require("../users/users.entity");
const cajas_entity_1 = require("../cajas/cajas.entity");
const estatusCaja_enum_1 = require("../cajas/estatusCaja.enum");
const moment = require("moment");
const convertidor = require("numero-a-letras");
const estadosCancelacion_enum_1 = require("./estadosCancelacion.enum");
const clientes_entity_1 = require("../clientes/clientes.entity");
const event_emitter_1 = require("@nestjs/event-emitter");
const medico_entity_1 = require("../medicos/medico.entity");
const muestras_entity_1 = require("./muestras/muestras.entity");
const pxlab_service_1 = require("../pxlab/pxlab.service");
const logger_1 = require("../logger");
const profiles_enum_1 = require("../users/profiles.enum");
let VentasService = VentasService_1 = class VentasService {
    constructor(pxService, eventEmitter) {
        this.pxService = pxService;
        this.eventEmitter = eventEmitter;
        this.notFoundMessage = 'Venta no encontrada';
        this.logger = new logger_1.MyLogger(VentasService_1.name);
    }
    async create(venta, user) {
        const fecha = new Date();
        const caja = await typeorm_1.getRepository(cajas_entity_1.CajaEntity)
            .createQueryBuilder('caja')
            .leftJoin('caja.usuario', 'usuario')
            .leftJoin('caja.sucursal', 'sucursal')
            .where('usuario.id = :usuarioId AND sucursal.id = :sucursalId', {
            usuarioId: user.id,
            sucursalId: user.sucursal.id,
        })
            .andWhere('estatus = :cajaEstatus', {
            cajaEstatus: estatusCaja_enum_1.EstatusCaja.ABIERTA,
        })
            .getOne();
        let ventaToCreate = {};
        if (venta.pacienteId) {
            const paciente = await typeorm_1.getRepository(pacientes_entity_1.PacienteEntity).findOne(venta.pacienteId);
            let cliente = null;
            if (paciente && paciente.clienteId) {
                cliente = await typeorm_1.getRepository(clientes_entity_1.ClienteEntity).findOne(paciente.clienteId);
            }
            else {
                cliente = await typeorm_1.getRepository(clientes_entity_1.ClienteEntity).findOne({
                    where: { cuentaPxLab: '1' },
                });
            }
            if (!paciente) {
                throw new common_1.HttpException('paciente no encontrado', common_1.HttpStatus.NOT_FOUND);
            }
            ventaToCreate = {
                sucursal: user.sucursal,
                caja,
                paciente,
                fecha,
                zona: venta.zona,
            };
            if (cliente) {
                ventaToCreate.cliente = cliente;
            }
        }
        else {
            ventaToCreate = {
                sucursal: user.sucursal,
                caja,
                fecha,
                zona: venta.zona,
            };
        }
        ventaToCreate.diagnostico = venta.diagnostico || null;
        ventaToCreate.fechaUltimaRegla = venta.fechaUltimaRegla || null;
        ventaToCreate.observaciones = venta.observaciones || null;
        ventaToCreate.tipoPrecio = venta.tipoPrecio;
        if (venta.medicoId) {
            const medico = await typeorm_1.getRepository(medico_entity_1.MedicoEntity).findOne(venta.medicoId);
            if (!medico) {
                throw new common_1.HttpException('medico no encontrado', common_1.HttpStatus.NOT_FOUND);
            }
            ventaToCreate.medico = medico;
        }
        ventaToCreate.acceso = (Math.random() * 1000000000).toFixed(0).substr(0, 8);
        const ventaSave = await typeorm_1.getRepository(ventas_entity_1.VentaEntity).save(ventaToCreate);
        const folio = () => {
            const sucursalId = user.sucursal.id.toString();
            const ventaId = ventaSave.id;
            let result;
            if (sucursalId.length === 1) {
                result = '00' + sucursalId + ventaId;
            }
            else if (sucursalId.length === 2) {
                result = '0' + sucursalId + ventaId;
            }
            else {
                result = sucursalId + ventaId;
            }
            return result;
        };
        await typeorm_1.getRepository(ventas_entity_1.VentaEntity)
            .createQueryBuilder()
            .update()
            .set({ folio: folio() })
            .where('id = :ventaId', { ventaId: ventaSave.id })
            .execute();
        const ventaFinal = await this.getById(ventaSave.id);
        this.eventEmitter.emit('gateway.send', {
            channel: 'admin',
            event: 'nuevaVenta',
            data: ventaFinal,
        });
        return ventaFinal;
    }
    async updateSeguimientoVenta(ventaId, venta) {
        const v = await typeorm_1.getRepository(ventas_entity_1.VentaEntity).findOne(ventaId);
        const resultUpdate = await typeorm_1.getRepository(ventas_entity_1.VentaEntity).update({ id: v.id }, {
            fechaUltimaRegla: venta.fechaUltimaRegla
                ? venta.fechaUltimaRegla
                : null,
            observaciones: venta.observaciones ? venta.observaciones : null,
            diagnostico: venta.diagnostico ? venta.diagnostico : null,
        });
        if (resultUpdate.affected) {
            await this.pxService.enviarVenta(await this.getventaByFolio(v.folio), 'M');
        }
        return resultUpdate;
    }
    async ClienteAVenta(detalles) {
        const cliente = await typeorm_1.getRepository(clientes_entity_1.ClienteEntity).findOne(detalles.clienteId);
        if (!cliente) {
            throw new common_1.HttpException('cliente no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        await typeorm_1.getRepository(ventas_entity_1.VentaEntity)
            .createQueryBuilder()
            .update()
            .set({ cliente })
            .where('id=:id', { id: detalles.ventaId })
            .execute();
        return cliente;
    }
    async MaquiladorAVenta(detalles) {
        const maquilador = await typeorm_1.getRepository(users_entity_1.UsersEntity).findOne(detalles.maquiladorId);
        if (!maquilador) {
            throw new common_1.HttpException('cliente no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        await typeorm_1.getRepository(ventas_entity_1.VentaEntity)
            .createQueryBuilder()
            .update()
            .set({ maquilador })
            .where('id=:id', { id: detalles.ventaId })
            .execute();
        return lodash_1.pick(maquilador, [
            'id',
            'uuid',
            'firstName',
            'lastName',
            'profile',
            'comisionVendedor',
            'tipoEmpleado',
        ]);
    }
    async VendedorAVenta(detalles) {
        const vendedor = await typeorm_1.getRepository(users_entity_1.UsersEntity).findOne(detalles.vendedorId);
        if (!vendedor) {
            throw new common_1.HttpException('cliente no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        await typeorm_1.getRepository(ventas_entity_1.VentaEntity)
            .createQueryBuilder()
            .update()
            .set({ vendedor })
            .where('id=:id', { id: detalles.ventaId })
            .execute();
        return lodash_1.pick(vendedor, [
            'id',
            'uuid',
            'firstName',
            'lastName',
            'profile',
            'comisionVendedor',
            'tipoEmpleado',
        ]);
    }
    async CaptadorAVenta(detalles) {
        const captador = await typeorm_1.getRepository(users_entity_1.UsersEntity).findOne(detalles.captadorId);
        if (!captador) {
            throw new common_1.HttpException('cliente no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        await typeorm_1.getRepository(ventas_entity_1.VentaEntity)
            .createQueryBuilder()
            .update()
            .set({ captador })
            .where('id=:id', { id: detalles.ventaId })
            .execute();
        return lodash_1.pick(captador, [
            'id',
            'uuid',
            'firstName',
            'lastName',
            'profile',
            'comisionVendedor',
            'tipoEmpleado',
        ]);
    }
    async PacienteAVenta(detalles) {
        const paciente = await typeorm_1.getRepository(pacientes_entity_1.PacienteEntity).findOne(detalles.pacienteId);
        if (!paciente) {
            throw new common_1.HttpException('paciente no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        await typeorm_1.getRepository(ventas_entity_1.VentaEntity)
            .createQueryBuilder()
            .update()
            .set({ paciente })
            .where('id=:id', { id: detalles.ventaId })
            .execute();
        return paciente;
    }
    async removeCliente(id) {
        return typeorm_1.getRepository(ventas_entity_1.VentaEntity)
            .createQueryBuilder()
            .update()
            .set({ paciente: null })
            .where('id=:id', { id })
            .execute();
    }
    async CreateDetalle(detalles) {
        const venta = await typeorm_1.getRepository(ventas_entity_1.VentaEntity).findOne(detalles.ventaId);
        if (!venta) {
            throw new common_1.HttpException('venta no encontrada', common_1.HttpStatus.NOT_FOUND);
        }
        const servicio = await typeorm_1.getRepository(servicio_entity_1.ServicioEntity).findOne(detalles.servicio.servicioId);
        if (!servicio) {
            throw new common_1.HttpException('servicio no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        await typeorm_1.getRepository(ventas_entity_1.VentaEntity)
            .createQueryBuilder()
            .update()
            .set({ total: Number(venta.total) + Number(detalles.precio) })
            .where('id = :ventaId', { ventaId: venta.id })
            .execute();
        const DetalleToCreate = {
            venta,
            servicio,
            medico: detalles.medico ? detalles.medico : null,
            recomendaciones: detalles.recomendaciones
                ? detalles.recomendaciones
                : null,
            precio: detalles.precio,
            descuento: detalles.descuento,
        };
        const savedDetalle = await typeorm_1.getRepository(ventasDetalle_entity_1.DetalleVentasEntity).save(DetalleToCreate);
        const result = typeorm_1.getRepository(ventasDetalle_entity_1.DetalleVentasEntity)
            .createQueryBuilder('detalleventa')
            .leftJoinAndSelect('detalleventa.servicio', 'servicio')
            .where('detalleventa.id = :id', {
            id: savedDetalle.id,
        })
            .getOne();
        return result;
    }
    async removeDetalle(id) {
        const detalle = await typeorm_1.getRepository(ventasDetalle_entity_1.DetalleVentasEntity).findOne({ id });
        if (!detalle) {
            throw new common_1.HttpException('detalle no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        const venta = await typeorm_1.getRepository(ventas_entity_1.VentaEntity).findOne({
            id: detalle.ventaId,
        });
        const nuevoTotalVenta = Number(venta.total) - Number(detalle.precio);
        await typeorm_1.getRepository(ventas_entity_1.VentaEntity)
            .createQueryBuilder()
            .update()
            .set({ total: nuevoTotalVenta })
            .where('id = :ventaId', { ventaId: venta.id })
            .execute();
        return await typeorm_1.getRepository(ventasDetalle_entity_1.DetalleVentasEntity).delete({ id });
    }
    async updateTransaccion(id, montos) {
        return await typeorm_1.getRepository(ventas_entity_1.VentaEntity).update(id, {
            efectivoRecibido: montos.efectivoRecibido,
            cambio: montos.cambio,
        });
    }
    async getDetalleVentaPorId(detalleVentaId) {
        return await typeorm_1.getRepository(ventasDetalle_entity_1.DetalleVentasEntity)
            .createQueryBuilder('detalleVenta')
            .where({ id: detalleVentaId })
            .getOne();
    }
    async insumosADetalle(detalles, detalleVentaId, user) {
        const usuario = await typeorm_1.getRepository(users_entity_1.UsersEntity).findOne({
            where: { id: user.id },
            select: ['id', 'email', 'firstName', 'lastName', 'email', 'telefono'],
        });
        const respuesta = [];
        for (let index = 0; index < detalles.length; index++) {
            const insumoSucursal = await typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity).findOne({
                where: { id: detalles[index].insumoSucursalId },
                relations: ['lote'],
            });
            const restante = insumoSucursal.existencia - detalles[index].cantidad;
            let unidad = new tipos_unidades_entity_1.TipoUnidadEntity();
            if (detalles[index].unidadId) {
                unidad = await typeorm_1.getRepository(tipos_unidades_entity_1.TipoUnidadEntity).findOne(detalles[index].unidadId);
            }
            const insumoTocreate = {
                usuario,
                detalleVentaId: detalleVentaId,
                unidad,
                insumoSucursal,
                cantidad: detalles[index].cantidad,
                nota: detalles[index].nota,
            };
            respuesta.push(await typeorm_1.getRepository(ventasDetalleInsumos_entity_1.DetalleVentasInsumosEntity).save(insumoTocreate));
            await typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity)
                .createQueryBuilder()
                .update()
                .set({ existencia: restante })
                .where('id=:id', { id: insumoSucursal.id })
                .execute();
        }
        return respuesta;
    }
    async insumosADetalleRetiro(detalleVentasInsumoId) {
        const ventaInsumo = await typeorm_1.getRepository(ventasDetalleInsumos_entity_1.DetalleVentasInsumosEntity).findOne(detalleVentasInsumoId);
        const sucIn = await typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity).findOne(ventaInsumo.insumoSucursalId);
        await typeorm_1.getRepository(ventasDetalleInsumos_entity_1.DetalleVentasInsumosEntity).delete(detalleVentasInsumoId);
        const nuevoTotal = sucIn.existencia + ventaInsumo.cantidad;
        return await typeorm_1.getRepository(sucursalesInsumos_entity_1.SucursalesInsumosEntity)
            .createQueryBuilder()
            .update()
            .set({ existencia: Number(nuevoTotal) })
            .where('id=:id', { id: sucIn.id })
            .execute();
    }
    async FinalizadoVenta(ventaId) {
        const ventaQuery = await typeorm_1.getRepository(ventasDetalle_entity_1.DetalleVentasEntity)
            .createQueryBuilder('det')
            .leftJoin('det.venta', 'venta')
            .where('venta.id =:ventaId', { ventaId })
            .getMany();
        const allCerrado = ventaQuery.every((e) => e.cerrado);
        if (allCerrado) {
            return await typeorm_1.getRepository(ventas_entity_1.VentaEntity)
                .createQueryBuilder()
                .update()
                .set({ estatus: estadosVentas_enum_1.EstadosVentas.FINALIZADA })
                .where('id=:ventaId', { ventaId })
                .execute();
        }
        else {
            throw new common_1.HttpException('Faltan detalles por cerrar en la venta', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getInsumoDetallePorVenta(ventaId) {
        const respuesta = [];
        const detalleVentasInsumos = await typeorm_1.getRepository(ventasDetalle_entity_1.DetalleVentasEntity)
            .createQueryBuilder('detalleVenta')
            .leftJoin('detalleVenta.venta', 'venta')
            .leftJoinAndSelect('detalleVenta.servicio', 'servicio')
            .where('venta.id = :ventaId', {
            ventaId,
        })
            .getMany();
        for (let i = 0; i < detalleVentasInsumos.length; i++) {
            const insumos = await typeorm_1.getRepository(ventasDetalleInsumos_entity_1.DetalleVentasInsumosEntity)
                .createQueryBuilder('detalleInsumoVenta')
                .leftJoin('detalleInsumoVenta.detalleVenta', 'detalleVenta')
                .leftJoinAndSelect('detalleInsumoVenta.insumoSucursal', 'insumoSucursal')
                .leftJoinAndSelect('insumoSucursal.insumo', 'insumo')
                .leftJoinAndSelect('insumoSucursal.lote', 'lote')
                .leftJoinAndSelect('detalleInsumoVenta.unidad', 'unidad')
                .where('detalleVenta.id = :detalleVentaId', {
                detalleVentaId: detalleVentasInsumos[i].id,
            })
                .select([
                'detalleInsumoVenta',
                'insumoSucursal.id',
                'insumoSucursal.lote',
                'lote',
                'insumo.id',
                'insumo.nombre',
                'insumo.descuentaEn',
                'unidad.id',
                'unidad.nombre',
            ])
                .getMany();
            const muestras = await typeorm_1.getRepository(muestras_entity_1.MuestraEntity)
                .createQueryBuilder('muestra')
                .leftJoin('muestra.usuario', 'usuario')
                .leftJoin('muestra.ventaDetalle', 'ventaDetalle')
                .select([
                'usuario.id',
                'usuario.firstName',
                'usuario.lastName',
                'muestra',
            ])
                .where('ventaDetalle.id = :detalleVentaId', {
                detalleVentaId: detalleVentasInsumos[i].id,
            })
                .getMany();
            const item = Object.assign(Object.assign({}, detalleVentasInsumos[i]), { insumos,
                muestras });
            respuesta.push(item);
        }
        return respuesta;
    }
    async getInsumosPorDetalleVenta(detalleVentaId) {
        return await typeorm_1.getRepository(ventasDetalleInsumos_entity_1.DetalleVentasInsumosEntity)
            .createQueryBuilder('detalleInsumoVenta')
            .leftJoin('detalleInsumoVenta.detalleVenta', 'detalleVenta')
            .where('detalleVenta.id = :detalleVentaId', {
            detalleVentaId,
        })
            .getMany();
    }
    async updateEstadoDetalleVenta(detalleVentaId) {
        await typeorm_1.getRepository(ventasDetalle_entity_1.DetalleVentasEntity)
            .createQueryBuilder('ventaDetalle')
            .update()
            .set({ cerrado: () => '!cerrado' })
            .where({ id: detalleVentaId })
            .execute();
        const detalleVenta = await typeorm_1.getRepository(ventasDetalle_entity_1.DetalleVentasEntity)
            .createQueryBuilder('detalleVenta')
            .where('id = :detalleVentaId', { detalleVentaId })
            .getOne();
        return detalleVenta.cerrado;
    }
    async updateEstadosDetalleVenta(ventaId, estado) {
        await typeorm_1.getRepository(ventasDetalle_entity_1.DetalleVentasEntity)
            .createQueryBuilder('ventaDetalle')
            .update()
            .set({ cerrado: estado })
            .where('ventaId = :ventaId', { ventaId })
            .execute();
        const detalleVenta = await typeorm_1.getRepository(ventasDetalle_entity_1.DetalleVentasEntity)
            .createQueryBuilder('detalleVenta')
            .where('ventaId = :ventaId', { ventaId })
            .getMany();
        return detalleVenta;
    }
    async getById(id) {
        const venta = typeorm_1.getRepository(ventas_entity_1.VentaEntity)
            .createQueryBuilder('venta')
            .leftJoinAndSelect('venta.paciente', 'paciente')
            .leftJoinAndSelect('paciente.cliente', 'cliente')
            .leftJoinAndSelect('venta.cliente', 'clienteVenta')
            .leftJoinAndSelect('venta.medico', 'medico')
            .leftJoinAndSelect('venta.vendedor', 'vendedor')
            .leftJoinAndSelect('venta.maquilador', 'maquilador')
            .leftJoinAndSelect('venta.captador', 'captador')
            .where('venta.id = :ventaId', { ventaId: id })
            .select([
            'venta',
            'paciente',
            'cliente',
            'clienteVenta',
            'medico',
            'vendedor.comisionVendedor',
            'vendedor.firstName',
            'vendedor.lastName',
            'vendedor.profile',
            'vendedor.tipoEmpleado',
            'vendedor.id',
            'vendedor.uuid',
            'maquilador.comisionVendedor',
            'maquilador.firstName',
            'maquilador.lastName',
            'maquilador.profile',
            'maquilador.tipoEmpleado',
            'maquilador.id',
            'maquilador.uuid',
            'captador.comisionVendedor',
            'captador.firstName',
            'captador.lastName',
            'captador.profile',
            'captador.tipoEmpleado',
            'captador.id',
            'captador.uuid',
        ])
            .getOne();
        if (!venta) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        return venta;
    }
    async getByUuid(uuid) {
        const venta = typeorm_1.getRepository(ventas_entity_1.VentaEntity)
            .createQueryBuilder('venta')
            .leftJoinAndSelect('venta.paciente', 'paciente')
            .leftJoinAndSelect('paciente.cliente', 'cliente')
            .leftJoinAndSelect('venta.cliente', 'clienteVenta')
            .leftJoinAndSelect('venta.medico', 'medico')
            .where('venta.uuid = :ventaId', { ventaId: uuid })
            .getOne();
        if (!venta) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        return venta;
    }
    async getVentasCreditoCliente(clienteId, options) {
        const dataQuery = await typeorm_1.getRepository(ventas_entity_1.VentaEntity)
            .createQueryBuilder('venta')
            .leftJoinAndSelect('venta.paciente', 'paciente')
            .leftJoinAndSelect('venta.medico', 'medico')
            .leftJoin('paciente.cliente', 'cliente')
            .leftJoin('venta.cliente', 'clienteVenta')
            .where('venta.credito = true')
            .andWhere('cliente.id = :clienteId', { clienteId });
        lodash_1.forIn(options.filters, (value, key) => {
            if (key === 'estatus') {
                if (value === estadosVentas_enum_1.EstadosVentas.FINALIZADA || estadosVentas_enum_1.EstadosVentas.CANCELADA) {
                    dataQuery.andWhere('(venta.estatus=:status)', {
                        status: value,
                    });
                }
            }
        });
        const count = await dataQuery.getCount();
        if (options.sort === undefined) {
            options.sort = 'venta.createdAt';
        }
        const data = await dataQuery
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
    async getDetalleVentaById(ventaId) {
        const venta = await typeorm_1.getRepository(ventas_entity_1.VentaEntity)
            .createQueryBuilder('venta')
            .leftJoinAndSelect('venta.paciente', 'paciente')
            .leftJoinAndSelect('paciente.cliente', 'clientePaciente')
            .leftJoinAndSelect('venta.medico', 'medico')
            .leftJoinAndSelect('venta.sucursal', 'sucursal')
            .leftJoinAndSelect('venta.cliente', 'cliente')
            .leftJoinAndSelect('venta.caja', 'caja')
            .leftJoinAndSelect('venta.autorizoDescuento', 'autorizoDescuento')
            .leftJoinAndSelect('caja.usuario', 'usuario')
            .leftJoinAndSelect('venta.vendedor', 'vendedor')
            .leftJoinAndSelect('venta.captador', 'captador')
            .leftJoinAndSelect('venta.maquilador', 'maquilador')
            .where('venta.id = :ventaId', { ventaId })
            .select([
            'venta',
            'paciente',
            'clientePaciente',
            'medico',
            'sucursal',
            'cliente',
            'caja',
            'autorizoDescuento.id',
            'autorizoDescuento.firstName',
            'autorizoDescuento.lastName',
            'usuario',
            'vendedor.comisionVendedor',
            'vendedor.firstName',
            'vendedor.lastName',
            'vendedor.profile',
            'vendedor.tipoEmpleado',
            'vendedor.id',
            'vendedor.uuid',
            'maquilador.comisionVendedor',
            'maquilador.firstName',
            'maquilador.lastName',
            'maquilador.profile',
            'maquilador.tipoEmpleado',
            'maquilador.id',
            'maquilador.uuid',
            'captador.comisionVendedor',
            'captador.firstName',
            'captador.lastName',
            'captador.profile',
            'captador.tipoEmpleado',
            'captador.id',
            'captador.uuid',
        ])
            .getOne();
        if (!venta) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        const detalle = await typeorm_1.getRepository(ventasDetalle_entity_1.DetalleVentasEntity)
            .createQueryBuilder('detalle')
            .leftJoinAndSelect('detalle.servicio', 'servicio')
            .where('detalle.venta = :ventaId', { ventaId })
            .getMany();
        const pagos = await typeorm_1.getRepository(pagos_entity_1.PagoEntity)
            .createQueryBuilder('pago')
            .where('pago.venta = :ventaId', { ventaId })
            .getMany();
        return {
            venta,
            detalle,
            pagos,
        };
    }
    async getventaByFolio(folio) {
        const venta = await typeorm_1.getRepository(ventas_entity_1.VentaEntity)
            .createQueryBuilder('venta')
            .leftJoinAndSelect('venta.paciente', 'paciente')
            .leftJoinAndSelect('paciente.cliente', 'cliente')
            .leftJoinAndSelect('venta.sucursal', 'sucursal')
            .leftJoinAndSelect('venta.cliente', 'clienteVenta')
            .leftJoinAndSelect('venta.medico', 'medico')
            .leftJoinAndSelect('venta.autorizoDescuento', 'autorizoDescuento')
            .leftJoin('venta.caja', 'caja')
            .leftJoinAndSelect('caja.usuario', 'cajero')
            .leftJoinAndSelect('venta.vendedor', 'vendedor')
            .leftJoinAndSelect('venta.maquilador', 'maquilador')
            .leftJoinAndSelect('venta.captador', 'captador')
            .where('venta.folio = :folio', { folio })
            .select([
            'venta',
            'paciente',
            'cliente',
            'sucursal',
            'clienteVenta',
            'medico',
            'autorizoDescuento.id',
            'autorizoDescuento.firstName',
            'autorizoDescuento.lastName',
            'cajero',
            'vendedor.comisionVendedor',
            'vendedor.firstName',
            'vendedor.lastName',
            'vendedor.profile',
            'vendedor.tipoEmpleado',
            'vendedor.id',
            'vendedor.uuid',
            'maquilador.comisionVendedor',
            'maquilador.firstName',
            'maquilador.lastName',
            'maquilador.profile',
            'maquilador.tipoEmpleado',
            'maquilador.id',
            'maquilador.uuid',
            'captador.comisionVendedor',
            'captador.firstName',
            'captador.lastName',
            'captador.profile',
            'captador.tipoEmpleado',
            'captador.id',
            'captador.uuid',
        ])
            .getOne();
        if (!venta) {
            throw new common_1.HttpException('Venta no encontrada', common_1.HttpStatus.NOT_FOUND);
        }
        const detalle = await typeorm_1.getRepository(ventasDetalle_entity_1.DetalleVentasEntity)
            .createQueryBuilder('detalle')
            .leftJoinAndSelect('detalle.servicio', 'servicio')
            .where('detalle.ventaId = :ventaId', { ventaId: venta.id })
            .getMany();
        if (!detalle) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        const pagos = await typeorm_1.getRepository(pagos_entity_1.PagoEntity)
            .createQueryBuilder('pago')
            .where('pago.ventaId = :ventaId', { ventaId: venta.id })
            .andWhere('pago.estatus = 1')
            .getMany();
        const data = {
            venta,
            detalle,
            pagos,
        };
        return data;
    }
    async updateStatus(id, estatusNuevo) {
        const ventaOriginal = await this.getById(id);
        if (!ventaOriginal) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        const updateResult = await typeorm_1.getRepository(ventas_entity_1.VentaEntity)
            .createQueryBuilder('venta')
            .update()
            .set({ estatus: estatusNuevo })
            .where({ id: ventaOriginal.id })
            .execute();
        return updateResult;
    }
    async updateVenta(id, nuevaVenta) {
        const ventaOriginal = await this.getById(id);
        if (!ventaOriginal) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        await typeorm_1.getRepository(ventas_entity_1.VentaEntity)
            .createQueryBuilder('venta')
            .update()
            .set(Object.assign({}, nuevaVenta))
            .where({ id: ventaOriginal.id })
            .execute();
        return await this.getById(id);
    }
    async updateFolioPx(ventaId, responsePx) {
        let folioPx = 'FAILED';
        if (responsePx.MuestraResult.split('|')[0] === '1') {
            folioPx = responsePx.MuestraResult.split('|')[1];
            this.logger.verbose('Venta actualizada con folio px', folioPx);
            return await typeorm_1.getRepository(ventas_entity_1.VentaEntity)
                .createQueryBuilder('venta')
                .update()
                .set({ folioPxLab: folioPx })
                .where({ id: ventaId })
                .execute();
        }
    }
    async solicitarCancelacion(ventaId, motivoCancelacion) {
        const venta = await this.getById(ventaId);
        if (!venta) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        this.eventEmitter.emit('gateway.send', {
            channel: 'tesorero_general',
            event: 'solicitudCancelacionVenta',
            data: { venta },
        });
        return await typeorm_1.getRepository(ventas_entity_1.VentaEntity).update({ id: ventaId }, {
            estatusCancelacion: estadosCancelacion_enum_1.EstadosCancelacionVenta.SOLICITUD,
            motivoCancelacion,
        });
    }
    async cancelarVenta(id, estatusCancelacion, user) {
        const venta = await this.getById(id);
        if (!venta) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        const caja = await typeorm_1.getRepository(cajas_entity_1.CajaEntity).findOne({ id: venta.cajaId });
        await typeorm_1.getRepository(ventas_entity_1.VentaEntity)
            .createQueryBuilder()
            .update()
            .set({ estatusCancelacion, usuarioCancelo: user })
            .where('id = :id', { id })
            .execute();
        if (estatusCancelacion === estadosCancelacion_enum_1.EstadosCancelacionVenta.APROBADA) {
            const pagos = await typeorm_1.getRepository(pagos_entity_1.PagoEntity)
                .createQueryBuilder('pagos')
                .leftJoin('pagos.venta', 'venta')
                .select('SUM(pagos.monto) AS totalPagos')
                .where('venta.id = :id', { id })
                .getRawOne();
            const newTotalCaja = Number(caja.total) - pagos.totalPagos;
            await typeorm_1.getRepository(cajas_entity_1.CajaEntity)
                .createQueryBuilder()
                .update()
                .set({ total: newTotalCaja })
                .where('id = :cajaId', { cajaId: caja.id })
                .execute();
            await typeorm_1.getRepository(pagos_entity_1.PagoEntity)
                .createQueryBuilder('pago')
                .leftJoin('pago.venta', 'venta')
                .update()
                .set({ estatus: 0 })
                .where('venta.id = :ventaId', { ventaId: id })
                .execute();
            this.eventEmitter.emit('gateway.send', {
                channel: 'admin',
                event: 'solicitudCancelacionAceptada',
                data: { venta },
            });
            await this.pxService.enviarVenta(await this.getventaByFolio(venta.folio), 'C');
            return this.updateStatus(id, estadosVentas_enum_1.EstadosVentas.CANCELADA);
        }
        this.eventEmitter.emit('gateway.send', {
            channel: 'admin',
            event: 'solicitudCancelacionRechazada',
            data: { venta },
        });
        return this.updateStatus(id, estadosVentas_enum_1.EstadosVentas.EN_PROCESO);
    }
    async delete(id) {
        return typeorm_1.getRepository(ventas_entity_1.VentaEntity).delete({ id });
    }
    async paginate(cajaId, options) {
        const dataQuery = typeorm_1.getRepository(ventas_entity_1.VentaEntity)
            .createQueryBuilder('venta')
            .leftJoin('venta.caja', 'caja')
            .leftJoin('venta.paciente', 'paciente')
            .leftJoin('venta.cliente', 'cliente')
            .select([
            'venta',
            'cliente.id',
            'cliente.nombre',
            'paciente.nombre',
            'paciente.apellidoPaterno',
            'paciente.apellidoMaterno',
        ])
            .where('caja.id = :cajaId', { cajaId });
        lodash_1.forIn(options.filters, (value, key) => {
            if (key === 'nombre') {
                dataQuery.andWhere('( venta.nombre LIKE :term )', {
                    term: `%${value.split(' ').join('%')}%`,
                });
            }
            else if (key === 'folio') {
                dataQuery.andWhere('( venta.folio LIKE :term )', {
                    term: `%${value.split(' ').join('%')}%`,
                });
            }
        });
        const count = await dataQuery.getCount();
        if (options.sort === undefined || !Object.keys(options.sort).length) {
            options.sort = 'venta.createdAt';
        }
        const data = await dataQuery
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
    async paginateVentasClientes(options) {
        const dataQuery = typeorm_1.getRepository(ventas_entity_1.VentaEntity)
            .createQueryBuilder('venta')
            .leftJoin('venta.paciente', 'paciente')
            .leftJoin('venta.cliente', 'cliente')
            .where('cliente.id IS NOT null')
            .select(['venta', 'cliente.id', 'cliente.nombre']);
        lodash_1.forIn(options.filters, (value, key) => {
            if (key === 'cliente') {
                dataQuery.andWhere('( cliente.nombre LIKE :term )', {
                    term: `%${value.split(' ').join('%')}%`,
                });
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
        return {
            data: data,
            skip: options.skip,
            totalItems: count,
        };
    }
    async paginateVentasPaciente(options) {
        const dataQuery = typeorm_1.getRepository(ventas_entity_1.VentaEntity)
            .createQueryBuilder('venta')
            .leftJoin('venta.paciente', 'paciente')
            .select(['venta', 'paciente.id', 'paciente.nombre']);
        lodash_1.forIn(options.filters, (value, key) => {
            if (key === 'paciente') {
                dataQuery.andWhere('( paciente.nombre LIKE :term )', {
                    term: `%${value.split(' ').join('%')}%`,
                });
            }
            if (key === 'estatus') {
                const estado = value;
                if (estado === estadosVentas_enum_1.EstadosVentas.FINALIZADA || estadosVentas_enum_1.EstadosVentas.CANCELADA) {
                    dataQuery.andWhere('(venta.estatus=:status)', {
                        status: estado,
                    });
                }
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
        return {
            data: data,
            skip: options.skip,
            totalItems: count,
        };
    }
    async getPagosByVenta(ventaId) {
        return typeorm_1.getRepository(pagos_entity_1.PagoEntity)
            .createQueryBuilder('pago')
            .leftJoin('pago.venta', 'venta')
            .select([
            'pago.id',
            'pago.monto',
            'venta.id',
            'pago.estatus',
            'pago.caja',
        ])
            .where('venta.id = :ventaId', { ventaId })
            .getMany();
    }
    async updateCredito(id, credito) {
        const venta = await typeorm_1.getRepository(ventas_entity_1.VentaEntity).findOne(id);
        const fechaLimite = moment(venta.createdAt.getDate())
            .add(credito.diasCredito, 'd')
            .format('YYYY-MM-DD');
        return await typeorm_1.getRepository(ventas_entity_1.VentaEntity)
            .createQueryBuilder()
            .update()
            .set({
            fechaLimiteCredito: fechaLimite,
            credito: credito.credito,
            diasCredito: credito.diasCredito,
        })
            .where('id=:ventaId', { ventaId: venta.id })
            .execute();
    }
    async getTicketVenta(ventaId) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        const detalleVenta = await this.getDetalleVentaById(ventaId);
        detalleVenta.pagos = detalleVenta.pagos.filter((pago) => !pago.cobranza);
        const ticket = Object.assign(Object.assign({}, detalleVenta), { sucursal: {
                direccion: {
                    calle: (_a = detalleVenta.venta.sucursal) === null || _a === void 0 ? void 0 : _a.calle,
                    numExt: (_b = detalleVenta.venta.sucursal) === null || _b === void 0 ? void 0 : _b.numExt,
                    colonia: (_c = detalleVenta.venta.sucursal) === null || _c === void 0 ? void 0 : _c.colonia,
                    municipio: (_d = detalleVenta.venta.sucursal) === null || _d === void 0 ? void 0 : _d.municipio,
                    cp: (_e = detalleVenta.venta.sucursal) === null || _e === void 0 ? void 0 : _e.cp,
                },
                telefono: (_f = detalleVenta.venta.sucursal) === null || _f === void 0 ? void 0 : _f.telefono,
                nombre: (_g = detalleVenta.venta.sucursal) === null || _g === void 0 ? void 0 : _g.nombre,
            }, cajero: `${(_j = (_h = detalleVenta.venta.caja) === null || _h === void 0 ? void 0 : _h.usuario) === null || _j === void 0 ? void 0 : _j.firstName} ${(_l = (_k = detalleVenta.venta.caja) === null || _k === void 0 ? void 0 : _k.usuario) === null || _l === void 0 ? void 0 : _l.lastName}`, fechaVenta: moment(detalleVenta.venta.fecha).format('DD-MM-YYYY hh:mm:ss'), totalVentaLetra: convertidor.NumerosALetras(detalleVenta.venta.total) });
        return ticket;
    }
    async autorizarDescuento(ventaId, data) {
        const usuario = await typeorm_1.getRepository(users_entity_1.UsersEntity).findOne({ nip: data.nip });
        if (!usuario) {
            return {
                modificado: false,
            };
        }
        const result = {
            id: usuario.id,
            firstName: usuario.firstName,
            lastName: usuario.lastName,
            maxDescuento: usuario.maxDescuento,
            modificado: false,
        };
        if (data.maxDescuento > usuario.maxDescuento) {
            return result;
        }
        await typeorm_1.getRepository(ventas_entity_1.VentaEntity)
            .createQueryBuilder()
            .update()
            .set({ autorizoDescuento: usuario, notaDescuento: data.notaDescuento })
            .where('id = :ventaId', { ventaId })
            .execute();
        result.modificado = true;
        return result;
    }
    async paginateMovil(options) {
        const dataQuery = typeorm_1.getRepository(ventas_entity_1.VentaEntity)
            .createQueryBuilder('venta')
            .leftJoin('venta.sucursal', 'sucursal')
            .leftJoin('venta.paciente', 'paciente')
            .leftJoin('venta.cliente', 'cliente')
            .leftJoin('venta.medico', 'medico')
            .select([
            'venta',
            'cliente',
            'paciente',
            'medico',
            'sucursal.id',
            'sucursal.nombre',
        ]);
        lodash_1.forIn(options.filters, (value, key) => {
            if (key === 'cliente' && value) {
                dataQuery.andWhere('( cliente.nombre LIKE :term )', {
                    term: `%${value.split(' ').join('%')}%`,
                });
            }
            else if (key === 'folio' && value) {
                dataQuery.andWhere('( venta.folio LIKE :term )', {
                    term: `%${value.split(' ').join('%')}%`,
                });
            }
        });
        const count = await dataQuery.getCount();
        if (options.sort === undefined) {
            options.sort = 'venta.fecha';
        }
        const data = await dataQuery
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
    async getPdfUrl(uuid) {
        const venta = await typeorm_1.getRepository(ventas_entity_1.VentaEntity).findOne({ where: { uuid } });
        if (!venta) {
            throw new common_1.HttpException('La venta no existe', common_1.HttpStatus.NOT_FOUND);
        }
        if (!venta.estudioPx) {
            throw new common_1.HttpException('La venta aún no cuenta con resultados.', common_1.HttpStatus.BAD_REQUEST);
        }
        return venta.folioPxLab;
    }
    getByFolioAcceso(folio, acceso) {
        return typeorm_1.getRepository(ventas_entity_1.VentaEntity).findOne({ where: { acceso, folio } });
    }
    async paginateSeguimientoVenta(user, options) {
        const dataQuery = typeorm_1.getRepository(ventas_entity_1.VentaEntity)
            .createQueryBuilder('venta')
            .leftJoin('venta.paciente', 'paciente')
            .leftJoin('venta.sucursal', 'sucursal')
            .select([
            'venta',
            'paciente.id',
            'paciente.nombre',
            'paciente.apellidoPaterno',
            'paciente.apellidoMaterno',
            'sucursal.id',
            'sucursal.nombre',
        ]);
        if (user && user.sucursal && user.sucursal.id) {
            dataQuery.where('sucursal.id =:id', { id: user.sucursal.id });
        }
        else if (user.profile === profiles_enum_1.ProfileTypes.SYSADMIN) {
            dataQuery.where('sucursal.active = :activas', { activas: true });
        }
        lodash_1.forIn(options.filters, (value, key) => {
            if (key === 'paciente') {
                dataQuery.andWhere('paciente.id = :value', {
                    value,
                });
            }
            if (key === 'fecha') {
                const fecha = value.split('*');
                const inicio = moment(fecha[0]).format('YYYY-MM-DD 00:00:00');
                const fin = moment(fecha[1]).format('YYYY-MM-DD 23:59:59');
                dataQuery.andWhere('fecha BETWEEN :inicio AND :fin', {
                    inicio: inicio,
                    fin: fin,
                });
            }
            if (key === 'pagado') {
                dataQuery.andWhere('( venta.pagado = :term )', {
                    term: value,
                });
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
        return {
            data: data,
            skip: options.skip,
            totalItems: count,
        };
    }
    async getMaquiladoresVendedoresCaptadores() {
        var _a, _b, _c;
        const fields = [
            'id',
            'uuid',
            'firstName',
            'lastName',
            'profile',
            'tipoEmpleado',
            'comisionVendedor',
        ];
        const usuarios = await typeorm_1.getRepository(users_entity_1.UsersEntity)
            .createQueryBuilder('u')
            .where('u.profile = :uProfile', { uProfile: profiles_enum_1.ProfileTypes.EMPLEADO })
            .andWhere('u.tipoEmpleado != :general', {
            general: profiles_enum_1.PerfilTipoEmpleado.GENERAL,
        })
            .getMany();
        const agrupados = lodash_1.groupBy(usuarios, 'tipoEmpleado');
        return {
            maquiladores: ((_a = agrupados[profiles_enum_1.PerfilTipoEmpleado.MAQUILADOR]) === null || _a === void 0 ? void 0 : _a.map((r) => lodash_1.pick(r, fields))) ||
                [],
            vendedores: ((_b = agrupados[profiles_enum_1.PerfilTipoEmpleado.VENDEDOR]) === null || _b === void 0 ? void 0 : _b.map((r) => lodash_1.pick(r, fields))) ||
                [],
            captadores: ((_c = agrupados[profiles_enum_1.PerfilTipoEmpleado.CAPTADOR]) === null || _c === void 0 ? void 0 : _c.map((r) => lodash_1.pick(r, fields))) ||
                [],
        };
    }
};
__decorate([
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VentasService.prototype, "removeCliente", null);
VentasService = VentasService_1 = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [pxlab_service_1.PxlabService,
        event_emitter_1.EventEmitter2])
], VentasService);
exports.VentasService = VentasService;
//# sourceMappingURL=ventas.service.js.map