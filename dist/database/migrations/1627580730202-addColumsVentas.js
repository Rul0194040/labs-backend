"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addColumsVentas1627580730202 = void 0;
class addColumsVentas1627580730202 {
    constructor() {
        this.name = 'addColumsVentas1627580730202';
    }
    async up(queryRunner) {
        await queryRunner.query("DROP INDEX `IDX_c12f2495d17fc6428bb6dfdbad` ON `medicos`");
        await queryRunner.query("ALTER TABLE `ventas` ADD `tipoPrecio` varchar(10) NOT NULL DEFAULT 'REGULAR'");
        await queryRunner.query("ALTER TABLE `clientes` CHANGE `tipoConvenio` `tipoConvenio` varchar(20) NOT NULL DEFAULT 'EMPLEADO'");
    }
    async down(queryRunner) {
        await queryRunner.query("ALTER TABLE `clientes` CHANGE `tipoConvenio` `tipoConvenio` varchar(20) NOT NULL");
        await queryRunner.query("ALTER TABLE `ventas` DROP COLUMN `tipoPrecio`");
        await queryRunner.query("CREATE UNIQUE INDEX `IDX_c12f2495d17fc6428bb6dfdbad` ON `medicos` (`email`)");
    }
}
exports.addColumsVentas1627580730202 = addColumsVentas1627580730202;
//# sourceMappingURL=1627580730202-addColumsVentas.js.map