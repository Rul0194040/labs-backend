import { DetalleCompraDTO } from './DTO/detalle-compra.dto';
import { EstatusCompra } from './EstatusCompra.enum';
import { EstatusPresupuesto } from './../presupuestos/EstatusPresupuesto.enum';
import { PresupuestoDetalleEntity } from './../presupuestos/presupuestosDetalle.entity';
import { InformeResultDTO } from './DTO/informe-result.dto';
import { InsumoEntity } from './../insumos/insumo.entity';
import { PresupuestoEntity } from './../presupuestos/presupuesto.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { forIn, groupBy } from 'lodash';
import { getRepository, UpdateResult, DeleteResult } from 'typeorm';
import { CompraEntity } from './compras.entity';
import { InformeCompraDTO } from './DTO/informe-compra.dto';
import { DetalleCompraEntity } from './detallesCompras.entity';
import { ProveedorEntity } from '../catalogos/proveedores/proveedores.entity';
import { GenerarOrdenDTO } from './DTO/generar-orden.dto';
import * as moment from 'moment';
import { TipoUnidadEntity } from '@sanfrancisco/catalogos/tipos-unidades/tipos-unidades.entity';
import { GetCompraDTO } from './DTO/get-compra.dto';
import { AgregarInsumoDTO } from './DTO/agregarInsumoDetalle.dto';
import { AltaByCompraDTO } from './DTO/altaBycompra.dto';
import { SucursalEntity } from '@sanfrancisco/sucursales/sucursal.entity';
import { ConfigService } from '@nestjs/config';
import { ConfigKeys } from '@sanfrancisco/common/enum/configkeys.enum';
import { HeimdalService } from '@sanfrancisco/common/heimdal/heimdal.service';
import { MailService } from '@sanfrancisco/common/services/mailer/email.service';
import { TiposMovimiento } from '../almacen/tiposMovimiento.enum';
import { CreateMovimientoDTO } from '../almacen/DTOs/create-movimiento.dto';
import { AlmacenService } from '../almacen/almacen.service';
import { LoginIdentityDTO } from '../auth/dto/loginIdentity.dto';

