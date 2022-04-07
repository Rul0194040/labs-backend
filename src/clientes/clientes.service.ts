import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { plainToClass } from 'class-transformer';
import { forIn } from 'lodash';
import { DeleteResult, getRepository, UpdateResult } from 'typeorm';
import { ClienteEntity } from './clientes.entity';
import { CreateClienteDTO } from './DTOs/create-cliente.dto';
import { UpdateClienteDTO } from './DTOs/update-cliente.dto';
import { UsersEntity } from '../users/users.entity';
import { PxlabService } from '@sanfrancisco/pxlab/pxlab.service';
import * as readXlsxFile from 'read-excel-file/node';
import { TiposConvenios } from '@sanfrancisco/common/enum/tipos-convenios.enum';
import { MyLogger } from '@sanfrancisco/logger';

@Injectable()
export class ClientesService {
  constructor(private readonly pxService: PxlabService) {}
  private logger = new MyLogger(ClientesService.name);
  /**
   * Crea un nuevo cliente en la base de datos
   *
   * @param cliente cliente a crear
   * @returns {SucursalEntity} entidad de cliente
   */
  async create(
    cliente: CreateClienteDTO,
    user: UsersEntity,
  ): Promise<ClienteEntity> {
    const clienteToCreate = plainToClass(ClienteEntity, cliente);
    clienteToCreate.usuario = user;

    const nuevoCliente = await getRepository(ClienteEntity).save(
      clienteToCreate,
    );

    //ponerle el id de px para xquenda
    const cuentaPxLab = '9' + nuevoCliente.id.toString().padStart(6, '0');
    await getRepository(ClienteEntity).update(nuevoCliente.id, { cuentaPxLab });
    nuevoCliente.cuentaPxLab = cuentaPxLab;
    //enviar a pxlab
    this.pxService.enviarCliente(
      nuevoCliente.cuentaPxLab,
      nuevoCliente.nombre,
      nuevoCliente.email,
      true,
    );
    return nuevoCliente;
  }
  /**
   * Retorna un cliente por id
   * @param id
   */
  async getById(id: number): Promise<ClienteEntity> {
    const cliente = getRepository(ClienteEntity)
      .createQueryBuilder('cliente')
      .leftJoin('cliente.usuario', 'usuario')
      .select([
        'cliente',
        'usuario.id',
        'usuario.email',
        'usuario.firstName',
        'usuario.lastName',
        'usuario.profile',
      ])
      .where('cliente.id = :insumoId', { insumoId: id })
      .getOne();

    if (!cliente) {
      throw new HttpException('cliente no encontrado', HttpStatus.NOT_FOUND);
    }

    return cliente;
  }
  /**
   * Actualiza un registro de cliente
   *
   * @param id del cliente a actualizar
   * @param cliente data que actualiza el objeto
   */
  async update(id: number, cliente: UpdateClienteDTO): Promise<UpdateResult> {
    const Record = await this.getById(id);

    if (!Record) {
      throw new HttpException('cliente no encontrado', HttpStatus.NOT_FOUND);
    }

    const clienteActualizado = await getRepository(ClienteEntity).update(
      { id },
      cliente,
    );

    //enviar a pxlab
    this.pxService.enviarCliente(
      Record.cuentaPxLab,
      cliente.nombre,
      cliente.email,
      false,
    );
    return clienteActualizado;
  }
  /**
   * Cambia el estatus de un cliente
   *
   * @param id del objeto a cambiar el status
   * @param active referencia del valor del status
   */
  async updateStatus(id: number, active: boolean): Promise<UpdateResult> {
    const Record = await this.getById(id);

    if (!Record) {
      throw new HttpException('cliente no encontrado', HttpStatus.NOT_FOUND);
    }

    return await getRepository(ClienteEntity)
      .createQueryBuilder('cliente')
      .update()
      .set({ active })
      .where({ id: Record.id })
      .execute();
  }

  /**
   * Borra un registro
   *
   * @param id del objeto a borrar
   */
  async delete(id: number): Promise<DeleteResult> {
    return getRepository(ClienteEntity).delete({ id });
  }

  /**
   * Pagina los insumos activos
   * @param options opciones de paginacion de los registros
   */
  async paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult> {
    const dataQuery = getRepository(ClienteEntity)
      .createQueryBuilder('cliente')
      .leftJoin('cliente.usuario', 'usuario')
      .select([
        'cliente',
        'usuario.id',
        'usuario.email',
        'usuario.firstName',
        'usuario.lastName',
        'usuario.profile',
      ]);
    forIn(options.filters, (value, key) => {
      if (key === 'nombre') {
        dataQuery.andWhere('( cliente.nombre LIKE :term )', {
          term: `%${value.split(' ').join('%')}%`,
        });
        dataQuery.orWhere('( cliente.codigo LIKE :term )', {
          term: `%${value.split(' ').join('%')}%`,
        });
        dataQuery.orWhere('( cliente.email LIKE :term )', {
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

  updateStripeId(clienteId: number, stripeId: string): Promise<UpdateResult> {
    return getRepository(ClienteEntity).update(clienteId, { stripeId });
  }

  async importarClientesXLS(xlsFile: string) {
    this.logger.verbose('Abriendo archivo ' + xlsFile);
    const rows = await readXlsxFile(xlsFile, { dateFormat: 'MM/DD/YY' });
    this.logger.verbose('Encontrados ' + rows.length + ' clientes');
    const clienteRepo = getRepository(ClienteEntity);
    const tipoPersona = 'MORAL';
    const telefono = '';
    const tipoConvenio = TiposConvenios.EMPLEADO;
    //por cada row de datos
    for (let r = 1; r <= rows.length - 1; r++) {
      const row = rows[r];
      const cuentaPxLab = row[0] ? row[0].toString().trim() : null;
      const nombre = row[1] ? row[1].trim() : null;
      const descuento = row[2]
        ? Number((parseFloat(row[2]) * 100).toFixed(2))
        : 0;
      const diasCredito = row[3] ? parseInt(row[3]) : 0;
      //es un cliente existente y trae datos
      if (cuentaPxLab && nombre) {
        const cliente = await clienteRepo.findOne({
          where: { cuentaPxLab },
        });

        if (!cliente) {
          //si no existe, darlo de alta
          const clienteCreado = await clienteRepo.save({
            cuentaPxLab,
            nombre,
            descuento,
            diasCredito,
            tipoPersona,
            telefono,
            tipoConvenio,
          });
          this.logger.verbose('+++Creado: ' + clienteCreado.nombre);
        } else {
          //actualizarlo
          await clienteRepo.update(
            { cuentaPxLab },
            {
              nombre,
              descuento,
              diasCredito,
            },
          );
        }
      }
    }
    return rows;
  }
}
