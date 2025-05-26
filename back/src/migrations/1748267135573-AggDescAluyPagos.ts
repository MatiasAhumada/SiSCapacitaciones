import { MigrationInterface, QueryRunner } from "typeorm";

export class AggDescAluyPagos1748267135573 implements MigrationInterface {
    name = 'AggDescAluyPagos1748267135573'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cajas" ADD "descuento" integer DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "alumnos" ADD "descuento" integer DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "alumnos" DROP COLUMN "descuento"`);
        await queryRunner.query(`ALTER TABLE "cajas" DROP COLUMN "descuento"`);
    }

}
