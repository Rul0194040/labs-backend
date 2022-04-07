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
exports.PresupuestosService = void 0;
const email_service_1 = require("../common/services/mailer/email.service");
const config_1 = require("@nestjs/config");
const heimdal_service_1 = require("../common/heimdal/heimdal.service");
const tipos_unidades_entity_1 = require("../catalogos/tipos-unidades/tipos-unidades.entity");
const users_entity_1 = require("../users/users.entity");
const loginIdentity_dto_1 = require("../auth/dto/loginIdentity.dto");
const presupuesto_entity_1 = require("./presupuesto.entity");
const common_1 = require("@nestjs/common");
const pagination_prime_Ng_result_dto_1 = require("../common/DTO/pagination-prime-Ng-result.dto");
const paginationPrimeNg_dto_1 = require("../common/DTO/paginationPrimeNg.dto");
const lodash_1 = require("lodash");
const typeorm_1 = require("typeorm");
const presupuestosDetalle_entity_1 = require("./presupuestosDetalle.entity");
const insumo_entity_1 = require("../insumos/insumo.entity");
const EstatusPresupuesto_enum_1 = require("./EstatusPresupuesto.enum");
const proveedores_entity_1 = require("../catalogos/proveedores/proveedores.entity");
const moment = require("moment");
const configkeys_enum_1 = require("../common/enum/configkeys.enum");
let PresupuestosService = class PresupuestosService {
    constructor(heimalService, configService, mailSenderService) {
        this.heimalService = heimalService;
        this.configService = configService;
        this.mailSenderService = mailSenderService;
        this.notFoundMessage = 'presupuesto no encontrada';
    }
    async create(data, user) {
        const usuario = await typeorm_1.getRepository(users_entity_1.UsersEntity).findOne(user.id);
        const presupuestoTocreate = {
            usuario,
            fecha: moment().format('DD/MM/YYYY'),
        };
        const savedPresupuesto = await typeorm_1.getRepository(presupuesto_entity_1.PresupuestoEntity).save(presupuestoTocreate);
        const savedDetalle = [];
        for (let i = 0; i < data.detalle.length; i++) {
            const tipoUnidad = await typeorm_1.getRepository(tipos_unidades_entity_1.TipoUnidadEntity).findOne(data.detalle[i].tipoUnidadId);
            const insumo = await typeorm_1.getRepository(insumo_entity_1.InsumoEntity).findOne(data.detalle[i].insumoId);
            const detalleTocreate = {
                presupuestoId: savedPresupuesto.id,
                insumo,
                tipoUnidad,
                cantidad: data.detalle[i].cantidad,
            };
            savedDetalle[i] = await typeorm_1.getRepository(presupuestosDetalle_entity_1.PresupuestoDetalleEntity).save(detalleTocreate);
        }
        const result = {
            presupuesto: savedPresupuesto,
            detalle: savedDetalle,
        };
        return result;
    }
    async getById(id) {
        const presupuesto = await typeorm_1.getRepository(presupuesto_entity_1.PresupuestoEntity)
            .createQueryBuilder('presupuesto')
            .where('presupuesto.id = :id', { id: id })
            .getOne();
        if (!presupuesto) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        const detallePresupuesto = await typeorm_1.getRepository(presupuestosDetalle_entity_1.PresupuestoDetalleEntity)
            .createQueryBuilder('detalle')
            .leftJoin('detalle.presupuesto', 'presupuesto')
            .leftJoin('detalle.proveedor1', 'proveedor1')
            .leftJoin('detalle.proveedor2', 'proveedor2')
            .leftJoin('detalle.proveedor3', 'proveedor3')
            .leftJoin('detalle.proveedorSeleccionado', 'proveedorSeleccionado')
            .leftJoin('detalle.insumo', 'insumo')
            .leftJoin('detalle.tipoUnidad', 'tipoUnidad')
            .select([
            'detalle.id',
            'proveedor1.id',
            'proveedor1.nombre',
            'proveedor2.id',
            'proveedor2.nombre',
            'proveedor3.id',
            'proveedor3.nombre',
            'proveedorSeleccionado.id',
            'proveedorSeleccionado.nombre',
            'proveedorSeleccionado.email',
            'detalle.precioSeleccionado',
            'detalle.fechaPromesa',
            'detalle.descuento1',
            'detalle.descuento2',
            'detalle.descuento3',
            'detalle.precio1',
            'detalle.precio2',
            'detalle.precio3',
            'detalle.insumoId',
            'detalle.tipoUnidadId',
            'detalle.cantidad',
            'tipoUnidad.id',
            'tipoUnidad.nombre',
            'insumo.id',
            'insumo.nombre',
        ])
            .where('presupuesto.id=:presupuestoId', {
            presupuestoId: presupuesto.id,
        })
            .getMany();
        if (!detallePresupuesto) {
            throw new common_1.HttpException('detalle no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        const result = {
            presupuesto: presupuesto,
            detalle: detallePresupuesto,
        };
        return result;
    }
    async sendToProveedor(id, proveedorSeleccionadoId) {
        const presupuesto = await typeorm_1.getRepository(presupuesto_entity_1.PresupuestoEntity).findOne(id);
        if (!presupuesto) {
            throw new common_1.HttpException('No hay registros para el reporte.', common_1.HttpStatus.NOT_FOUND);
        }
        const Detalle = await typeorm_1.getRepository(presupuestosDetalle_entity_1.PresupuestoDetalleEntity)
            .createQueryBuilder('detalle')
            .leftJoinAndSelect('detalle.insumo', 'insumo')
            .where('detalle.presupuestoId=:id', {
            id: presupuesto.id,
        })
            .getMany();
        let totalPresupuesto = 0;
        for (const det of Detalle) {
            totalPresupuesto += det.precioSeleccionado;
        }
        const totalIva = totalPresupuesto + totalPresupuesto * 0.16;
        const proveedor = await typeorm_1.getRepository(proveedores_entity_1.ProveedorEntity).findOne(proveedorSeleccionadoId);
        let fechaPresupuesto = presupuesto.fecha;
        fechaPresupuesto = moment(fechaPresupuesto).format('DD/MM/YYYY');
        const formato = {
            presupuesto: presupuesto,
            detalle: Detalle,
        };
        const bufferDoc = await this.heimalService.render('reportes/presupuestos/presupuesto', {
            formatoPresupuesto: formato,
            fechaPresupuesto,
            proveedor,
            fechaImpresion: moment().format('DD/MM/YYYY [a las] HH:mm:ss'),
            totalPresupuesto: totalPresupuesto,
            totalIva,
        }, 'pdf');
        if (proveedor) {
            this.mailSenderService.send({
                to: proveedor.email,
                subject: 'Presupuesto de compra - Laboratorio San Francisco',
                attachments: [
                    {
                        filename: `presupuesto-de-compra-${presupuesto.id}.pdf`,
                        content: Buffer.from(bufferDoc),
                        contentType: 'application/pdf',
                    },
                ],
            }, 'presupuesto/send-pres', {
                siteName: this.configService.get(configkeys_enum_1.ConfigKeys.SITE_NAME),
                proveedor: proveedor.nombre,
            });
        }
        return common_1.HttpStatus.OK;
    }
    async updateDetallePresupuesto(id, presupuesto) {
        const presupuestoDetail = await typeorm_1.getRepository(presupuestosDetalle_entity_1.PresupuestoDetalleEntity).findOne(id);
        if (!presupuestoDetail) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        const presupuestoFather = await typeorm_1.getRepository(presupuesto_entity_1.PresupuestoEntity).findOne(presupuestoDetail.presupuestoId);
        if (presupuestoFather.estatus !== 'B') {
            throw new common_1.HttpException('el presupuesto no es borrador', common_1.HttpStatus.BAD_REQUEST);
        }
        return await typeorm_1.getRepository(presupuestosDetalle_entity_1.PresupuestoDetalleEntity).update({ id }, presupuesto);
    }
    async UpdateInsumoDetallePresupuesto(id, presupuesto) {
        const presupuestoFather = await typeorm_1.getRepository(presupuesto_entity_1.PresupuestoEntity).findOne(id);
        if (presupuestoFather.estatus !== EstatusPresupuesto_enum_1.EstatusPresupuesto.BORRADOR) {
            throw new common_1.HttpException('el presupuesto no es borrador', common_1.HttpStatus.BAD_REQUEST);
        }
        const insumo = await typeorm_1.getRepository(insumo_entity_1.InsumoEntity).findOne(presupuesto.insumoId);
        const tipoUnidad = await typeorm_1.getRepository(tipos_unidades_entity_1.TipoUnidadEntity).findOne(presupuesto.tipoUnidadId);
        const proveedor1 = await typeorm_1.getRepository(proveedores_entity_1.ProveedorEntity).findOne({
            id: presupuesto.proveedor1Id,
        });
        let proveedor2 = null;
        let proveedor3 = null;
        let proveedorSeleccionado = null;
        if (presupuesto.proveedor2Id) {
            proveedor2 = await typeorm_1.getRepository(proveedores_entity_1.ProveedorEntity).findOne({
                id: presupuesto.proveedor2Id,
            });
        }
        if (presupuesto.proveedor3Id) {
            proveedor3 = await typeorm_1.getRepository(proveedores_entity_1.ProveedorEntity).findOne({
                id: presupuesto.proveedor3Id,
            });
        }
        if (presupuesto.proveedorSeleccionadoId) {
            proveedorSeleccionado = await typeorm_1.getRepository(proveedores_entity_1.ProveedorEntity).findOne({
                id: presupuesto.proveedorSeleccionadoId,
            });
        }
        const detalleTocreate = {
            presupuestoId: presupuestoFather.id,
            proveedor1,
            proveedor2,
            proveedor3,
            precio1: presupuesto.precio1,
            precio2: presupuesto.precio2,
            precio3: presupuesto.precio3,
            precioSeleccionado: presupuesto.precioSeleccionado,
            proveedorSeleccionado,
            insumo,
            cantidad: presupuesto.cantidad,
            tipoUnidad,
            fechaPromesa: presupuesto.fechaPromesa ? presupuesto.fechaPromesa : null,
        };
        return await typeorm_1.getRepository(presupuestosDetalle_entity_1.PresupuestoDetalleEntity).save(detalleTocreate);
    }
    async updateStatus(id, estatus) {
        const thePresupuesto = await typeorm_1.getRepository(presupuesto_entity_1.PresupuestoEntity)
            .createQueryBuilder('presupuesto')
            .where('presupuesto.id = :id', { id: id })
            .getOne();
        if (!thePresupuesto) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        if (!thePresupuesto) {
            throw new common_1.HttpException(this.notFoundMessage, common_1.HttpStatus.NOT_FOUND);
        }
        return await typeorm_1.getRepository(presupuesto_entity_1.PresupuestoEntity)
            .createQueryBuilder('presupuesto')
            .update()
            .set({ estatus })
            .where({ id: thePresupuesto.id })
            .execute();
    }
    async deletePresupuestoDetalle(id) {
        return await typeorm_1.getRepository(presupuestosDetalle_entity_1.PresupuestoDetalleEntity).delete(id);
    }
    async paginate(options) {
        const dataQuery = typeorm_1.getRepository(presupuesto_entity_1.PresupuestoEntity).createQueryBuilder('presupuesto');
        lodash_1.forIn(options.filters, (value, key) => {
            if (key === 'nombre') {
                dataQuery.orWhere('presupuesto.id like :term', {
                    term: `%${value.split(' ').join('%')}%`,
                });
                dataQuery.orWhere('presupuesto.fecha like :term', {
                    term: `%${value.split(' ').join('%')}%`,
                });
                dataQuery.orWhere('presupuesto.estatus like :term', {
                    term: `%${value.split(' ').join('%')}%`,
                });
            }
        });
        const count = await dataQuery.getCount();
        if (options.sort === undefined || !Object.keys(options.sort).length) {
            options.sort = 'presupuesto.createdAt';
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
};
PresupuestosService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [heimdal_service_1.HeimdalService,
        config_1.ConfigService,
        email_service_1.MailService])
], PresupuestosService);
exports.PresupuestosService = PresupuestosService;
//# sourceMappingURL=presupuestos.service.js.map