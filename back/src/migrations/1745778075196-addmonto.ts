import { MigrationInterface, QueryRunner } from "typeorm";

export class Addmonto1745778075196 implements MigrationInterface {
    name = 'Addmonto1745778075196'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cajas" ADD "monto" numeric(10,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cajas" DROP COLUMN "monto"`);
    }

}
