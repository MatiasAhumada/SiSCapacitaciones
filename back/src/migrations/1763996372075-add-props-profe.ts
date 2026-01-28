import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPropsProfe1763996372075 implements MigrationInterface {
  name = 'AddPropsProfe1763996372075';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "profesores" ADD "email" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "profesores" ADD "direccion" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "profesores" DROP COLUMN "direccion"`);
    await queryRunner.query(`ALTER TABLE "profesores" DROP COLUMN "email"`);
  }
}
