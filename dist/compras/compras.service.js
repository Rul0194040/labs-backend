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
exports.ComprasService = void 0;
const EstatusCompra_enum_1 = require("./EstatusCompra.enum");
const EstatusPresupuesto_enum_1 = require("./../presupuestos/EstatusPresupuesto.enum");
const presupuestosDetalle_entity_1 = require("./../presupuestos/presupuestosDetalle.entity");
const insumo_entity_1 = require("./../insumos/insumo.entity");
const presupuesto_entity_1 = require("./../presupuestos/presupuesto.entity");
const common_1 = require("@nestjs/common");
const pagination_prime_Ng_result_dto_1 = require("../common/DTO/pagination-prime-Ng-result.dto");
const paginationPrimeNg_dto_1 = require("../common/DTO/paginationPrimeNg.dto");
const lodash_1 = require("lodash");
const typeorm_1 = require("typeorm");
const compras_entity_1 = require("./compras.entity");
const detallesCompras_entity_1 = require("./detallesCompras.entity");
const proveedores_entity_1 = require("../catalogos/proveedores/proveedores.entity");
const moment = require("moment");
const tipos_unidades_entity_1 = require("../catalogos/tipos-unidades/tipos-unidades.entity");
const get_compra_dto_1 = require("./DTO/get-compra.dto");
const sucursal_entity_1 = require("../sucursales/sucursal.entity");
const config_1 = require("@nestjs/config");
const configkeys_enum_1 = require("../common/enum/configkeys.enum");
const heimdal_service_1 = require("../common/heimdal/heimdal.service");
const email_service_1 = require("../common/services/mailer/email.service");
const tiposMovimiento_enum_1 = require("../almacen/tiposMovimiento.enum");
const almacen_service_1 = require("../almacen/almacen.service");
let ComprasService = class ComprasService {
    constructor(configService, mailSenderService, heimalService, almacenService) {
        this.configService = configService;
        this.mailSenderService = mailSenderService;
        this.heimalService = heimalService;
        this.almacenService = almacenService;
        this.notFoundMessage = 'compra no encontrada';
    }
    async create(informe) {
        let presupuesto;
        if (informe.compra.presupuestoId) {
            presupuesto = await typeorm_1.getRepository(presupuesto_entity_1.PresupuestoEntity).findOne(informe.compra.presupuestoId);
        }
        const proveedor = await typeorm_1.getRepository(proveedores_entity_1.ProveedorEntity).findOne({
            id: informe.compra.proveedorId,
        });
        if (!proveedor) {
            throw new common_1.HttpException('Proveedor no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        const compraTocreate = {
            proveedor,
            presupuesto,
            fecha: informe.compra.fecha !== null ? informe.compra.fecha : null,
            descuento: informe.compra.descuento !== null ? informe.compra.descuento : 0,
            total: informe.compra.total,
        };
        const savedCompra = await typeorm_1.getRepository(compras_entity_1.CompraEntity).save(compraTocreate);
        const savedDetalle = [];
        for (let i = 0; i < informe.detalle.length; i++) {
            const insumo = await typeorm_1.getRepository(insumo_entity_1.InsumoEntity).findOne(informe.detalle[i].insumoId);
            const subtotal = informe.detalle[i].precio * informe.detalle[i].cantidad;
            const detalleTocreate = {
                insumo,
                compra: savedCompra,
                tipoUnidad: insumo.tipoUnidad,
                descuento: informe.detalle[i].descuento !== null
                    ? informe.detalle[i].descuento
                    : 0,
                cantidad: informe.detalle[i].cantidad !== null
                    ? informe.detalle[i].cantidad
                    : 0,
                precio: informe.detalle[i].precio !== null ? informe.detalle[i].precio : 0,
                subtotal: subtotal,
                total: subtotal - (subtotal * informe.detalle[i].descuento) / 100,
            };
            const savedDetalle = await typeorm_1.getRepository(detallesCompras_entity_1.DetalleCompraEntity).save(detalleTocreate);
            delete savedDetalle.compra;
            savedDetalle[i] = savedDetalle;
        }
        const data = {
            compra: savedCompra,
            detalle: savedDetalle,
        };
        return data;
    }
    async generarOrden(orden) {
        let ordenPadre;
        const ordenesHijas = [];
        const presupuesto = await typeorm_1.getRepository(presupuesto_entity_1.PresupuestoEntity).findOne(orden.presupuestoId);
        const Detalle = await typeorm_1.getRepository(presupuestosDetalle_entity_1.PresupuestoDetalleEntity)
            .createQueryBuilder('detalle')
            .where('detalle.presupuesto=:id', {
            id: presupuesto.id,
        })
            .getMany();
        const porProveedorSeleccionado = lodash_1.groupBy(Detalle, 'proveedorSeleccionadoId');
        const keysProveedor = Object.keys(porProveedorSeleccionado);
        let totalEnPadre = 0;
        let descuentoEnPadre = 0;
        for (let idx = 0; idx < keysProveedor.length; idx++) {
            const grupoProveedor = porProveedorSeleccionado[keysProveedor[idx]];
            const ordenToCreate = {
                proveedor: await typeorm_1.getRepository(proveedores_entity_1.ProveedorEntity).findOne({
                    id: Number(keysProveedor[idx]),
                }),
                presupuesto,
                fecha: moment().format('YYYY-MM-DD H:m:s'),
                descuento: 0,
                total: 0,
            };
            ordenPadre = await typeorm_1.getRepository(compras_entity_1.CompraEntity).save(ordenToCreate);
            await typeorm_1.getRepository(compras_entity_1.CompraEntity).update(ordenPadre.id, {
                folio: `SF-${ordenPadre.id}${moment(ordenPadre.fecha).format('DDMMYYYY')}`,
            });
            for (let idj = 0; idj < grupoProveedor.length; idj++) {
                let descuentoSeleccionado = 0;
                const seleccionado = grupoProveedor[idj].proveedorSeleccionadoId;
                const prov1 = grupoProveedor[idj]['proveedor1Id'];
                const prov2 = grupoProveedor[idj]['proveedor2Id'];
                const prov3 = grupoProveedor[idj]['proveedor3Id'];
                if (seleccionado !== prov1 || prov2) {
                    descuentoSeleccionado = parseFloat(grupoProveedor[idj]['descuento3']);
                }
                else if (seleccionado !== prov2 || prov3) {
                    descuentoSeleccionado = parseFloat(grupoProveedor[idj]['descuento1']);
                }
                else {
                    descuentoSeleccionado = parseFloat(grupoProveedor[idj]['descuento2']);
                }
                const subtotal = parseFloat(grupoProveedor[idj].precioSeleccionado) *
                    parseFloat(grupoProveedor[idj].cantidad);
                const total = subtotal - (subtotal * descuentoSeleccionado) / 100 || 0;
                const insumo = await typeorm_1.getRepository(insumo_entity_1.InsumoEntity).findOne(grupoProveedor[idj].insumoId);
                const ordenDetalleToCreate = {
                    insumo,
                    compra: ordenPadre,
                    compraId: ordenPadre.id,
                    tipoUnidad: await typeorm_1.getRepository(tipos_unidades_entity_1.TipoUnidadEntity).findOne(grupoProveedor[idj].tipoUnidadId),
                    descuento: descuentoSeleccionado,
                    precio: grupoProveedor[idj].precioSeleccionado,
                    cantidad: grupoProveedor[idj].cantidad,
                    clave: ordenPadre.conClave ? insumo.clave : '',
                    subtotal: subtotal,
                    total: total,
                };
                ordenesHijas[idj] = await typeorm_1.getRepository(detallesCompras_entity_1.DetalleCompraEntity).save(ordenDetalleToCreate);
                totalEnPadre += Number(total);
                descuentoEnPadre += Number(descuentoSeleccionado);
            }
        }
        await typeorm_1.getRepository(compras_entity_1.CompraEntity)
            .createQueryBuilder('compra')
            .update()
            .set({ total: totalEnPadre })
            .where({ id: ordenPadre.id })
            .execute();
        await typeorm_1.getRepository(compras_entity_1.CompraEntity)
            .createQueryBuilder('compra')
            .update()
            .set({ descuento: descuentoEnPadre })
            .where({ id: ordenPadre.id })
            .execute();
        await typeorm_1.getRepository(presupuesto_entity_1.PresupuestoEntity)
            .createQueryBuilder('compra')
            .update()
            .set({ estatus: EstatusPresupuesto_enum_1.EstatusPresupuesto.GENERADO })
            .where({ id: presupuesto.id })
            .execute();
        return common_1.HttpStatus.OK;
    }
    async getById(id) {
        const compra = await typeorm_1.getRepository(compras_entity_1.CompraEntity)
            .createQueryBuilder('compra')
            .leftJoin('compra.proveedor', 'proveedor')
            .select(['compra', 'proveedor'])
            .where('compra.id = :id', { id: id })
            .getOne();
        if (!compra) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        const detalleCompra = await typeorm_1.getRepository(detallesCompras_entity_1.DetalleCompraEntity)
            .createQueryBuilder('detalle')
            .leftJoinAndSelect('detalle.insumo', 'insumo')
            .leftJoinAndSelect('detalle.tipoUnidad', 'tipoUnidad')
            .leftJoinAndSelect('insumo.tipoUnidad', 'tipoUnidadInsumo')
            .select([
            'detalle',
            'insumo.id',
            'insumo.nombre',
            'insumo.descripcion',
            'insumo.tipoUnidad',
            'tipoUnidadInsumo.id',
            'tipoUnidadInsumo.nombre',
            'insumo.codigo',
            'tipoUnidad.id',
            'tipoUnidad.nombre',
            'tipoUnidad.active',
        ])
            .where('detalle.compraId=:compraId', {
            compraId: compra.id,
        })
            .getMany();
        const result = {
            compra: compra,
            detalle: detalleCompra,
        };
        return result;
    }
    async importarCotizacion(id, numCotizacion, path) {
        return await typeorm_1.getRepository(compras_entity_1.CompraEntity).update(id, {
            numCotizacion: numCotizacion ? numCotizacion : 0,
            pathCotizacion: path,
        });
    }
    async descargarCotizacion(id) {
        const cotizacion = await typeorm_1.getRepository(compras_entity_1.CompraEntity).findOne({
            where: { id },
            select: ['numCotizacion', 'pathCotizacion'],
        });
        return cotizacion.pathCotizacion;
    }
    async createDetalleCompra(id, detalle) {
        const subtotal = detalle.precio * detalle.cantidad;
        const total = subtotal - (subtotal * detalle.descuento) / 100;
        const nuevoInsumo = {
            insumo: await typeorm_1.getRepository(insumo_entity_1.InsumoEntity).findOne(detalle.insumoId),
            tipoUnidad: await typeorm_1.getRepository(tipos_unidades_entity_1.TipoUnidadEntity).findOne(detalle.tipoUnidadId),
            compraId: id,
            compra: await typeorm_1.getRepository(compras_entity_1.CompraEntity).findOne(id),
            precio: detalle.precio,
            descuento: detalle.descuento,
            cantidad: detalle.cantidad,
            subtotal,
            total,
        };
        await typeorm_1.getRepository(detallesCompras_entity_1.DetalleCompraEntity).save(nuevoInsumo);
        const query = await typeorm_1.getRepository(detallesCompras_entity_1.DetalleCompraEntity)
            .createQueryBuilder('det')
            .leftJoin('det.compra', 'compra')
            .select(['det', 'compra'])
            .where('compra.id = :compraId', {
            compraId: id,
        })
            .getOne();
        await typeorm_1.getRepository(compras_entity_1.CompraEntity).update(id, {
            total: Number(query.compra.total) + total,
        });
        const retorno = await typeorm_1.getRepository(detallesCompras_entity_1.DetalleCompraEntity)
            .createQueryBuilder('det')
            .leftJoin('det.compra', 'compra')
            .leftJoin('det.insumo', 'insumo')
            .leftJoin('det.tipoUnidad', 'tipoUnidad')
            .select(['det', 'compra.id', 'insumo', 'tipoUnidad'])
            .where('compra.id=:id', {
            id,
        })
            .getMany();
        return retorno;
    }
    async UpdateCompraClave(id, clave) {
        return await typeorm_1.getRepository(compras_entity_1.CompraEntity).update(id, {
            conClave: clave,
        });
    }
    async UpdateDetalleCompra(detalleId, detalle) {
        if (detalle.precio || detalle.cantidad) {
            const query = await typeorm_1.getRepository(detallesCompras_entity_1.DetalleCompraEntity)
                .createQueryBuilder('det')
                .leftJoin('det.compra', 'compra')
                .select(['det', 'compra'])
                .where('det.id = :detId', {
                detId: detalleId,
            })
                .getOne();
            const subtotal = detalle.precio * detalle.cantidad;
            const total = subtotal - (subtotal * detalle.descuento) / 100;
            await typeorm_1.getRepository(compras_entity_1.CompraEntity).update(query.compraId, {
                total: Number(query.compra.total) - Number(query.total),
            });
            await typeorm_1.getRepository(compras_entity_1.CompraEntity).update(query.compraId, {
                total: Number(query.compra.total) + total,
            });
            await typeorm_1.getRepository(detallesCompras_entity_1.DetalleCompraEntity).update(detalleId, {
                cantidad: detalle.cantidad,
                precio: detalle.precio,
                descuento: detalle.descuento,
                insumo: await typeorm_1.getRepository(insumo_entity_1.InsumoEntity).findOne(detalle.insumoId),
                tipoUnidad: await typeorm_1.getRepository(tipos_unidades_entity_1.TipoUnidadEntity).findOne(detalle.tipoUnidadId),
                subtotal: subtotal,
                total: total,
            });
        }
        return await typeorm_1.getRepository(detallesCompras_entity_1.DetalleCompraEntity)
            .createQueryBuilder('det')
            .where('det.id = :detId', {
            detId: detalleId,
        })
            .getOne();
    }
    async altaBycompra(compraId, data, usuario) {
        const sucursalMatriz = await typeorm_1.getRepository(sucursal_entity_1.SucursalEntity)
            .createQueryBuilder()
            .where('esMatriz=:esMatriz', { esMatriz: true })
            .getOne();
        if (!sucursalMatriz) {
            throw new common_1.HttpException('La sucursal no existe', common_1.HttpStatus.NOT_FOUND);
        }
        const movimiento = {
            fecha: data.fecha,
            sucursalOrigen: sucursalMatriz.id,
            tipoMovimiento: tiposMovimiento_enum_1.TiposMovimiento.ALTA,
            notas: data.notas,
        };
        await this.almacenService.create(movimiento, data.detalle, usuario);
        await this.changeStatus(compraId, EstatusCompra_enum_1.EstatusCompra.RECIBIDO);
        const datos = {
            compra: await typeorm_1.getRepository(compras_entity_1.CompraEntity).findOne(compraId),
            detalle: await typeorm_1.getRepository(detallesCompras_entity_1.DetalleCompraEntity)
                .createQueryBuilder('det')
                .leftJoin('det.compra', 'compra')
                .select(['det'])
                .where('compra.id=:compraId AND compra.estatus =:status', {
                compraId,
                status: EstatusCompra_enum_1.EstatusCompra.RECIBIDO,
            })
                .getMany(),
        };
        return datos;
    }
    async sendToProveedor(id) {
        const destinatario = await typeorm_1.getRepository(compras_entity_1.CompraEntity)
            .createQueryBuilder('compra')
            .leftJoin('compra.proveedor', 'proveedor')
            .select(['compra', 'proveedor'])
            .where('compra.id =:id', { id })
            .getOne();
        let compra = new get_compra_dto_1.GetCompraDTO();
        compra = await this.getById(id);
        let fechaCompra = compra.compra.fecha;
        fechaCompra = moment(fechaCompra).format('DD/MM/YYYY');
        let total = 0;
        for (const det of compra.detalle) {
            total = det.cantidad * det.precio;
            total -= det.descuento;
        }
        const totalIva = total + total * 0.16;
        const bufferDoc = await this.heimalService.render('reportes/compras/ordenCompra', {
            orden: compra,
            fechaCompra: fechaCompra,
            fechaImpresion: moment().format('DD/MM/YYYY [a las] HH:mm:ss'),
            total,
            totalIva,
        }, 'pdf');
        if (destinatario) {
            this.mailSenderService.send({
                to: destinatario.proveedor.email,
                subject: 'Orden de compra - Laboratorio San Francisco',
                attachments: [
                    {
                        filename: `orden-de-compra-${compra.compra.folio}.pdf`,
                        content: Buffer.from(bufferDoc),
                        contentType: 'application/pdf',
                    },
                ],
            }, 'compras/send-insumos', {
                siteName: this.configService.get(configkeys_enum_1.ConfigKeys.SITE_NAME),
                proveedor: destinatario.proveedor.nombre,
            });
            this.changeStatus(id, EstatusCompra_enum_1.EstatusCompra.ENVIADA);
        }
        return common_1.HttpStatus.OK;
    }
    async updateStatus(id, active) {
        const theCompra = await typeorm_1.getRepository(compras_entity_1.CompraEntity)
            .createQueryBuilder('compra')
            .where('compra.id = :id', { id: id })
            .getOne();
        if (!theCompra) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        return await typeorm_1.getRepository(compras_entity_1.CompraEntity)
            .createQueryBuilder('compra')
            .update()
            .set({ active })
            .where({ id: theCompra.id })
            .execute();
    }
    async changeStatus(id, estatus) {
        const theCompra = await typeorm_1.getRepository(compras_entity_1.CompraEntity)
            .createQueryBuilder('compra')
            .where('compra.id = :id', { id: id })
            .getOne();
        if (!theCompra) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        return await typeorm_1.getRepository(compras_entity_1.CompraEntity)
            .createQueryBuilder('compra')
            .update()
            .set({ estatus })
            .where({ id: theCompra.id })
            .execute();
    }
    async delete(id) {
        return typeorm_1.getRepository(compras_entity_1.CompraEntity).delete({ id });
    }
    async deleteDetalleCompras(id) {
        return await typeorm_1.getRepository(detallesCompras_entity_1.DetalleCompraEntity).delete(id);
    }
    async paginate(options) {
        const dataQuery = typeorm_1.getRepository(compras_entity_1.CompraEntity)
            .createQueryBuilder('compra')
            .leftJoin('compra.proveedor', 'proveedor')
            .select([
            'compra',
            'proveedor.id',
            'proveedor.nombre',
            'proveedor.rfc',
            'proveedor.email',
            'proveedor.descripcion',
            'proveedor.direccion',
        ]);
        lodash_1.forIn(options.filters, (value, key) => {
            const term = `%${value.split(' ').join('%')}%`;
            if (key === 'nombre') {
                dataQuery.andWhere('proveedor.nombre like :buscar', {
                    buscar: term,
                });
            }
            if (key === 'estatus') {
                dataQuery.andWhere('compra.estatus = :estatus', {
                    estatus: value,
                });
            }
        });
        if (options.sort === undefined || !Object.keys(options.sort).length) {
            options.sort = 'compra.createdAt';
        }
        const count = await dataQuery.getCount();
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
};
ComprasService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        email_service_1.MailService,
        heimdal_service_1.HeimdalService,
        almacen_service_1.AlmacenService])
], ComprasService);
exports.ComprasService = ComprasService;
//# sourceMappingURL=compras.service.js.map