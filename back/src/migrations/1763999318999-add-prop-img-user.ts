import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPropImgUser1763999318999 implements MigrationInterface {
  name = 'AddPropImgUser1763999318999';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "vendedores" ADD "img" text`);
    await queryRunner.query(`ALTER TABLE "admins" ADD "img" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "vendedores" DROP COLUMN "img"`);
    await queryRunner.query(`ALTER TABLE "admins" DROP COLUMN "img"`);
  }
}
