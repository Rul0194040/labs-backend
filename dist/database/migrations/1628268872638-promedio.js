"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promedio1628268872638 = void 0;
class promedio1628268872638 {
    constructor() {
        this.name = 'promedio1628268872638';
    }
    async up(queryRunner) {
        await queryRunner.query("ALTER TABLE `sucursalesInsumos` ADD `promedio` float NULL DEFAULT '0'");
    }
    async down(queryRunner) {
        await queryRunner.query("ALTER TABLE `sucursalesInsumos` DROP COLUMN `promedio`");
    }
}
exports.promedio1628268872638 = promedio1628268872638;
//# sourceMappingURL=1628268872638-promedio.js.map