import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCajaOrigenIndex1790900064057 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE INDEX "IDX_cajas_origenCajaId" ON "cajas" ("origenCajaId")',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_cajas_origenCajaId"');
  }
}
