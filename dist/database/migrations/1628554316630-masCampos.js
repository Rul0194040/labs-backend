"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.masCampos1628554316630 = void 0;
class masCampos1628554316630 {
    constructor() {
        this.name = 'masCampos1628554316630';
    }
    async up(queryRunner) {
        await queryRunner.query("ALTER TABLE `compras` ADD `folio` varchar(150) NULL");
        await queryRunner.query("ALTER TABLE `compras` ADD `numCotizacion` int NOT NULL DEFAULT '0'");
        await queryRunner.query("ALTER TABLE `detallesCompras` ADD `clave` varchar(150) NULL");
    }
    async down(queryRunner) {
        await queryRunner.query("ALTER TABLE `detallesCompras` DROP COLUMN `clave`");
        await queryRunner.query("ALTER TABLE `compras` DROP COLUMN `numCotizacion`");
        await queryRunner.query("ALTER TABLE `compras` DROP COLUMN `folio`");
    }
}
exports.masCampos1628554316630 = masCampos1628554316630;
//# sourceMappingURL=1628554316630-masCampos.js.map