import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveFirmaBase64FromInscripcion1769950793370
  implements MigrationInterface
{
  name = 'RemoveFirmaBase64FromInscripcion1769950793370';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "inscripciones" DROP COLUMN "firmaBase64"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "inscripciones" ADD "firmaBase64" text`,
    );
  }
}
