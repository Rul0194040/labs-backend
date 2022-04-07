"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addColumsVentas1625182762990 = void 0;
class addColumsVentas1625182762990 {
    constructor() {
        this.name = 'addColumsVentas1625182762990';
    }
    async up(queryRunner) {
        await queryRunner.query("ALTER TABLE `ventas` ADD `fechaUltimaRegla` date NULL");
        await queryRunner.query("ALTER TABLE `ventas` ADD `observaciones` text NULL");
        await queryRunner.query("ALTER TABLE `ventas` ADD `diagnostico` text NULL");
    }
    async down(queryRunner) {
        await queryRunner.query("ALTER TABLE `ventas` DROP COLUMN `diagnostico`");
        await queryRunner.query("ALTER TABLE `ventas` DROP COLUMN `observaciones`");
        await queryRunner.query("ALTER TABLE `ventas` DROP COLUMN `fechaUltimaRegla`");
    }
}
exports.addColumsVentas1625182762990 = addColumsVentas1625182762990;
//# sourceMappingURL=1625182762990-addColumsVentas.js.map