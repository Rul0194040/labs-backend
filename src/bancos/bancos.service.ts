import { UpdateMovimientoDTO } from './../almacen/DTOs/update-movimiento.dto';
import { MovimientoCuentaBanco } from './entities/movimientos-bancos.entity';
import { CreateMovBancarioDTO } from './dto/create-mov-bancario.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { plainToClass } from 'class-transformer';
import { forIn } from 'lodash';
import { DeleteResult, getRepository, UpdateResult } from 'typeorm';
import { CreateBancoDto } from './dto/create-banco.dto';
import { CreateCuentaDto } from './dto/create-cuenta.dto';
import { CreateTipoCuentaGastoDTO } from './dto/create-tipo-cuenta-gasto.dto';
import { UpdateBancoDto } from './dto/update-banco.dto';
import { UpdateCuentaDto } from './dto/update-cuenta.dto';
import { UpdateTipoCuentaGastoDTO } from './dto/update-tipo-cuenta-gasto.dto';
import { BancoEntity } from './entities/banco.entity';
import { CuentaBancariaEntity } from './entities/cuenta-bancaria.entity';
import { TipoCuentaGastoEntity } from './entities/tipos-cuenta-gasto.entity';

@Injectable()
export class BancosService {
  /*
.########.....###....##....##..######...#######...######.
.##.....##...##.##...###...##.##....##.##.....##.##....##
.##.....##..##...##..####..##.##.......##.....##.##......
.########..##.....##.##.##.##.##.......##.....##..######.
.##.....##.#########.##..####.##.......##.....##.......##
.##.....##.##.....##.##...###.##....##.##.....##.##....##
.########..##.....##.##....##..######...#######...######.
*/

  /**
   * Crea un nuevo banco en la base de datos
   *
   * @param banco banco a crear
   * @returns {SucursalEntity} entidad de banco
   */
  async create(banco: CreateBancoDto): Promise<BancoEntity> {
    const bancoToCreate = plainToClass(BancoEntity, banco);

    const nuevoBanco = await getRepository(BancoEntity).save(bancoToCreate);

    return nuevoBanco;
  }
  /**
   * Retorna un banco por id
   * @param id
   */
  async getById(id: number): Promise<BancoEntity> {
    const banco = getRepository(BancoEntity).findOne(id);

    if (!banco) {
      throw new HttpException('banco no encontrado', HttpStatus.NOT_FOUND);
    }

    return banco;
  }
  /**
   * Actualiza un registro de banco
   *
   * @param id del banco a actualizar
   * @param banco data que actualiza el objeto
   */
  async update(id: number, banco: UpdateBancoDto): Promise<UpdateResult> {
    const Record = await this.getById(id);

    if (!Record) {
      throw new HttpException('banco no encontrado', HttpStatus.NOT_FOUND);
    }

    const bancoActualizado = await getRepository(BancoEntity).update(
      { id },
      banco,
    );

    return bancoActualizado;
  }

  /**
   * Borra un registro
   *
   * @param id del objeto a borrar
   */
  async delete(id: number): Promise<DeleteResult> {
    return getRepository(BancoEntity).delete({ id });
  }

