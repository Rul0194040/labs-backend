"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QrsService = void 0;
const common_1 = require("@nestjs/common");
const moment = require("moment");
const typeorm_1 = require("typeorm");
const qrs_entity_1 = require("./qrs.entity");
let QrsService = class QrsService {
    async generarQr(sucursalId) {
        const qrRepo = typeorm_1.getRepository(qrs_entity_1.QrsEntity);
        const existente = await qrRepo
            .createQueryBuilder('q')
            .leftJoin('q.sucursal', 's')
            .leftJoin('q.empleado', 'e')
            .where('s.id = :sId', { sId: sucursalId })
            .andWhere('e.id IS NULL')
            .getOne();
        return existente
            ? existente
            : await qrRepo.save({
                sucursalId,
            });
    }
    async quemarQr(uuid, empleadoId, entrada, lat, lng) {
        await typeorm_1.getRepository(qrs_entity_1.QrsEntity)
            .createQueryBuilder()
            .update()
            .set({
            empleadoId,
            entrada,
            lat,
            lng,
            fechaHora: moment().format('YYYY-MM-DD H:m:s'),
        })
            .where('uuid=:elUuid', { elUuid: uuid })
            .execute();
        return typeorm_1.getRepository(qrs_entity_1.QrsEntity).findOne({ uuid });
    }
    async getByUuid(uuid) {
        return await typeorm_1.getRepository(qrs_entity_1.QrsEntity).findOne({
            where: { uuid },
            relations: ['sucursal'],
        });
    }
};
QrsService = __decorate([
    common_1.Injectable()
], QrsService);
exports.QrsService = QrsService;
//# sourceMappingURL=qrs.service.js.map