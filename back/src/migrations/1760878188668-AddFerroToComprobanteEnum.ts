import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFerroToComprobanteEnum1760878188668
  implements MigrationInterface
{
  name = 'AddFerroToComprobanteEnum1760878188668';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."comprobantes_formapago_enum" RENAME TO "comprobantes_formapago_enum_old2"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."comprobantes_formapago_enum" AS ENUM('Efectivo', 'Credito', 'Digital Tobias', 'Digital Javier', 'Ferro')`,
    );
    await queryRunner.query(
      `ALTER TABLE "comprobantes" ALTER COLUMN "formaPago" TYPE "public"."comprobantes_formapago_enum" USING "formaPago"::"text"::"public"."comprobantes_formapago_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."comprobantes_formapago_enum_old2"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."comprobantes_formapago_enum_old2" AS ENUM('Efectivo', 'Credito', 'Digital Tobias', 'Digital Javier')`,
    );
    await queryRunner.query(
      `ALTER TABLE "comprobantes" ALTER COLUMN "formaPago" TYPE "public"."comprobantes_formapago_enum_old2" USING "formaPago"::"text"::"public"."comprobantes_formapago_enum_old2"`,
    );
    await queryRunner.query(`DROP TYPE "public"."comprobantes_formapago_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."comprobantes_formapago_enum_old2" RENAME TO "comprobantes_formapago_enum"`,
    );
  }
}
