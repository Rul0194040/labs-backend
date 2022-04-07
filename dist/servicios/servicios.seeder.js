"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiciosSeeder = void 0;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const typeorm_1 = require("typeorm");
const servicio_entity_1 = require("./servicio.entity");
const servicios_collection_1 = require("./servicios.collection");
let ServiciosSeeder = class ServiciosSeeder {
    async seed() {
        const final = servicios_collection_1.ServiciosToCreate.map((s) => {
            const ent = class_transformer_1.plainToClass(servicio_entity_1.ServicioEntity, s);
            ent.precio2 = s.precio;
            ent.precio3 = s.precio;
            return ent;
        });
        const createdServicios = await typeorm_1.getRepository(servicio_entity_1.ServicioEntity).save(final);
        return {
            createdServicios,
        };
    }
    async drop() {
        await typeorm_1.getRepository(servicio_entity_1.ServicioEntity).delete({});
        return true;
    }
};
ServiciosSeeder = __decorate([
    common_1.Injectable()
], ServiciosSeeder);
exports.ServiciosSeeder = ServiciosSeeder;
//# sourceMappingURL=servicios.seeder.js.map