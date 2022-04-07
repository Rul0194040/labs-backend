"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogsSeeder = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const grupo_servicio_entity_1 = require("./grupos-servicios/grupo-servicio.entity");
const grupos_servicios_collection_1 = require("./grupos-servicios/grupos-servicios.collection");
const tipo_insumo_entity_1 = require("./tipos-insumos/tipo-insumo.entity");
const tipos_insumos_collection_1 = require("./tipos-insumos/tipos-insumos.collection");
const tipos_muestras_collection_1 = require("./tipos-muestras/tipos-muestras.collection");
const tipos_muestras_entity_1 = require("./tipos-muestras/tipos-muestras.entity");
const tipos_unidades_collection_1 = require("./tipos-unidades/tipos-unidades.collection");
const tipos_unidades_entity_1 = require("./tipos-unidades/tipos-unidades.entity");
let CatalogsSeeder = class CatalogsSeeder {
    async seed() {
        const createdGruposServicios = await typeorm_1.getRepository(grupo_servicio_entity_1.GrupoServicioEntity).save(grupos_servicios_collection_1.GruposServiciosToCreate);
        const createdTipoInsumoEntity = await typeorm_1.getRepository(tipo_insumo_entity_1.TipoInsumoEntity).save(tipos_insumos_collection_1.TiposInsumosToCreate);
        const createdTiposMuestras = await typeorm_1.getRepository(tipos_muestras_entity_1.TipoMuestraEntity).save(tipos_muestras_collection_1.TiposMuestrasToCreate);
        const createdTiposUnidades = await typeorm_1.getRepository(tipos_unidades_entity_1.TipoUnidadEntity).save(tipos_unidades_collection_1.TiposUnidadesToCreate);
        return {
            createdGruposServicios,
            createdTipoInsumoEntity,
            createdTiposMuestras,
            createdTiposUnidades,
        };
    }
    async drop() {
        await typeorm_1.getRepository(grupo_servicio_entity_1.GrupoServicioEntity).delete({});
        await typeorm_1.getRepository(tipo_insumo_entity_1.TipoInsumoEntity).delete({});
        await typeorm_1.getRepository(tipos_muestras_entity_1.TipoMuestraEntity).delete({});
        await typeorm_1.getRepository(tipos_unidades_entity_1.TipoUnidadEntity).delete({});
        return true;
    }
};
CatalogsSeeder = __decorate([
    common_1.Injectable()
], CatalogsSeeder);
exports.CatalogsSeeder = CatalogsSeeder;
//# sourceMappingURL=catalogs.seeder.js.map