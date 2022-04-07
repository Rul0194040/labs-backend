"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accesoVenta1625257995633 = void 0;
class accesoVenta1625257995633 {
    constructor() {
        this.name = 'accesoVenta1625257995633';
    }
    async up(queryRunner) {
        await queryRunner.query("ALTER TABLE `ventas` ADD `acceso` varchar(8) NOT NULL DEFAULT ''");
    }
    async down(queryRunner) {
        await queryRunner.query("ALTER TABLE `ventas` DROP COLUMN `acceso`");
    }
}
exports.accesoVenta1625257995633 = accesoVenta1625257995633;
//# sourceMappingURL=1625257995633-accesoVenta.js.map