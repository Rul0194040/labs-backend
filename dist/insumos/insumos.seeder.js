"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsumosSeeder = void 0;
const common_1 = require("@nestjs/common");
const tipo_insumo_entity_1 = require("../catalogos/tipos-insumos/tipo-insumo.entity");
const class_transformer_1 = require("class-transformer");
const typeorm_1 = require("typeorm");
const insumo_entity_1 = require("./insumo.entity");
const insumos_collection_1 = require("./insumos.collection");
let InsumosSeeder = class InsumosSeeder {
    async seed() {
        for (const bloqueInsumos of insumos_collection_1.InsumosToCreate) {
            const tipoIns = await typeorm_1.getRepository(tipo_insumo_entity_1.TipoInsumoEntity).findOne({
                id: bloqueInsumos.tipo,
            });
            if (tipoIns) {
                const insumosConTipo = class_transformer_1.plainToClass(insumo_entity_1.InsumoEntity, bloqueInsumos.insumos.map((i) => {
                    i.tipoInsumo = tipoIns;
                    return i;
                }));
                await typeorm_1.getRepository(insumo_entity_1.InsumoEntity).save(insumosConTipo);
            }
        }
        return;
    }
    async drop() {
        await typeorm_1.getRepository(insumo_entity_1.InsumoEntity).delete({});
        return true;
    }
};
InsumosSeeder = __decorate([
    common_1.Injectable()
], InsumosSeeder);
exports.InsumosSeeder = InsumosSeeder;
//# sourceMappingURL=insumos.seeder.js.map