@Injectable()
export class ComprasService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailSenderService: MailService,
    private readonly heimalService: HeimdalService,
    private readonly almacenService: AlmacenService,
  ) {}
  private readonly notFoundMessage = 'compra no encontrada';

  async create(informe: InformeCompraDTO): Promise<InformeResultDTO> {
    let presupuesto: PresupuestoEntity;

    if (informe.compra.presupuestoId) {
      presupuesto = await getRepository(PresupuestoEntity).findOne(
        informe.compra.presupuestoId,
      );
    }

    const proveedor = await getRepository(ProveedorEntity).findOne({
      id: informe.compra.proveedorId,
    });

    if (!proveedor) {
      throw new HttpException('Proveedor no encontrado', HttpStatus.NOT_FOUND);
    }

    const compraTocreate = {
      proveedor,
      presupuesto,
      fecha: informe.compra.fecha !== null ? informe.compra.fecha : null,
      descuento:
        informe.compra.descuento !== null ? informe.compra.descuento : 0,
      total: informe.compra.total,
    };

    const savedCompra = await getRepository(CompraEntity).save(compraTocreate);

    const savedDetalle = [];

    for (let i = 0; i < informe.detalle.length; i++) {
      const insumo = await getRepository(InsumoEntity).findOne(
        informe.detalle[i].insumoId,
      );

      const subtotal = informe.detalle[i].precio * informe.detalle[i].cantidad;

      const detalleTocreate = {
        insumo,
        compra: savedCompra,
        tipoUnidad: insumo.tipoUnidad,
        descuento:
          informe.detalle[i].descuento !== null
            ? informe.detalle[i].descuento
            : 0,
        cantidad:
          informe.detalle[i].cantidad !== null
            ? informe.detalle[i].cantidad
            : 0,
        precio:
          informe.detalle[i].precio !== null ? informe.detalle[i].precio : 0,
        subtotal: subtotal,
        total: subtotal - (subtotal * informe.detalle[i].descuento) / 100,
      };

      const savedDetalle = await getRepository(DetalleCompraEntity).save(
        detalleTocreate,
      );
      delete savedDetalle.compra;
      savedDetalle[i] = savedDetalle;
    }

    const data: InformeResultDTO = {
      compra: savedCompra,
      detalle: savedDetalle,
    };

    return data;
  }

  async generarOrden(orden: GenerarOrdenDTO): Promise<HttpStatus> {
    let ordenPadre: CompraEntity;
    const ordenesHijas = [];
    //Buscamos el presupuesto
    const presupuesto = await getRepository(PresupuestoEntity).findOne(
      orden.presupuestoId,
    );
    //Buscamos el detalle de ese presupuesto
    const Detalle: any = await getRepository(PresupuestoDetalleEntity)
      .createQueryBuilder('detalle')
      .where('detalle.presupuesto=:id', {
        id: presupuesto.id,
      })
      .getMany();
    //Lo agrupamos por los diferentes proveedores seleccionados
    const porProveedorSeleccionado = groupBy(
      Detalle,
      'proveedorSeleccionadoId',
    );

    const keysProveedor = Object.keys(porProveedorSeleccionado);
    let totalEnPadre = 0;
    let descuentoEnPadre = 0;

    for (let idx = 0; idx < keysProveedor.length; idx++) {
      const grupoProveedor = porProveedorSeleccionado[keysProveedor[idx]];

      const ordenToCreate = {
        proveedor: await getRepository(ProveedorEntity).findOne({
          id: Number(keysProveedor[idx]),
        }),
        presupuesto,
        fecha: moment().format('YYYY-MM-DD H:m:s'),
        descuento: 0,
        total: 0,
      };
      ordenPadre = await getRepository(CompraEntity).save(ordenToCreate);
      await getRepository(CompraEntity).update(ordenPadre.id, {
        folio: `SF-${ordenPadre.id}${moment(ordenPadre.fecha).format(
          'DDMMYYYY',
        )}`,
      });

      for (let idj = 0; idj < grupoProveedor.length; idj++) {
        let descuentoSeleccionado = 0;
        const seleccionado = grupoProveedor[idj].proveedorSeleccionadoId;
        const prov1 = grupoProveedor[idj]['proveedor1Id'];
        const prov2 = grupoProveedor[idj]['proveedor2Id'];
        const prov3 = grupoProveedor[idj]['proveedor3Id'];
        if (seleccionado !== prov1 || prov2) {
          descuentoSeleccionado = parseFloat(grupoProveedor[idj]['descuento3']);
        } else if (seleccionado !== prov2 || prov3) {
          descuentoSeleccionado = parseFloat(grupoProveedor[idj]['descuento1']);
        } else {
          descuentoSeleccionado = parseFloat(grupoProveedor[idj]['descuento2']);
        }
        //Generamos una nueva variable subtotal
        const subtotal: number =
          parseFloat(grupoProveedor[idj].precioSeleccionado) *
          parseFloat(grupoProveedor[idj].cantidad);

        const total: number =
          subtotal - (subtotal * descuentoSeleccionado) / 100 || 0;

        const insumo = await getRepository(InsumoEntity).findOne(
          grupoProveedor[idj].insumoId,
        );

        //Generamos las ordenes hijas que son DetalleCompraEntity
        const ordenDetalleToCreate = {
          insumo,
          compra: ordenPadre,
          compraId: ordenPadre.id,
          tipoUnidad: await getRepository(TipoUnidadEntity).findOne(
            grupoProveedor[idj].tipoUnidadId,
          ),
          descuento: descuentoSeleccionado,
          precio: grupoProveedor[idj].precioSeleccionado,
          cantidad: grupoProveedor[idj].cantidad,
          clave: ordenPadre.conClave ? insumo.clave : '',
          subtotal: subtotal,
          total: total,
        };
        //Guardamos las ordenes hijas
        ordenesHijas[idj] = await getRepository(DetalleCompraEntity).save(
          ordenDetalleToCreate,
        );

        totalEnPadre += Number(total);
        descuentoEnPadre += Number(descuentoSeleccionado);
      }
    }

    //Al final de los for actualizamos el nuevo total luego de sumas todas las ordenes hija
    await getRepository(CompraEntity)
      .createQueryBuilder('compra')
      .update()
      .set({ total: totalEnPadre })
      .where({ id: ordenPadre.id })
      .execute();

    //Al final de los for actualizamos el nuevo descuento luego de sumar las ordenes hijas
    await getRepository(CompraEntity)
      .createQueryBuilder('compra')
      .update()
      .set({ descuento: descuentoEnPadre })
      .where({ id: ordenPadre.id })
      .execute();

    //actualizar el presupuesto a generado
    await getRepository(PresupuestoEntity)
      .createQueryBuilder('compra')
      .update()
      .set({ estatus: EstatusPresupuesto.GENERADO })
      .where({ id: presupuesto.id })
      .execute();

    return HttpStatus.OK;
  }

  async getById(id: number): Promise<GetCompraDTO> {
    const compra = await getRepository(CompraEntity)
      .createQueryBuilder('compra')
      .leftJoin('compra.proveedor', 'proveedor')
      .select(['compra', 'proveedor'])
      .where('compra.id = :id', { id: id })
      .getOne();

    if (!compra) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }
    const detalleCompra = await getRepository(DetalleCompraEntity)
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
    const result: GetCompraDTO = {
      compra: compra,
      detalle: detalleCompra,
    };
    return result;
  }

  async importarCotizacion(
    id: number,
    numCotizacion: number,
    path: string,
  ): Promise<UpdateResult> {
    return await getRepository(CompraEntity).update(id, {
      numCotizacion: numCotizacion ? numCotizacion : 0,
      pathCotizacion: path,
    });
  }

  async descargarCotizacion(id: number): Promise<string> {
    const cotizacion = await getRepository(CompraEntity).findOne({
      where: { id },
      select: ['numCotizacion', 'pathCotizacion'],
    });

    return cotizacion.pathCotizacion;
  }

  async createDetalleCompra(
    id: number,
    detalle: AgregarInsumoDTO,
  ): Promise<DetalleCompraEntity[]> {
    const subtotal = detalle.precio * detalle.cantidad;
    const total = subtotal - (subtotal * detalle.descuento) / 100;

    const nuevoInsumo = {
      insumo: await getRepository(InsumoEntity).findOne(detalle.insumoId),
      tipoUnidad: await getRepository(TipoUnidadEntity).findOne(
        detalle.tipoUnidadId,
      ),
      compraId: id,
      compra: await getRepository(CompraEntity).findOne(id),
      precio: detalle.precio,
      descuento: detalle.descuento,
      cantidad: detalle.cantidad,
      subtotal,
      total,
    };
    await getRepository(DetalleCompraEntity).save(nuevoInsumo);

    const query = await getRepository(DetalleCompraEntity)
      .createQueryBuilder('det')
      .leftJoin('det.compra', 'compra')
      .select(['det', 'compra'])
      .where('compra.id = :compraId', {
        compraId: id,
      })
      .getOne();
    await getRepository(CompraEntity).update(id, {
      total: Number(query.compra.total) + total,
    });

    const retorno = await getRepository(DetalleCompraEntity)
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

  async UpdateCompraClave(id: number, clave: boolean): Promise<UpdateResult> {
    return await getRepository(CompraEntity).update(id, {
      conClave: clave,
    });
  }

  async UpdateDetalleCompra(
    detalleId: number,
    detalle: DetalleCompraDTO,
  ): Promise<DetalleCompraEntity> {
    if (detalle.precio || detalle.cantidad) {
      const query = await getRepository(DetalleCompraEntity)
        .createQueryBuilder('det')
        .leftJoin('det.compra', 'compra')
        .select(['det', 'compra'])
        .where('det.id = :detId', {
          detId: detalleId,
        })
        .getOne();

      const subtotal = detalle.precio * detalle.cantidad;
      const total = subtotal - (subtotal * detalle.descuento) / 100;

      await getRepository(CompraEntity).update(query.compraId, {
        total: Number(query.compra.total) - Number(query.total),
      });

      await getRepository(CompraEntity).update(query.compraId, {
        total: Number(query.compra.total) + total,
      });

      await getRepository(DetalleCompraEntity).update(detalleId, {
        cantidad: detalle.cantidad,
        precio: detalle.precio,
        descuento: detalle.descuento,
        insumo: await getRepository(InsumoEntity).findOne(detalle.insumoId),
        tipoUnidad: await getRepository(TipoUnidadEntity).findOne(
          detalle.tipoUnidadId,
        ),
        subtotal: subtotal,
        total: total,
      });
    }

    return await getRepository(DetalleCompraEntity)
      .createQueryBuilder('det')
      .where('det.id = :detId', {
        detId: detalleId,
      })
      .getOne();
  }

  async altaBycompra(
    compraId: number,
    data: AltaByCompraDTO,
    usuario: LoginIdentityDTO,
  ): Promise<InformeResultDTO> {
    const sucursalMatriz = await getRepository(SucursalEntity)
      .createQueryBuilder()
      .where('esMatriz=:esMatriz', { esMatriz: true })
      .getOne();
    if (!sucursalMatriz) {
      throw new HttpException('La sucursal no existe', HttpStatus.NOT_FOUND);
    }

    const movimiento: CreateMovimientoDTO = {
      fecha: data.fecha,
      sucursalOrigen: sucursalMatriz.id,
      tipoMovimiento: TiposMovimiento.ALTA,
      notas: data.notas,
    };

    await this.almacenService.create(movimiento, data.detalle, usuario);

    await this.changeStatus(compraId, EstatusCompra.RECIBIDO);

    const datos: InformeResultDTO = {
      compra: await getRepository(CompraEntity).findOne(compraId),
      detalle: await getRepository(DetalleCompraEntity)
        .createQueryBuilder('det')
        .leftJoin('det.compra', 'compra')
        .select(['det'])
        .where('compra.id=:compraId AND compra.estatus =:status', {
          compraId,
          status: EstatusCompra.RECIBIDO,
        })
        .getMany(),
    };
    return datos;
  }

  /**
   * Envia un correo al proveedor de la orden de compra realizada con copia al encargado de ventas
   * @param id
   * @param user
   * @returns {HttpStatus.OK}
   */
  async sendToProveedor(id: number): Promise<HttpStatus> {
    const destinatario = await getRepository(CompraEntity)
      .createQueryBuilder('compra')
      .leftJoin('compra.proveedor', 'proveedor')
      .select(['compra', 'proveedor'])
      .where('compra.id =:id', { id })
      .getOne();

    //opciones de consulta de datos
    let compra = new GetCompraDTO();
    compra = await this.getById(id);
    let fechaCompra: any = compra.compra.fecha;
    fechaCompra = moment(fechaCompra).format('DD/MM/YYYY');
    let total: number = 0;
    for (const det of compra.detalle) {
      total = det.cantidad * det.precio;
      total -= det.descuento;
    }
    const totalIva: number = total + total * 0.16;

    //generar buffer del docx parseado con data
    const bufferDoc = await this.heimalService.render(
      'reportes/compras/ordenCompra',
      {
        orden: compra,
        fechaCompra: fechaCompra,
        fechaImpresion: moment().format('DD/MM/YYYY [a las] HH:mm:ss'),
        total,
        totalIva,
      },
      'pdf',
    );

    if (destinatario) {
      this.mailSenderService.send(
        {
          to: destinatario.proveedor.email,
          // cc: user.email,
          subject: 'Orden de compra - Laboratorio San Francisco', //FIXME: de config
          attachments: [
            {
              filename: `orden-de-compra-${compra.compra.folio}.pdf`,
              content: Buffer.from(bufferDoc),
              contentType: 'application/pdf',
            },
          ],
        },
        'compras/send-insumos',
        {
          siteName: this.configService.get<string>(ConfigKeys.SITE_NAME),
          proveedor: destinatario.proveedor.nombre,
        },
      );

      this.changeStatus(id, EstatusCompra.ENVIADA);
    }

    return HttpStatus.OK;
  }

  async updateStatus(id: number, active: boolean): Promise<UpdateResult> {
    const theCompra = await getRepository(CompraEntity)
      .createQueryBuilder('compra')
      .where('compra.id = :id', { id: id })
      .getOne();

    if (!theCompra) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }

    return await getRepository(CompraEntity)
      .createQueryBuilder('compra')
      .update()
      .set({ active })
      .where({ id: theCompra.id })
      .execute();
  }

  async changeStatus(
    id: number,
    estatus: EstatusCompra,
  ): Promise<UpdateResult> {
    const theCompra = await getRepository(CompraEntity)
      .createQueryBuilder('compra')
      .where('compra.id = :id', { id: id })
      .getOne();

    if (!theCompra) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }

    return await getRepository(CompraEntity)
      .createQueryBuilder('compra')
      .update()
      .set({ estatus })
      .where({ id: theCompra.id })
      .execute();
  }

  async delete(id: number): Promise<DeleteResult> {
    return getRepository(CompraEntity).delete({ id });
  }

  async deleteDetalleCompras(id: number): Promise<DeleteResult> {
    return await getRepository(DetalleCompraEntity).delete(id);
  }

  async paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult> {
    const dataQuery = getRepository(CompraEntity)
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
    forIn(options.filters, (value, key) => {
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
}
