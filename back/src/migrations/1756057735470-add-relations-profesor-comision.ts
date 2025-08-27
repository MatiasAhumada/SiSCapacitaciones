import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRelationsProfesorComision1756057735470 implements MigrationInterface {
    name = 'AddRelationsProfesorComision1756057735470'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "asistencia_profesor" DROP CONSTRAINT "FK_3ae94e175e61a9167a3b91a62f6"`);
        await queryRunner.query(`ALTER TABLE "asistencia_profesor" RENAME COLUMN "profesorId" TO "profesor_id"`);
        await queryRunner.query(`ALTER TABLE "asistencia_profesor" ADD CONSTRAINT "FK_af42c2e19063b99df722a1926a3" FOREIGN KEY ("profesor_id") REFERENCES "profesores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "asistencia_profesor" DROP CONSTRAINT "FK_af42c2e19063b99df722a1926a3"`);
        await queryRunner.query(`ALTER TABLE "asistencia_profesor" RENAME COLUMN "profesor_id" TO "profesorId"`);
        await queryRunner.query(`ALTER TABLE "asistencia_profesor" ADD CONSTRAINT "FK_3ae94e175e61a9167a3b91a62f6" FOREIGN KEY ("profesorId") REFERENCES "profesores"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
