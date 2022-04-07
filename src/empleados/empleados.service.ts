import { UpdateEmpleadoDTO } from './DTO/update-empleado.dto';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { CreateEmpleadoDTO } from './DTO/create-empleado.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DeleteResult, getRepository } from 'typeorm';
import { QrsEntity } from './qrs/qrs.entity';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { forIn } from 'lodash';

@Injectable()
export class EmpleadosService {
  async getEntradasSalidas(empleadoId: number) {
    const result = await getRepository(QrsEntity).find({
      where: { empleadoId: empleadoId },
      relations: ['entrada', 'sucursal'],
      order: { fechaHora: 'ASC' },
    });
    return result;
  }

  async createEmpleado(empleado: CreateEmpleadoDTO): Promise<UsersEntity> {
    if (empleado.email) {
      const emailMedico = await getRepository(UsersEntity).findOne({
        email: empleado.email,
      });
      if (emailMedico) {
        throw new HttpException(
          'El correo ya ha sido registrado en un médico',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    return await getRepository(UsersEntity).save(empleado);
  }

  async getEmpleadoById(id: number): Promise<UsersEntity> {
    return await getRepository(UsersEntity).findOne(id);
  }

  async updateEmpleado(
    id: number,
    empleado: UpdateEmpleadoDTO,
  ): Promise<UsersEntity> {
    await getRepository(UsersEntity).update(id, empleado);
    return await this.getEmpleadoById(id);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await getRepository(UsersEntity).delete(id);
  }

  async empleadosPaginate(
    options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    const dataQuery = getRepository(UsersEntity).createQueryBuilder('empleado');

    forIn(options.filters, (value, key) => {
      if (key === 'nombre') {
        dataQuery.orWhere('( empleado.nombre LIKE :term )', {
          term: `%${value.split(' ').join('%')}%`,
        });
      }
      if (key === 'email') {
        dataQuery.orWhere('( empleado.email LIKE :term )', {
          term: `%${value.split(' ').join('%')}%`,
        });
      }
      if (key === 'telefono') {
        dataQuery.orWhere('( empleado.telefono LIKE :term )', {
          term: `%${value.split(' ').join('%')}%`,
        });
      }
      if (key === 'curp') {
        dataQuery.orWhere('( empleado.curp LIKE :term )', {
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
}
