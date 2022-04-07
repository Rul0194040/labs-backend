"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniqueClaveServicio1625699482076 = void 0;
class uniqueClaveServicio1625699482076 {
    constructor() {
        this.name = 'uniqueClaveServicio1625699482076';
    }
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE `servicios` ADD UNIQUE INDEX `IDX_a9b520d7849a9e60c4fc1eeb4f` (`clave`)');
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE `servicios` DROP INDEX `IDX_a9b520d7849a9e60c4fc1eeb4f`');
    }
}
exports.uniqueClaveServicio1625699482076 = uniqueClaveServicio1625699482076;
//# sourceMappingURL=1625699482076-uniqueClaveServicio.js.map