import { MigrationInterface, QueryRunner } from 'typeorm';

export class PreserveDataWhenDeletingComision1788361690993
  implements MigrationInterface
{
  name = 'PreserveDataWhenDeletingComision1788361690993';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "inscripciones" DROP CONSTRAINT "FK_da7933441a70b300e5c73424873"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cajas" DROP CONSTRAINT "FK_16fda5046d86b54543d46ee4165"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inscripciones" ADD CONSTRAINT "FK_da7933441a70b300e5c73424873" FOREIGN KEY ("comisionId") REFERENCES "comisiones"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cajas" ADD CONSTRAINT "FK_16fda5046d86b54543d46ee4165" FOREIGN KEY ("alumnoComisionId") REFERENCES "alumno_comision"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cajas" DROP CONSTRAINT "FK_16fda5046d86b54543d46ee4165"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inscripciones" DROP CONSTRAINT "FK_da7933441a70b300e5c73424873"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cajas" ADD CONSTRAINT "FK_16fda5046d86b54543d46ee4165" FOREIGN KEY ("alumnoComisionId") REFERENCES "alumno_comision"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inscripciones" ADD CONSTRAINT "FK_da7933441a70b300e5c73424873" FOREIGN KEY ("comisionId") REFERENCES "comisiones"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
