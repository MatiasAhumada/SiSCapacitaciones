import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPropsFirma1767483812444 implements MigrationInterface {
    name = 'AddPropsFirma1767483812444'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inscripciones" ADD "firmaBase64" text`);
        await queryRunner.query(`ALTER TABLE "inscripciones" ADD "fechaFirma" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "inscripciones" ADD "firmado" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inscripciones" DROP COLUMN "firmado"`);
        await queryRunner.query(`ALTER TABLE "inscripciones" DROP COLUMN "fechaFirma"`);
        await queryRunner.query(`ALTER TABLE "inscripciones" DROP COLUMN "firmaBase64"`);
    }

}
