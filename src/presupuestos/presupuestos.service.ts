import { MailService } from '@sanfrancisco/common/services/mailer/email.service';
import { ConfigService } from '@nestjs/config';
import { HeimdalService } from '@sanfrancisco/common/heimdal/heimdal.service';
import { InformePresupuestoDTO } from './DTO/informe-presupuesto.dto';
import { TipoUnidadEntity } from '@sanfrancisco/catalogos/tipos-unidades/tipos-unidades.entity';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { LoginIdentityDTO } from '@sanfrancisco/auth/dto/loginIdentity.dto';
import { UpdatePresupuestoDTO } from './DTO/update-presupuesto.dto';
import { PresupuestoEntity } from '@sanfrancisco/presupuestos/presupuesto.entity';
import { CreatePresupuestoDTO } from './DTO/create-presupuesto.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { forIn } from 'lodash';
import { DeleteResult, getRepository, UpdateResult } from 'typeorm';
import { PresupuestoDetalleEntity } from './presupuestosDetalle.entity';
import { InsumoEntity } from '../insumos/insumo.entity';
import { EstatusPresupuesto } from './EstatusPresupuesto.enum';
import { ProveedorEntity } from '../catalogos/proveedores/proveedores.entity';
import * as moment from 'moment';
import { ConfigKeys } from '@sanfrancisco/common/enum/configkeys.enum';

@Injectable()
export class PresupuestosService {
  private readonly notFoundMessage = 'presupuesto no encontrada';
  constructor(
    private readonly heimalService: HeimdalService,
    private readonly configService: ConfigService,
    private readonly mailSenderService: MailService,
  ) {}

  async create(
    data: CreatePresupuestoDTO,
    user: LoginIdentityDTO,
  ): Promise<InformePresupuestoDTO> {
    const usuario = await getRepository(UsersEntity).findOne(user.id);

    const presupuestoTocreate = {
      usuario,
      fecha: moment().format('DD/MM/YYYY'),
    };

    const savedPresupuesto = await getRepository(PresupuestoEntity).save(
      presupuestoTocreate,
    );

    const savedDetalle = [];

    for (let i = 0; i < data.detalle.length; i++) {
      const tipoUnidad = await getRepository(TipoUnidadEntity).findOne(
        data.detalle[i].tipoUnidadId,
      );

      const insumo = await getRepository(InsumoEntity).findOne(
        data.detalle[i].insumoId,
      );

      const detalleTocreate = {
        presupuestoId: savedPresupuesto.id,
        insumo,
        tipoUnidad,
        cantidad: data.detalle[i].cantidad,
      };

      savedDetalle[i] = await getRepository(PresupuestoDetalleEntity).save(
        detalleTocreate,
      );
    }

    const result: InformePresupuestoDTO = {
      presupuesto: savedPresupuesto,
      detalle: savedDetalle,
    };

    return result;
  }

