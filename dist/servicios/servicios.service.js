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
var ServiciosService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiciosService = void 0;
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const servicio_entity_1 = require("./servicio.entity");
const paginationPrimeNg_dto_1 = require("../common/DTO/paginationPrimeNg.dto");
const class_transformer_1 = require("class-transformer");
const servicios_insumos_entity_1 = require("./servicios-insumos.entity");
const insumo_entity_1 = require("../insumos/insumo.entity");
const lodash_1 = require("lodash");
const grupo_servicio_entity_1 = require("../catalogos/grupos-servicios/grupo-servicio.entity");
const tipos_muestras_entity_1 = require("../catalogos/tipos-muestras/tipos-muestras.entity");
const tipos_unidades_entity_1 = require("../catalogos/tipos-unidades/tipos-unidades.entity");
const pxlab_service_1 = require("../pxlab/pxlab.service");
const readXlsxFile = require("read-excel-file/node");
const logger_1 = require("../logger");
let ServiciosService = ServiciosService_1 = class ServiciosService {
    constructor(pxService) {
        this.pxService = pxService;
        this.logger = new logger_1.MyLogger(ServiciosService_1.name);
    }
    async create(servicio) {
        const servicioToCreate = class_transformer_1.plainToClass(servicio_entity_1.ServicioEntity, servicio);
        const servicioCreated = await typeorm_1.getRepository(servicio_entity_1.ServicioEntity).save(servicioToCreate);
        const clave = '9' + servicioCreated.id.toString().padStart(6, '0');
        await typeorm_1.getRepository(servicio_entity_1.ServicioEntity).update(servicioCreated.id, {
            clave,
        });
        servicioCreated.clave = clave;
        this.pxService.enviarEstudio(clave, servicioCreated.nombre);
        return servicioCreated;
    }
    async getById(id) {
        const servicio = typeorm_1.getRepository(servicio_entity_1.ServicioEntity)
            .createQueryBuilder('servicio')
            .leftJoinAndSelect('servicio.tipoMuestra', 'tipoMuestra')
            .leftJoinAndSelect('servicio.tipoUnidad', 'tipoUnidad')
            .leftJoinAndSelect('servicio.grupoServicio', 'grupoServicio')
            .where('servicio.id = :servicioId', { servicioId: id })
            .getOne();
        if (!servicio) {
            throw new common_1.HttpException('Este servicio no existe', common_1.HttpStatus.NOT_FOUND);
        }
        return servicio;
    }
    async update(id, data) {
        const resultUpdate = await typeorm_1.getRepository(servicio_entity_1.ServicioEntity)
            .createQueryBuilder()
            .update()
            .set({
            clave: data.clave,
            nombre: data.nombre,
            precio: data.precio,
            precio2: data.precio2,
            precio3: data.precio3,
            realizaEstudioEn: data.realizaEstudioEn,
            recomendaciones: data.recomendaciones,
            muestrasRequeridas: data.muestrasRequeridas,
            sinonimo1: data.sinonimo1,
            sinonimo2: data.sinonimo2,
            precioMaquila: data.precioMaquila,
        })
            .where('id=:id', { id })
            .execute();
        if (resultUpdate.affected) {
            this.pxService.enviarEstudio(data.clave, data.nombre, false);
        }
        return resultUpdate;
    }
    async updateServiceCatalogs(id, catalogs) {
        let grupoServicio = null;
        let tipoMuestra = null;
        let tipoUnidad = null;
        const updateCatalogs = {};
        if (catalogs.grupoServicio) {
            grupoServicio = await typeorm_1.getRepository(grupo_servicio_entity_1.GrupoServicioEntity).findOne({
                id: catalogs.grupoServicio,
            });
            if (!grupoServicio)
                throw new common_1.HttpException('Grupo de servicios no encontrado', common_1.HttpStatus.NOT_FOUND);
            updateCatalogs.grupoServicio = grupoServicio;
        }
        if (catalogs.tipoMuestra) {
            tipoMuestra = await typeorm_1.getRepository(tipos_muestras_entity_1.TipoMuestraEntity).findOne({
                id: catalogs.tipoMuestra,
            });
            if (!tipoMuestra)
                throw new common_1.HttpException('tipo de muestra no encontrado', common_1.HttpStatus.NOT_FOUND);
            updateCatalogs.tipoMuestra = tipoMuestra;
        }
        if (catalogs.tipoUnidad) {
            tipoUnidad = await typeorm_1.getRepository(tipos_unidades_entity_1.TipoUnidadEntity).findOne({
                id: catalogs.tipoUnidad,
            });
            if (!tipoUnidad)
                throw new common_1.HttpException('tipo de unidad no encontrado', common_1.HttpStatus.NOT_FOUND);
            updateCatalogs.tipoUnidad = tipoUnidad;
        }
        return await typeorm_1.getRepository(servicio_entity_1.ServicioEntity)
            .createQueryBuilder()
            .update()
            .set(updateCatalogs)
            .where('id=:id', { id })
            .execute();
    }
    async delete(id) {
        return await typeorm_1.getRepository(servicio_entity_1.ServicioEntity).delete({ id });
    }
    async paginate(options) {
        const dataQuery = typeorm_1.getRepository(servicio_entity_1.ServicioEntity)
            .createQueryBuilder('servicio')
            .leftJoinAndSelect('servicio.grupoServicio', 'grupoServicio')
            .leftJoinAndSelect('servicio.tipoMuestra', 'tipoMuestra')
            .leftJoinAndSelect('servicio.tipoUnidad', 'tipoUnidad')
            .select([
            'servicio',
            'grupoServicio.id',
            'grupoServicio.nombre',
            'tipoMuestra.id',
            'tipoMuestra.nombre',
            'tipoUnidad.id',
            'tipoUnidad.nombre',
        ]);
        lodash_1.forIn(options.filters, (value, key) => {
            if (key === 'nombre') {
                dataQuery.andWhere('( servicio.nombre LIKE :term )', {
                    term: `%${value.split(' ').join('%')}%`,
                });
                dataQuery.orWhere('( servicio.sinonimo1 LIKE :term )', {
                    term: `%${value.split(' ').join('%')}%`,
                });
                dataQuery.orWhere('( servicio.sinonimo2 LIKE :term )', {
                    term: `%${value.split(' ').join('%')}%`,
                });
                dataQuery.orWhere('( servicio.clave LIKE :term )', {
                    term: `%${value.split(' ').join('%')}%`,
                });
            }
        });
        const count = await dataQuery.getCount();
        const data = await dataQuery
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
    async agregarInsumo(idServicio, insumosToAdd) {
        const servicio = await typeorm_1.getRepository(servicio_entity_1.ServicioEntity)
            .createQueryBuilder()
            .where('id=:id', {
            id: idServicio,
        })
            .getOne();
        if (!servicio) {
            throw new common_1.HttpException('El servicio no existe', common_1.HttpStatus.NOT_FOUND);
        }
        const insumo = await typeorm_1.getRepository(insumo_entity_1.InsumoEntity)
            .createQueryBuilder()
            .where('id=:id', {
            id: insumosToAdd.insumo,
        })
            .getOne();
        if (!insumo) {
            throw new common_1.HttpException('Ese insumo no existe', common_1.HttpStatus.NOT_FOUND);
        }
        const existeServicioInsumo = await typeorm_1.getRepository(servicios_insumos_entity_1.ServiciosInsumosEntity)
            .createQueryBuilder('serviciosInsumos')
            .leftJoin('serviciosInsumos.insumo', 'insumo')
            .leftJoin('serviciosInsumos.servicio', 'servicio')
            .where('insumo.id=:insumoId', { insumoId: insumo.id })
            .andWhere('servicio.id=:servicioId', { servicioId: servicio.id })
            .getOne();
        if (existeServicioInsumo) {
            throw new common_1.HttpException('El insumo ya existe en el servicio', common_1.HttpStatus.BAD_REQUEST);
        }
        const InsumoToCreate = {
            servicio: servicio,
            insumo: insumo,
            cantidad: insumosToAdd.cantidad,
        };
        return typeorm_1.getRepository(servicios_insumos_entity_1.ServiciosInsumosEntity).save(InsumoToCreate);
    }
    async quitarInsumo(servicioInsumoId) {
        const query = await typeorm_1.getRepository(servicios_insumos_entity_1.ServiciosInsumosEntity)
            .createQueryBuilder()
            .where('id=:servicioInsumoId', { servicioInsumoId })
            .getOne();
        if (!query) {
            throw new common_1.HttpException('Este servicio-insumo no existe', common_1.HttpStatus.NOT_FOUND);
        }
        return await typeorm_1.getRepository(servicios_insumos_entity_1.ServiciosInsumosEntity).delete(query.id);
    }
    async InsumoByServicio(servicioId) {
        const query = await typeorm_1.getRepository(servicios_insumos_entity_1.ServiciosInsumosEntity)
            .createQueryBuilder('servicioInsumo')
            .leftJoinAndSelect('servicioInsumo.servicio', 'servicio')
            .leftJoinAndSelect('servicioInsumo.insumo', 'insumo')
            .where('servicio.id=:id', { id: servicioId })
            .getOne();
        if (!query) {
            throw new common_1.HttpException('Este servicio-insumo no existe', common_1.HttpStatus.NOT_FOUND);
        }
        return query;
    }
    async paginateServicioInsumo(idServicio, options) {
        const dataQuery = typeorm_1.getRepository(servicios_insumos_entity_1.ServiciosInsumosEntity)
            .createQueryBuilder('insumoservicio')
            .leftJoin('insumoservicio.servicio', 'servicio')
            .leftJoin('insumoservicio.insumo', 'insumo')
            .leftJoin('insumo.tipoInsumo', 'tipoInsumo')
            .leftJoin('insumo.tipoUnidad', 'tipoUnidad')
            .select([
            'insumoservicio',
            'insumo',
            'tipoInsumo.id',
            'tipoInsumo.nombre',
            'tipoUnidad',
        ])
            .where('servicio.id=:idServicio', { idServicio: idServicio });
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
    async importarServiciosXLS(xlsFile) {
        this.logger.verbose('Abriendo archivo ' + xlsFile);
        const rows = await readXlsxFile(xlsFile, { dateFormat: 'MM/DD/YY' });
        this.logger.verbose('Encontrados ' + rows.length + ' servicios');
        for (let r = 1; r <= rows.length - 1; r++) {
            const row = rows[r];
            const clave = row[0] ? row[0].toString() : null;
            const nombre = row[1] ? row[1] : null;
            const sinonimo1 = row[2] ? row[2] : null;
            const sinonimo2 = row[3] ? row[3] : null;
            const tipoMuestra = row[4] ? row[4] : null;
            const tiempo = row[5] ? row[5] : null;
            const precio1 = row[8] ? row[8] : 0;
            const precioMaquila = row[9] ? row[9] : 0;
            const precio3 = row[10] ? row[10] : 0;
            if (clave && nombre) {
                const servicio = await typeorm_1.getRepository(servicio_entity_1.ServicioEntity).findOne({ clave });
                if (!servicio) {
                    const servicioCreado = await typeorm_1.getRepository(servicio_entity_1.ServicioEntity).save({
                        clave,
                        nombre,
                        sinonimo1,
                        sinonimo2,
                        tiempo,
                        precio: precio1,
                        precio2: precio1,
                        precioMaquila: precioMaquila,
                        precio3: precio3,
                    });
                    this.logger.verbose('+++Creado: ' + servicioCreado.nombre);
                }
                else {
                    await typeorm_1.getRepository(servicio_entity_1.ServicioEntity).update({ clave }, {
                        nombre,
                        sinonimo1,
                        sinonimo2,
                        tipoMuestra,
                        tiempo,
                        precio: precio1,
                        precio2: precio1,
                        precioMaquila: precioMaquila,
                        precio3: precio3,
                    });
                }
            }
        }
        return rows;
    }
};
ServiciosService = ServiciosService_1 = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [pxlab_service_1.PxlabService])
], ServiciosService);
exports.ServiciosService = ServiciosService;
//# sourceMappingURL=servicios.service.js.map