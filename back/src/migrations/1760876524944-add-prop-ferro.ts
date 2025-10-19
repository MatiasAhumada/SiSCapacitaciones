import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPropFerro1760876524944 implements MigrationInterface {
    name = 'AddPropFerro1760876524944'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sesiones_caja" ADD "totalFerro" numeric(10,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TYPE "public"."cajas_metodopago_enum" RENAME TO "cajas_metodopago_enum_old2"`);
        await queryRunner.query(`CREATE TYPE "public"."cajas_metodopago_enum" AS ENUM('Efectivo', 'Credito', 'Digital Tobias', 'Digital Javier', 'Ferro')`);
        await queryRunner.query(`ALTER TABLE "cajas" ALTER COLUMN "metodoPago" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "cajas" ALTER COLUMN "metodoPago" TYPE "public"."cajas_metodopago_enum" USING "metodoPago"::"text"::"public"."cajas_metodopago_enum"`);
        await queryRunner.query(`ALTER TABLE "cajas" ALTER COLUMN "metodoPago" SET DEFAULT 'Efectivo'`);
        await queryRunner.query(`DROP TYPE "public"."cajas_metodopago_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."cajas_metodopago_enum_old2" AS ENUM('Efectivo', 'Credito', 'Digital Tobias', 'Digital Javier')`);
        await queryRunner.query(`ALTER TABLE "cajas" ALTER COLUMN "metodoPago" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "cajas" ALTER COLUMN "metodoPago" TYPE "public"."cajas_metodopago_enum_old2" USING "metodoPago"::"text"::"public"."cajas_metodopago_enum_old2"`);
        await queryRunner.query(`ALTER TABLE "cajas" ALTER COLUMN "metodoPago" SET DEFAULT 'Efectivo'`);
        await queryRunner.query(`DROP TYPE "public"."cajas_metodopago_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."cajas_metodopago_enum_old2" RENAME TO "cajas_metodopago_enum"`);
        await queryRunner.query(`ALTER TABLE "sesiones_caja" DROP COLUMN "totalFerro"`);
    }

}
