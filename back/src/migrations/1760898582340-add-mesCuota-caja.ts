import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMesCuotaCaja1760898582340 implements MigrationInterface {
  name = 'AddMesCuotaCaja1760898582340';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cajas" ADD "mesCuota" text DEFAULT '-'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "cajas" DROP COLUMN "mesCuota"`);
  }
}
