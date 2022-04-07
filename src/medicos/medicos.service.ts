import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateMedicoDto } from './DTO/create-medico.dto';
import { UpdateMedicoDto } from './DTO/update-medico.dto';
import { getRepository, DeleteResult } from 'typeorm';
import { MedicoEntity } from './medico.entity';
import { forIn } from 'lodash';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';

@Injectable()
export class MedicosService {
  async create(createMedicoDto: CreateMedicoDto): Promise<MedicoEntity> {
    if (createMedicoDto.email) {
      const emailMedico = await getRepository(MedicoEntity).findOne({
        email: createMedicoDto.email,
      });
      if (emailMedico) {
        throw new HttpException(
          'El correo ya ha sido registrado en un médico',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    return await getRepository(MedicoEntity).save(createMedicoDto);
  }

  async getById(id: number): Promise<MedicoEntity> {
    return await getRepository(MedicoEntity).findOne(id);
  }

  async update(
    id: number,
    updateMedicoDto: UpdateMedicoDto,
  ): Promise<MedicoEntity> {
    await getRepository(MedicoEntity).update(id, updateMedicoDto);
    return await this.getById(id);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await getRepository(MedicoEntity).delete(id);
  }

  async paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult> {
    const dataQuery = getRepository(MedicoEntity).createQueryBuilder();

    forIn(options.filters, (value, key) => {
      if (key === 'nombre') {
        dataQuery.andWhere('( nombre LIKE :term )', {
          term: `%${value.split(' ').join('%')}%`,
        });
        dataQuery.orWhere('( email LIKE :term )', {
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
