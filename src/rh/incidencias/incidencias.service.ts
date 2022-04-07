import { IncidenciaEntity } from './entity/incidencias.entity';
import { HttpException, Injectable } from '@nestjs/common';
import { CreateIncidenciaDTO } from './DTO/create-incidencia.dto';
import { UpdateIncidenciasDTO } from './DTO/update-incidencia.dto';
import { DeleteResult, getRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { forIn } from 'lodash';

@Injectable()
export class IncidenciasService {
  /**
.####.##....##..######..####.########..########.##....##..######..####....###.....######.
..##..###...##.##....##..##..##.....##.##.......###...##.##....##..##....##.##...##....##
..##..####..##.##........##..##.....##.##.......####..##.##........##...##...##..##......
..##..##.##.##.##........##..##.....##.######...##.##.##.##........##..##.....##..######.
..##..##..####.##........##..##.....##.##.......##..####.##........##..#########.......##
..##..##...###.##....##..##..##.....##.##.......##...###.##....##..##..##.....##.##....##
.####.##....##..######..####.########..########.##....##..######..####.##.....##..######.
     */

  async createIncidencia(
    incidencia: CreateIncidenciaDTO,
  ): Promise<IncidenciaEntity> {
    const bancoToCreate = plainToClass(IncidenciaEntity, incidencia);

    const nuevoBanco = await getRepository(IncidenciaEntity).save(
      bancoToCreate,
    );

    return nuevoBanco;
  }

  async getIncidenciaById(id: number): Promise<IncidenciaEntity> {
    return await getRepository(IncidenciaEntity).findOne(id);
  }

  async updateIncidencia(
    id: number,
    incidencia: UpdateIncidenciasDTO,
  ): Promise<IncidenciaEntity> {
    await getRepository(IncidenciaEntity).update(id, incidencia);
    return await this.getIncidenciaById(id);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await getRepository(IncidenciaEntity).delete(id);
  }

  async incidenciasPaginate(
    options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    const dataQuery =
      getRepository(IncidenciaEntity).createQueryBuilder('incidencia');

    forIn(options.filters, (value, key) => {
      if (key === 'nombre') {
        dataQuery.orWhere('( incidencia.nombre LIKE :term )', {
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

  /**
#### ##    ##  ######  #### ########  ######## ##    ##  ######  ####    ###     ######  
 ##  ###   ## ##    ##  ##  ##     ## ##       ###   ## ##    ##  ##    ## ##   ##    ## 
 ##  ####  ## ##        ##  ##     ## ##       ####  ## ##        ##   ##   ##  ##       
 ##  ## ## ## ##        ##  ##     ## ######   ## ## ## ##        ##  ##     ##  ######  
 ##  ##  #### ##        ##  ##     ## ##       ##  #### ##        ##  #########       ## 
 ##  ##   ### ##    ##  ##  ##     ## ##       ##   ### ##    ##  ##  ##     ## ##    ## 
#### ##    ##  ######  #### ########  ######## ##    ##  ######  #### ##     ##  ######  
######## ##     ## ########  ##       ########    ###    ########   #######   ######     
##       ###   ### ##     ## ##       ##         ## ##   ##     ## ##     ## ##    ##    
##       #### #### ##     ## ##       ##        ##   ##  ##     ## ##     ## ##          
######   ## ### ## ########  ##       ######   ##     ## ##     ## ##     ##  ######     
##       ##     ## ##        ##       ##       ######### ##     ## ##     ##       ##    
##       ##     ## ##        ##       ##       ##     ## ##     ## ##     ## ##    ##    
######## ##     ## ##        ######## ######## ##     ## ########   #######   ######     
     */
}
