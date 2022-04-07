"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRules1627412691441 = void 0;
class loginRules1627412691441 {
    constructor() {
        this.name = 'loginRules1627412691441';
    }
    async up(queryRunner) {
        await queryRunner.query("ALTER TABLE `users` ADD `tipoEmpleado` varchar(50) NOT NULL DEFAULT 'general'");
        await queryRunner.query("ALTER TABLE `users` ADD `accesoSistema` tinyint NOT NULL DEFAULT 1");
        await queryRunner.query("ALTER TABLE `users` ADD `grabandoRules` tinyint NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `users` ADD `comisionVendedor` float NULL");
        await queryRunner.query("ALTER TABLE `ventas` ADD `notaDescuento` text NULL");
        await queryRunner.query("ALTER TABLE `ventas` ADD `captadorId` int NULL");
        await queryRunner.query("ALTER TABLE `ventas` ADD `vendedorId` int NULL");
        await queryRunner.query("ALTER TABLE `ventas` ADD `maquiladorId` int NULL");
        await queryRunner.query("ALTER TABLE `ventas` ADD CONSTRAINT `FK_4645bf3ebd964472d3b5b731a1e` FOREIGN KEY (`captadorId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `ventas` ADD CONSTRAINT `FK_5374eca53d7349dc60995ee9c10` FOREIGN KEY (`vendedorId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `ventas` ADD CONSTRAINT `FK_9d73dc084e0bd03158e42a863c4` FOREIGN KEY (`maquiladorId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }
    async down(queryRunner) {
        await queryRunner.query("ALTER TABLE `ventas` DROP FOREIGN KEY `FK_9d73dc084e0bd03158e42a863c4`");
        await queryRunner.query("ALTER TABLE `ventas` DROP FOREIGN KEY `FK_5374eca53d7349dc60995ee9c10`");
        await queryRunner.query("ALTER TABLE `ventas` DROP FOREIGN KEY `FK_4645bf3ebd964472d3b5b731a1e`");
        await queryRunner.query("ALTER TABLE `ventas` DROP COLUMN `maquiladorId`");
        await queryRunner.query("ALTER TABLE `ventas` DROP COLUMN `vendedorId`");
        await queryRunner.query("ALTER TABLE `ventas` DROP COLUMN `captadorId`");
        await queryRunner.query("ALTER TABLE `ventas` DROP COLUMN `notaDescuento`");
        await queryRunner.query("ALTER TABLE `users` DROP COLUMN `comisionVendedor`");
        await queryRunner.query("ALTER TABLE `users` DROP COLUMN `grabandoRules`");
        await queryRunner.query("ALTER TABLE `users` DROP COLUMN `accesoSistema`");
        await queryRunner.query("ALTER TABLE `users` DROP COLUMN `tipoEmpleado`");
    }
}
exports.loginRules1627412691441 = loginRules1627412691441;
//# sourceMappingURL=1627412691441-loginRules.js.map