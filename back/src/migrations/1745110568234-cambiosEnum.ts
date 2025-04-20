import { MigrationInterface, QueryRunner } from "typeorm";

export class CambiosEnum1745110568234 implements MigrationInterface {
    name = 'CambiosEnum1745110568234'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."cajas_metodopago_enum" RENAME TO "cajas_metodopago_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."cajas_metodopago_enum" AS ENUM('Efectivo', 'Debito', 'Credito', 'Transferencia')`);
        await queryRunner.query(`ALTER TABLE "cajas" ALTER COLUMN "metodoPago" TYPE "public"."cajas_metodopago_enum" USING "metodoPago"::"text"::"public"."cajas_metodopago_enum"`);
        await queryRunner.query(`DROP TYPE "public"."cajas_metodopago_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."cajas_metodopago_enum_old" AS ENUM('efectivo', 'debito', 'credito', 'transferencia', 'Efectivo', 'Debito', 'Credito', 'Transferencia')`);
        await queryRunner.query(`ALTER TABLE "cajas" ALTER COLUMN "metodoPago" TYPE "public"."cajas_metodopago_enum_old" USING "metodoPago"::"text"::"public"."cajas_metodopago_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."cajas_metodopago_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."cajas_metodopago_enum_old" RENAME TO "cajas_metodopago_enum"`);
    }

}
