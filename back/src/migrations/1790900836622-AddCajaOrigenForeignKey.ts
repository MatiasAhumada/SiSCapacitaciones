import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCajaOrigenForeignKey1790900836622
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "cajas" ADD CONSTRAINT "FK_cajas_origenCaja" FOREIGN KEY ("origenCajaId") REFERENCES "cajas"("id") ON DELETE SET NULL ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "cajas" DROP CONSTRAINT "FK_cajas_origenCaja"',
    );
  }
}
