"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathCotizacion1628619415434 = void 0;
class pathCotizacion1628619415434 {
    constructor() {
        this.name = 'pathCotizacion1628619415434';
    }
    async up(queryRunner) {
        await queryRunner.query("ALTER TABLE `compras` ADD `pathCotizacion` varchar(150) NULL");
    }
    async down(queryRunner) {
        await queryRunner.query("ALTER TABLE `compras` DROP COLUMN `pathCotizacion`");
    }
}
exports.pathCotizacion1628619415434 = pathCotizacion1628619415434;
//# sourceMappingURL=1628619415434-pathCotizacion.js.map