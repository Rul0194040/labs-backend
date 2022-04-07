import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { getRepository, UpdateResult, DeleteResult } from 'typeorm';
import { DireccionFiscalEntity } from './direccionesFiscales.entity';
import { CreateDireccionDTO } from './DTOs/create-direcciones-fiscales.dto';
import { UpdateDireccionDTO } from './DTOs/update-direcciones-fiscales.dto';
import { PacienteEntity } from '../../pacientes/pacientes.entity';
import { ClienteEntity } from '../../clientes/clientes.entity';

@Injectable()
export class DireccionesFiscalesService {
  private readonly notFoundMessage = 'direccion no encontrada';

  /**
   * Crea una direccion fiscal
   *
   * @param direccion direccion fiscal a crear
   * @returns {DireccionFiscalEntity}
   */
  async create(direccion: CreateDireccionDTO): Promise<DireccionFiscalEntity> {
    if (direccion.pacienteId) {
      const paciente = await getRepository(PacienteEntity).findOne({
        id: direccion.pacienteId,
      });
      if (!paciente)
        throw new HttpException('El paciente no existe', HttpStatus.NOT_FOUND);
    }

    if (direccion.clienteId) {
      const cliente = await getRepository(ClienteEntity).findOne({
        id: direccion.clienteId,
      });
      if (!cliente)
        throw new HttpException('El cliente no existe', HttpStatus.NOT_FOUND);
    }

    const direccionToCreate = plainToClass(DireccionFiscalEntity, direccion);

    return getRepository(DireccionFiscalEntity).save(direccionToCreate);
  }

  /**
   * Obtiene una direccion fiscal por id
   *
   * @param id id de la direccion fiscal
   * @returns {DireccionFiscalEntity}
   */
  async getById(id: number): Promise<DireccionFiscalEntity> {
    const direccion = getRepository(DireccionFiscalEntity)
      .createQueryBuilder('direccion')
      .where('direccion.id = :direccionId', { direccionId: id })
      .getOne();

    if (!direccion) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }

    return direccion;
  }

  /**
   * Obtiene las direcciones fiscales de un paciente o de un cliente
   *
   * @param id id del paciente o cliente
   * @returns {DireccionFiscalEntity[]} arreglo de direcciones fiscales
   */
  async getDirecciones(
    esCliente: boolean,
    id: number,
  ): Promise<DireccionFiscalEntity[]> {
    const direcciones = getRepository(
      DireccionFiscalEntity,
    ).createQueryBuilder();

    if (esCliente) {
      direcciones.where('clienteId = :id', { id });
    } else {
      direcciones.where('pacienteId = :id', { id });
    }

    return await direcciones.getMany();
  }

  /**
   * Actualiza una direccion fiscal
   *
   * @param id id de la direccion fiscal
   * @param direccion datos a actualizar
   * @returns {UpdateResult}
   */
  async update(
    id: number,
    direccion: UpdateDireccionDTO,
  ): Promise<UpdateResult> {
    const theDireccion = await this.getById(id);

    if (!theDireccion) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }

    if (direccion.pacienteId) {
      const paciente = await getRepository(PacienteEntity).findOne({
        id: direccion.pacienteId,
      });
      if (!paciente)
        throw new HttpException('El paciente no existe', HttpStatus.NOT_FOUND);
    }

    if (direccion.clienteId) {
      const cliente = await getRepository(ClienteEntity).findOne({
        id: direccion.clienteId,
      });
      if (!cliente)
        throw new HttpException('El cliente no existe', HttpStatus.NOT_FOUND);
    }

    return await getRepository(DireccionFiscalEntity).update({ id }, direccion);
  }

  /**
   * Elimina una direccion fiscal
   *
   * @param id id de la direccion fiscal
   * @returns {DeleteResult}
   */
  async delete(id: number): Promise<DeleteResult> {
    return getRepository(DireccionFiscalEntity).delete({ id });
  }
}
