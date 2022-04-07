import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { plainToClass } from 'class-transformer';
import { forIn } from 'lodash';
import { getRepository, UpdateResult, DeleteResult } from 'typeorm';
import { CreatePacienteDTO } from './DTOs/create-paciente.dto';
import { UpdatePacienteDTO } from './DTOs/update-paciente.dto';
import { PacienteEntity } from './pacientes.entity';
import { ClienteEntity } from '../clientes/clientes.entity';
import { UsersEntity } from '../users/users.entity';

@Injectable()
export class PacientesService {
  private readonly notFoundMessage = 'paciente no encontrada';

  async create(
    paciente: CreatePacienteDTO,
    user: UsersEntity,
  ): Promise<PacienteEntity> {
    if (paciente.email) {
      const pacienteEmail = await getRepository(PacienteEntity).findOne({
        email: paciente.email,
      });
      if (pacienteEmail)
        throw new HttpException(
          'El correo ya ha sido registrado en un paciente',
          HttpStatus.BAD_REQUEST,
        );
    }

    const pacienteToCreate = plainToClass(PacienteEntity, paciente);
    pacienteToCreate.usuario = user;

    if (paciente.cliente) {
      const cliente = await getRepository(ClienteEntity).findOne(
        paciente.cliente,
      );
      if (!cliente) {
        throw new HttpException('El cliente no existe', HttpStatus.NOT_FOUND);
      }
      pacienteToCreate.cliente = cliente;
    }

    return await getRepository(PacienteEntity).save(pacienteToCreate);
  }

  async getById(id: number): Promise<PacienteEntity> {
    const paciente = getRepository(PacienteEntity)
      .createQueryBuilder('paciente')
      .leftJoinAndSelect('paciente.cliente', 'cliente')
      .leftJoinAndSelect('paciente.usuario', 'usuario')
      .select([
        'paciente',
        'cliente.id',
        'cliente.nombre',
        'cliente.tipoConvenio',
        'usuario.id',
        'usuario.email',
        'usuario.firstName',
        'usuario.lastName',
        'usuario.profile',
      ])
      .where('paciente.id = :pacienteId', { pacienteId: id })
      .getOne();

    if (!paciente) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }

    return paciente;
  }

  async update(
    id: number,
    paciente: UpdatePacienteDTO,
  ): Promise<PacienteEntity> {
    if (paciente.email) {
      const pacienteEmail = await getRepository(PacienteEntity).findOne({
        email: paciente.email,
      });
      if (pacienteEmail && pacienteEmail?.id !== id)
        throw new HttpException(
          'El correo ya ha sido registrado en un paciente',
          HttpStatus.BAD_REQUEST,
        );
    }

    const record = await this.getById(id);

    if (!record) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }

    if (paciente.cliente) {
      const cliente = await getRepository(ClienteEntity).findOne(
        paciente.cliente,
      );
      if (!cliente) {
        throw new HttpException('El cliente no existe', HttpStatus.NOT_FOUND);
      }
      record.cliente = cliente;
    }

    const updatePaciente = {
      cliente: record.cliente,
      nombre: paciente.nombre,
      apellidoPaterno: paciente.apellidoPaterno,
      apellidoMaterno: paciente.apellidoMaterno,
      email: paciente.email,
      telefono: paciente.telefono,
      fechaNac: paciente.fechaNac,
      descripcion: paciente.descripcion,
      sexo: paciente.sexo,
    };

    await getRepository(PacienteEntity).update({ id }, updatePaciente);

    return await this.getById(id);
  }

  async updateStatus(id: number, active: boolean): Promise<UpdateResult> {
    const record = await this.getById(id);

    if (!record) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }

    return await getRepository(PacienteEntity)
      .createQueryBuilder('paciente')
      .update()
      .set({ active })
      .where({ id: record.id })
      .execute();
  }

  async delete(id: number): Promise<DeleteResult> {
    return getRepository(PacienteEntity).delete({ id });
  }

  async paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult> {
    const dataQuery = getRepository(PacienteEntity)
      .createQueryBuilder('paciente')
      .leftJoinAndSelect('paciente.cliente', 'cliente')
      .leftJoinAndSelect('paciente.usuario', 'usuario')
      .select([
        'paciente',
        'cliente.id',
        'cliente.nombre',
        'cliente.descuento',
        'cliente.diasCredito',
        'cliente.tipoConvenio',
        'usuario.id',
        'usuario.email',
        'usuario.firstName',
        'usuario.lastName',
        'usuario.profile',
      ]);

    forIn(options.filters, (value, key) => {
      if (key === 'nombre') {
        dataQuery.andWhere('( paciente.nombre LIKE :term )', {
          term: `%${value.split(' ').join('%')}%`,
        });
        dataQuery.orWhere('( paciente.apellidoPaterno LIKE :term )', {
          term: `%${value.split(' ').join('%')}%`,
        });
        dataQuery.orWhere('( paciente.apellidoMaterno LIKE :term )', {
          term: `%${value.split(' ').join('%')}%`,
        });
        dataQuery.orWhere('( paciente.email LIKE :term )', {
          term: `%${value.split(' ').join('%')}%`,
        });
      }
      if (key === 'cliente') {
        dataQuery.andWhere('( cliente.id = :clienteId )', {
          clienteId: value,
        });
      }
    });

    const count = await dataQuery.getCount();

    if (options.sort === undefined) {
      options.sort = 'paciente.createdAt';
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