  async getById(id: number): Promise<InformePresupuestoDTO> {
    const presupuesto = await getRepository(PresupuestoEntity)
      .createQueryBuilder('presupuesto')
      .where('presupuesto.id = :id', { id: id })
      .getOne();

    if (!presupuesto) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }
    const detallePresupuesto = await getRepository(PresupuestoDetalleEntity)
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
      throw new HttpException('detalle no encontrado', HttpStatus.NOT_FOUND);
    }

    const result: InformePresupuestoDTO = {
      presupuesto: presupuesto,
      detalle: detallePresupuesto,
    };

    return result;
  }

  /**
   * Envia un correo al proveedor el presupuesto realizada con copia al encargado de ventas
   * @param id
   * @param user
   * @returns {HttpStatus.OK}
   */
  async sendToProveedor(
    id: number,
    proveedorSeleccionadoId: number,
  ): Promise<HttpStatus> {
    const presupuesto = await getRepository(PresupuestoEntity).findOne(id);

    if (!presupuesto) {
      throw new HttpException(
        'No hay registros para el reporte.',
        HttpStatus.NOT_FOUND,
      );
    }

    const Detalle = await getRepository(PresupuestoDetalleEntity)
      .createQueryBuilder('detalle')
      .leftJoinAndSelect('detalle.insumo', 'insumo')
      .where('detalle.presupuestoId=:id', {
        id: presupuesto.id,
      })
      .getMany();

    let totalPresupuesto: number = 0;
    for (const det of Detalle) {
      totalPresupuesto += det.precioSeleccionado;
    }
    const totalIva = totalPresupuesto + totalPresupuesto * 0.16;

    const proveedor = await getRepository(ProveedorEntity).findOne(
      proveedorSeleccionadoId,
    );
    let fechaPresupuesto: any = presupuesto.fecha;
    fechaPresupuesto = moment(fechaPresupuesto).format('DD/MM/YYYY');
    const formato: InformePresupuestoDTO = {
      presupuesto: presupuesto,
      detalle: Detalle,
    };

    //opciones de consulta de datos
    // let presupuesto: PresupuestoEntity;
    // presupuesto = await this.getById(id);

    //generar buffer del docx parseado con data
    const bufferDoc = await this.heimalService.render(
      'reportes/presupuestos/presupuesto',
      {
        formatoPresupuesto: formato,
        fechaPresupuesto,
        proveedor,
        fechaImpresion: moment().format('DD/MM/YYYY [a las] HH:mm:ss'),
        totalPresupuesto: totalPresupuesto,
        totalIva,
      },
      'pdf',
    );

    if (proveedor) {
      this.mailSenderService.send(
        {
          to: proveedor.email,
          // cc: user.email,
          subject: 'Presupuesto de compra - Laboratorio San Francisco', //FIXME: de config
          attachments: [
            {
              filename: `presupuesto-de-compra-${presupuesto.id}.pdf`,
              content: Buffer.from(bufferDoc),
              contentType: 'application/pdf',
            },
          ],
        },
        'presupuesto/send-pres',
        {
          siteName: this.configService.get<string>(ConfigKeys.SITE_NAME),
          proveedor: proveedor.nombre,
        },
      );
    }

    return HttpStatus.OK;
  }

  /**
   * Function
   * createDetallePresupuesto
   */
  async updateDetallePresupuesto(
    id: number,
    presupuesto: UpdatePresupuestoDTO,
  ): Promise<UpdateResult> {
    const presupuestoDetail = await getRepository(
      PresupuestoDetalleEntity,
    ).findOne(id);

    if (!presupuestoDetail) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }

    const presupuestoFather = await getRepository(PresupuestoEntity).findOne(
      presupuestoDetail.presupuestoId,
    );

    if (presupuestoFather.estatus !== 'B') {
      throw new HttpException(
        'el presupuesto no es borrador',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await getRepository(PresupuestoDetalleEntity).update(
      { id },
      presupuesto,
    );
  }

  async UpdateInsumoDetallePresupuesto(
    id: number, //presupuesto
    presupuesto: UpdatePresupuestoDTO,
  ): Promise<PresupuestoDetalleEntity> {
    const presupuestoFather = await getRepository(PresupuestoEntity).findOne(
      id,
    );

    if (presupuestoFather.estatus !== EstatusPresupuesto.BORRADOR) {
      throw new HttpException(
        'el presupuesto no es borrador',
        HttpStatus.BAD_REQUEST,
      );
    }

    const insumo = await getRepository(InsumoEntity).findOne(
      presupuesto.insumoId,
    );

    const tipoUnidad = await getRepository(TipoUnidadEntity).findOne(
      presupuesto.tipoUnidadId,
    );

    const proveedor1 = await getRepository(ProveedorEntity).findOne({
      id: presupuesto.proveedor1Id,
    });

    let proveedor2 = null;
    let proveedor3 = null;
    let proveedorSeleccionado = null;

    if (presupuesto.proveedor2Id) {
      proveedor2 = await getRepository(ProveedorEntity).findOne({
        id: presupuesto.proveedor2Id,
      });
    }

    if (presupuesto.proveedor3Id) {
      proveedor3 = await getRepository(ProveedorEntity).findOne({
        id: presupuesto.proveedor3Id,
      });
    }

    if (presupuesto.proveedorSeleccionadoId) {
      proveedorSeleccionado = await getRepository(ProveedorEntity).findOne({
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

    return await getRepository(PresupuestoDetalleEntity).save(detalleTocreate);
  }

  async updateStatus(
    id: number,
    estatus: EstatusPresupuesto,
  ): Promise<UpdateResult> {
    const thePresupuesto = await getRepository(PresupuestoEntity)
      .createQueryBuilder('presupuesto')
      .where('presupuesto.id = :id', { id: id })
      .getOne();

    if (!thePresupuesto) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }

    if (!thePresupuesto) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }

    return await getRepository(PresupuestoEntity)
      .createQueryBuilder('presupuesto')
      .update()
      .set({ estatus })
      .where({ id: thePresupuesto.id })
      .execute();
  }

  async deletePresupuestoDetalle(id: number): Promise<DeleteResult> {
    return await getRepository(PresupuestoDetalleEntity).delete(id);
  }

  async paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult> {
    const dataQuery =
      getRepository(PresupuestoEntity).createQueryBuilder('presupuesto');
    forIn(options.filters, (value, key) => {
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
}