  /**
   * Pagina los insumos activos
   * @param options opciones de paginacion de los registros
   */
  async paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult> {
    const dataQuery = getRepository(BancoEntity)
      .createQueryBuilder('banco')
      .select(['banco.nombre', 'banco.telefono']);
    forIn(options.filters, (value, key) => {
      if (key === 'nombre') {
        dataQuery.andWhere('( banco.nombre LIKE :term )', {
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

  /*
..######..##.....##.########.##....##.########....###.....######.
.##....##.##.....##.##.......###...##....##......##.##...##....##
.##.......##.....##.##.......####..##....##.....##...##..##......
.##.......##.....##.######...##.##.##....##....##.....##..######.
.##.......##.....##.##.......##..####....##....#########.......##
.##....##.##.....##.##.......##...###....##....##.....##.##....##
..######...#######..########.##....##....##....##.....##..######.
  */

  /**
   * Crea un nueva cuenta en la base de datos
   *
   * @param cuenta cuenta a crear
   * @returns {SucursalEntity} entidad de cuenta
   */
  async createCuenta(cuenta: CreateCuentaDto): Promise<CuentaBancariaEntity> {
    let banco: BancoEntity;
    const cuentaToCreate = plainToClass(CuentaBancariaEntity, cuenta);
    if (cuenta.banco) {
      banco = await getRepository(BancoEntity).findOne(cuenta.banco);
    }

    const nuevaCuenta = await getRepository(CuentaBancariaEntity).save(
      cuentaToCreate,
    );
    nuevaCuenta.banco = banco;

    return nuevaCuenta;
  }
  /**
   * Retorna un cuenta por id
   * @param id
   */
  async getCuentaById(id: number): Promise<CuentaBancariaEntity> {
    const cuenta = getRepository(CuentaBancariaEntity).findOne(id);

    if (!cuenta) {
      throw new HttpException('cuenta no encontrado', HttpStatus.NOT_FOUND);
    }

    return cuenta;
  }
  /**
   * Actualiza un registro de cuenta
   *
   * @param id del cuenta a actualizar
   * @param cuenta data que actualiza el objeto
   */
  async updateCuenta(
    id: number,
    cuenta: UpdateCuentaDto,
  ): Promise<UpdateResult> {
    const Record = await this.getById(id);

    if (!Record) {
      throw new HttpException('cuenta no encontrado', HttpStatus.NOT_FOUND);
    }

    const cuentaActualizado = await getRepository(CuentaBancariaEntity).update(
      id,
      {
        nombre: cuenta.nombre,
        saldo: cuenta.saldo,
      },
    );

    return cuentaActualizado;
  }

  /**
   * Borra un registro
   *
   * @param id del objeto a borrar
   */
  async deleteCuenta(id: number): Promise<DeleteResult> {
    return getRepository(CuentaBancariaEntity).delete({ id });
  }

  /**
   * Pagina los insumos activos
   * @param options opciones de paginacion de los registros
   */
  async paginateCuenta(
    options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    const dataQuery = getRepository(CuentaBancariaEntity)
      .createQueryBuilder('cuenta')
      .select(['cuenta.nombre', 'cuenta.saldo']);
    forIn(options.filters, (value, key) => {
      if (key === 'nombre') {
        dataQuery.andWhere('( cuenta.nombre LIKE :term )', {
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

  /**
..######......###.....######..########..#######...######.
.##....##....##.##...##....##....##....##.....##.##....##
.##.........##...##..##..........##....##.....##.##......
.##...####.##.....##..######.....##....##.....##..######.
.##....##..#########.......##....##....##.....##.......##
.##....##..##.....##.##....##....##....##.....##.##....##
..######...##.....##..######.....##.....#######...######.
   */

  /**
   * Creat un tipo de cuenta de gasto
   *
   * @param tipoCuentaGasto datos del tipo cuenta gasto
   * @returns {TipoCuentaGastoEntity}
   */
  async crearTipoCuentaGasto(
    tipoCuentaGasto: CreateTipoCuentaGastoDTO,
  ): Promise<TipoCuentaGastoEntity> {
    let parent = null;
    if (tipoCuentaGasto.parentId) {
      parent = await getRepository(TipoCuentaGastoEntity).findOne(
        tipoCuentaGasto.parentId,
      );
    }
    return await getRepository(TipoCuentaGastoEntity).save({
      nombre: tipoCuentaGasto.nombre,
      clave: tipoCuentaGasto.clave,
      parent,
    });
  }

  /**
   * Actualiza un tipo cuenta gasto
   *
   * @param id id del tipo cuenta gasto
   * @param tipoCuentaGastos datos a actualizar
   * @returns {UpdateResult}
   */
  async actualizarTipoCuentaGasto(
    id: number,
    tipocuentaGasto: UpdateTipoCuentaGastoDTO,
  ): Promise<UpdateResult> {
    return await getRepository(TipoCuentaGastoEntity).update(
      id,
      tipocuentaGasto,
    );
  }

  async cuentaGastoPaginate(
    options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    const dataQuery = getRepository(TipoCuentaGastoEntity).createQueryBuilder(
      'cuentaG',
    );

    forIn(options.filters, (value, key) => {
      if (key === 'nombre') {
        dataQuery.orWhere('( cuentaG.nombre LIKE :term )', {
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

  async getCuentaGastoById(id: number): Promise<TipoCuentaGastoEntity> {
    return await getRepository(TipoCuentaGastoEntity).findOne(id);
  }

  /*
.##.....##..#######..##.....##.####.##.....##.####.########.##....##.########..#######...######.
.###...###.##.....##.##.....##..##..###...###..##..##.......###...##....##....##.....##.##....##
.####.####.##.....##.##.....##..##..####.####..##..##.......####..##....##....##.....##.##......
.##.###.##.##.....##.##.....##..##..##.###.##..##..######...##.##.##....##....##.....##..######.
.##.....##.##.....##..##...##...##..##.....##..##..##.......##..####....##....##.....##.......##
.##.....##.##.....##...##.##....##..##.....##..##..##.......##...###....##....##.....##.##....##
.##.....##..#######.....###....####.##.....##.####.########.##....##....##.....#######...######.
 */

  /**
   * Creat un movimiento de cuenta
   *
   * @param movimiento datos del tipo cuenta gasto
   * @returns {TipoCuentaGastoEntity}
   */
  async createMov(
    movimiento: CreateMovBancarioDTO,
  ): Promise<MovimientoCuentaBanco> {
    const movToCreate = plainToClass(MovimientoCuentaBanco, movimiento);

    const nuevoMov = await getRepository(MovimientoCuentaBanco).save(
      movToCreate,
    );

    return nuevoMov;
  }

  /**
   * Actualiza movimiento de una cuenta
   *
   * @param id id del tipo cuenta gasto
   * @param tipoCuentaGastos datos a actualizar
   * @returns {UpdateResult}
   */
  async updateMov(id: number, mov: UpdateMovimientoDTO): Promise<UpdateResult> {
    return await getRepository(MovimientoCuentaBanco).update(id, mov);
  }

  async paginateMov(
    options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    const dataQuery = getRepository(MovimientoCuentaBanco).createQueryBuilder(
      'movCuenta',
    );

    forIn(options.filters, (value, key) => {
      if (key === 'nombre') {
        dataQuery.orWhere('( movCuenta.referencia LIKE :term )', {
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

  async getMovById(id: number): Promise<MovimientoCuentaBanco> {
    return await getRepository(MovimientoCuentaBanco).findOne(id);
  }

  async deleteMov(id: number): Promise<DeleteResult> {
    return await getRepository(MovimientoCuentaBanco).delete(id);
  }
}
