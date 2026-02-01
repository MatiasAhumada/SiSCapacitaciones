import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFirmaUrlToInscripcion1769950340672
  implements MigrationInterface
{
  name = 'AddFirmaUrlToInscripcion1769950340672';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "inscripciones" ADD "firmaUrl" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "inscripciones" DROP COLUMN "firmaUrl"`,
    );
  }
}
