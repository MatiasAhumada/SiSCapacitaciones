import { MigrationInterface, QueryRunner } from "typeorm";

export class Cambiodnixtelenprofe1748265779960 implements MigrationInterface {
    name = 'Cambiodnixtelenprofe1748265779960'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profesores" RENAME COLUMN "dni" TO "tel"`);
        await queryRunner.query(`ALTER TABLE "profesores" ALTER COLUMN "tel" TYPE VARCHAR USING tel::VARCHAR;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profesores" DROP COLUMN "tel"`);
        await queryRunner.query(`ALTER TABLE "profesores" ADD "tel" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "profesores" RENAME COLUMN "tel" TO "dni"`);
    }

}
