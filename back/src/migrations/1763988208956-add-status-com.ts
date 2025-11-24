import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatusCom1763988208956 implements MigrationInterface {
  name = 'AddStatusCom1763988208956';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comisiones" ADD "status" boolean NOT NULL DEFAULT true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "comisiones" DROP COLUMN "status"`);
  }
}
