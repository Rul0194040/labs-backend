import { seeder } from 'nestjs-seeder';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { ConfigKeys } from './common/enum/configkeys.enum';
import { CatalogsSeeder } from './catalogos/catalogs.seeder';
import { GrupoServicioEntity } from './catalogos/grupos-servicios/grupo-servicio.entity';
import { TipoInsumoEntity } from './catalogos/tipos-insumos/tipo-insumo.entity';
import { TipoMuestraEntity } from './catalogos/tipos-muestras/tipos-muestras.entity';
import { TipoUnidadEntity } from './catalogos/tipos-unidades/tipos-unidades.entity';
import { ServiciosSeeder } from './servicios/servicios.seeder';
import { ServicioEntity } from './servicios/servicio.entity';
import { InsumosSeeder } from './insumos/insumos.seeder';
import { InsumoEntity } from './insumos/insumo.entity';

seeder({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        MYSQL_DB: Joi.string().required(),
        MYSQL_HOST: Joi.string().required(),
        MYSQL_USER: Joi.string().required(),
        MYSQL_PORT: Joi.number().default(3306),
        MYSQL_PASSWORD: Joi.string().required(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (_configService: ConfigService) => ({
        type: 'mysql',
        host: _configService.get<string>(ConfigKeys.MYSQL_HOST),
        port: parseInt(_configService.get<string>(ConfigKeys.MYSQL_PORT)),
        username: _configService.get<string>(ConfigKeys.MYSQL_USER),
        password: _configService.get<string>(ConfigKeys.MYSQL_PASSWORD),
        database: _configService.get<string>(ConfigKeys.MYSQL_DB),
        entities: [
          GrupoServicioEntity,
          TipoInsumoEntity,
          TipoMuestraEntity,
          TipoUnidadEntity,
          ServicioEntity,
          InsumoEntity,
        ],
        synchronize: false,
      }),
    }),
  ],
}).run([CatalogsSeeder, ServiciosSeeder, InsumosSeeder]);
