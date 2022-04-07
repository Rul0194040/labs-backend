import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigKeys } from '@sanfrancisco/common/enum/configkeys.enum';
import { MyLogger } from '@sanfrancisco/logger';
import { ApiKeyEntity } from '@sanfrancisco/sucursales/api-keys.entity';
import { InformeFolioDTO } from '@sanfrancisco/ventas/DTOs/informe-folio.dto';
import * as moment from 'moment';
//import { ConfigKeys } from '@sanfrancisco/common/enum/configkeys.enum';
import { getRepository } from 'typeorm';
import { TareasEntity } from './tareas.entity';

@Injectable()
export class PxlabService {
  private pxLabServiceURL: string;
  private logger = new MyLogger(PxlabService.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.pxLabServiceURL = this.configService.get<string>(
      ConfigKeys.PX_LAB_SERVER,
    );
  }

  /**
   * Sincroniza los servicios con px lab
   *
   * Ejemplo de cadena:
   *
   * 'idServicio|idPaciente|N|P|DULCE MARIA|PRADO|HERNANDEZ|F|17/12/1962|dulceph@hotmail.com|PATRICIA DEL ROSARIO NIEVES PRIETO|100.00|102|358|367|377|',
   *
   * idServicio : No de Orden (numero interno de xquenda(detalleVenta.id))
   * idPaciente : No de Paciente(ya no importa)
   * N : Orden Nueva, M = Modificacion(agregar o quitar algun estudio), C : Cancelación Total
   * P : (cuentaPxLab) Clave de cliente (deben tambien estar sincronizados).
   * DULCE MARIA : Nombre paciente
   * PRADO : Apellido Paterno paciente
   * HERNANDEZ: Apellido Materno paciente
   * F : Sexo F ó M
   * 17/12/1962 : Fecha de nacimiento (a partir de esta el sistema calcula la edad)
   * dulceph@hotmail.com: email
   * PATRICIA DEL ROSARIO NIEVES PRIETO : Médico
   * 100.00: total de la venta (no requerido)
   * |102|358|367|377| : Claves de estudios de PxLab ORDENADAS
   *
   * @returns 200 {"MuestraResult": "1|11390001"}
   * <1:todo bien, 0:no se pudo>|<folioPxLab cuando es 1|mensaje de error cuando es cero>
   *
   */
  async enviarVenta(
    venta: InformeFolioDTO,
    tipo = 'N',
  ): Promise<TareasEntity[]> {
    //armar la cadena para el ws de pxlab
    //modificar=M|N nuevo|C cancelar
    const clienteId =
      venta.venta.cliente && venta.venta.cliente.cuentaPxLab
        ? venta.venta.cliente.cuentaPxLab
        : 1; //Por instrucciones del ing antonio, la cuenta publica es 1 (cuando no hay cliente)
    let stringServicio = `${venta.venta.id}|0|${tipo}|${clienteId}|${
      venta.venta.paciente.nombre
    }|${venta.venta.paciente.apellidoPaterno}|${
      venta.venta.paciente.apellidoMaterno
    }|${venta.venta.paciente.sexo[0]}|${moment(
      venta.venta.paciente.fechaNac,
    ).format('DD/MM/YYYY')}|${venta.venta.paciente.email}|${
      venta.venta.medico.nombre
    }|0|${
      venta.venta.fechaUltimaRegla
        ? moment(venta.venta.fechaUltimaRegla).format('DD/MM/YYYY')
        : ''
    }|${venta.venta.diagnostico || ''}|${venta.venta.observaciones || ''}|`; //+estudios con su foliopx

    //venta.venta.fechaUltimaRegla, venta.venta.observaciones, venta.venta.diagnostico

    for (let i = 0; i < venta.detalle.length; i++) {
      const d = venta.detalle[i];
      stringServicio += `${d.servicio.clave}|`; //clave de servicio (proviene de px)
    }

    //generacion de tareas para esa sucursal, segun sus apikeys activos
    this.logger.verbose(
      `Nueva tarea (venta ${venta.venta.sucursal.nombre}): ${stringServicio}`,
    );
    //agregar a la cola de tareas, la entrega de este registro a los px lab de su sucursal (uno por apikey).
    //const apikeys = venta.venta.sucursal.apiKey.split(',').map((a) => a.trim());

    const apikeys = await getRepository(ApiKeyEntity).find({
      where: { sucursal: venta.venta.sucursal.id, active: true },
      relations: ['sucursal'],
    });

    this.logger.verbose(
      'Encontrados ' + apikeys.length + ' destinos para tarea.',
    );

    const tareas: TareasEntity[] = [];
    // por cada destino que tengan las sucursales (apikeys), generar una tarea de entrega
    for (let index = 0; index < apikeys.length; index++) {
      const apikey = apikeys[index];
      if (apikey) {
        const tareaNueva = await getRepository(TareasEntity).save({
          event: 'nuevaVenta',
          data: stringServicio,
          channel: apikey.key,
          sucursal: apikey.sucursal,
        });

        //enviarla de una vez en caso que este en linea.
        this.eventEmitter.emit('gateway.send', {
          event: tareaNueva.event,
          channel: tareaNueva.channel,
          data: tareaNueva,
        });
        tareas.push(tareaNueva);
      }
    }

    this.logger.verbose('Generadas ' + tareas.length + ' tareas.');

    return tareas;
  }

