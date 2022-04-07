"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nestjs_seeder_1 = require("nestjs-seeder");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const Joi = require("@hapi/joi");
const configkeys_enum_1 = require("./common/enum/configkeys.enum");
const catalogs_seeder_1 = require("./catalogos/catalogs.seeder");
const grupo_servicio_entity_1 = require("./catalogos/grupos-servicios/grupo-servicio.entity");
const tipo_insumo_entity_1 = require("./catalogos/tipos-insumos/tipo-insumo.entity");
const tipos_muestras_entity_1 = require("./catalogos/tipos-muestras/tipos-muestras.entity");
const tipos_unidades_entity_1 = require("./catalogos/tipos-unidades/tipos-unidades.entity");
const servicios_seeder_1 = require("./servicios/servicios.seeder");
const servicio_entity_1 = require("./servicios/servicio.entity");
const insumos_seeder_1 = require("./insumos/insumos.seeder");
const insumo_entity_1 = require("./insumos/insumo.entity");
nestjs_seeder_1.seeder({
    imports: [
        config_1.ConfigModule.forRoot({
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
        typeorm_1.TypeOrmModule.forRootAsync({
            imports: [config_1.ConfigModule],
            inject: [config_1.ConfigService],
            useFactory: (_configService) => ({
                type: 'mysql',
                host: _configService.get(configkeys_enum_1.ConfigKeys.MYSQL_HOST),
                port: parseInt(_configService.get(configkeys_enum_1.ConfigKeys.MYSQL_PORT)),
                username: _configService.get(configkeys_enum_1.ConfigKeys.MYSQL_USER),
                password: _configService.get(configkeys_enum_1.ConfigKeys.MYSQL_PASSWORD),
                database: _configService.get(configkeys_enum_1.ConfigKeys.MYSQL_DB),
                entities: [
                    grupo_servicio_entity_1.GrupoServicioEntity,
                    tipo_insumo_entity_1.TipoInsumoEntity,
                    tipos_muestras_entity_1.TipoMuestraEntity,
                    tipos_unidades_entity_1.TipoUnidadEntity,
                    servicio_entity_1.ServicioEntity,
                    insumo_entity_1.InsumoEntity,
                ],
                synchronize: false,
            }),
        }),
    ],
}).run([catalogs_seeder_1.CatalogsSeeder, servicios_seeder_1.ServiciosSeeder, insumos_seeder_1.InsumosSeeder]);
//# sourceMappingURL=app.seeder.js.map