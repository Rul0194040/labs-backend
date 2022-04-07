"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tareasSucursal1625764322340 = void 0;
class tareasSucursal1625764322340 {
    constructor() {
        this.name = 'tareasSucursal1625764322340';
    }
    async up(queryRunner) {
        await queryRunner.query("ALTER TABLE `tareas` ADD `sucursalId` int NULL");
        await queryRunner.query("ALTER TABLE `tareas` ADD CONSTRAINT `FK_f9ccef11135bff6bce7dcafb07c` FOREIGN KEY (`sucursalId`) REFERENCES `sucursales`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }
    async down(queryRunner) {
        await queryRunner.query("ALTER TABLE `tareas` DROP FOREIGN KEY `FK_f9ccef11135bff6bce7dcafb07c`");
        await queryRunner.query("ALTER TABLE `tareas` DROP COLUMN `sucursalId`");
    }
}
exports.tareasSucursal1625764322340 = tareasSucursal1625764322340;
//# sourceMappingURL=1625764322340-tareasSucursal.js.map