  /**
   * Sincroniza los clientes con el ws conectado a px lab
   * del inge antonio.
   *
   * El otro método de WS es Cliente y la cadena quedaría así
   * "4|M|BBVA|servclient@BBVA.com.mx"
   * id_Cliente|N=Nuevo, M=Actualizar|Nombre Cliente| email|
   *
   * @returns
   *
   * {
   *   "ClienteResult": "1|Cliente: 10001 Registrado"
   * }
   */
  async enviarCliente(
    /* cliente.id, N|M, cliente.nombre, cliente.email */

    cuentaPxLab: string,
    nombre: string,
    email: string,
    esNuevo = true,
  ) {
    const ClienteString = `${cuentaPxLab}|${
      esNuevo ? 'N' : 'M'
    }|${nombre}|${email}`;

    //armar cadena de cliente
    this.logger.verbose(`Nueva tarea (cliente): ${ClienteString}`);
    //agregar a la cola de tareas, la entrega de este registro a los px lab de su sucursal (uno por apikey).
    //obtener apikeys activos para todas las sucursales activas.
    const apikeys = await getRepository(ApiKeyEntity)
      .createQueryBuilder('a')
      .leftJoin('a.sucursal', 's')
      .select(['a', 's'])
      .where('a.active = :activos AND s.active = :activos', { activos: true })
      .getMany();

    this.logger.verbose(
      'Encontrados ' + apikeys.length + ' destinos para tarea.',
    );

    const tareas: TareasEntity[] = [];
    // por cada destino que tengan las sucursales (apikeys), generar una tarea de entrega
    for (let index = 0; index < apikeys.length; index++) {
      const apikey = apikeys[index];
      if (apikey) {
        const tareaNueva = await getRepository(TareasEntity).save({
          event: 'nuevoCliente',
          data: ClienteString,
          channel: apikey.key,
          sucursal: apikey.sucursal,
        });
        //enviarla de una vez en caso que este en linea.
        this.eventEmitter.emit('gateway.send', {
          event: tareaNueva.event,
          channel: tareaNueva.channel,
          data: tareaNueva,
        });
        tareas.push(tareaNueva);
      }
    }
    this.logger.verbose('Generadas ' + tareas.length + ' tareas.');
    return tareas;
  }

  /**
   *
   * El Método se llama Estudio, la cadena de datos quedaría así:
   * 4521|N|Covid Sars Cov-2|
   * clave del estudio: 4521
   * Tipo de movimiento: N (Nuevo) M (Modificación)
   * Nombre del Estudio: Covid Sars Cov-2
   *
   * Enviar a matriz
   *
   * @param clave
   * @param nombre
   * @param esNuevo
   * @returns
   */
  async enviarEstudio(clave: string, nombre: string, esNuevo = true) {
    //armar cadena de estudio
    const EstudioString = `${clave}|${esNuevo ? 'N' : 'M'}|${nombre}|`;
    this.logger.verbose('enviando estudio' + EstudioString);

    this.logger.verbose(`Nueva tarea (estudio): ${EstudioString}`);
    //agregar a la cola de tareas, la entrega de este registro a los px lab de matriz (uno por apikey).
    //obtener apikeys activos para la matriz
    const apikeys = await getRepository(ApiKeyEntity)
      .createQueryBuilder('a')
      .leftJoin('a.sucursal', 's')
      .select(['a', 's'])
      .where(
        'a.active = :activos AND s.active = :activos AND s.esMatriz = :activos',
        { activos: true },
      )
      .getMany();

    this.logger.verbose(
      'Encontrados ' + apikeys.length + ' destinos para tarea.',
    );

    const tareas: TareasEntity[] = [];
    // por cada destino que tengan las sucursales (apikeys), generar una tarea de entrega
    for (let index = 0; index < apikeys.length; index++) {
      const apikey = apikeys[index];
      if (apikey) {
        const tareaNueva = await getRepository(TareasEntity).save({
          event: 'nuevoEstudio',
          data: EstudioString,
          channel: apikey.key,
          sucursal: apikey.sucursal,
        });
        //enviarla de una vez en caso que este en linea.
        this.eventEmitter.emit('gateway.send', {
          event: tareaNueva.event,
          channel: tareaNueva.channel,
          data: tareaNueva,
        });
        tareas.push(tareaNueva);
      }
    }
    this.logger.verbose('Generadas ' + tareas.length + ' tareas.');
    return tareas;
  }
}
