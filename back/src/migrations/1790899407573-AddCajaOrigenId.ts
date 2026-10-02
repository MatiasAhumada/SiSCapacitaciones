import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCajaOrigenId1790899407573 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "cajas" ADD "origenCajaId" uuid');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "cajas" DROP COLUMN "origenCajaId"');
  }
}
