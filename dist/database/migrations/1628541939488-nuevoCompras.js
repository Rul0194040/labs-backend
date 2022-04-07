"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nuevoCompras1628541939488 = void 0;
class nuevoCompras1628541939488 {
    constructor() {
        this.name = 'nuevoCompras1628541939488';
    }
    async up(queryRunner) {
        await queryRunner.query("ALTER TABLE `insumos` ADD `clave` varchar(150) NULL");
        await queryRunner.query("ALTER TABLE `compras` ADD `conClave` tinyint NOT NULL DEFAULT 0");
    }
    async down(queryRunner) {
        await queryRunner.query("ALTER TABLE `compras` DROP COLUMN `conClave`");
        await queryRunner.query("ALTER TABLE `insumos` DROP COLUMN `clave`");
    }
}
exports.nuevoCompras1628541939488 = nuevoCompras1628541939488;
//# sourceMappingURL=1628541939488-nuevoCompras.js.map