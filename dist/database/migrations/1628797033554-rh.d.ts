import { MigrationInterface, QueryRunner } from "typeorm";
export declare class rh1628797033554 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
