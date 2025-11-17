import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewPropsIngCaja1763344233351 implements MigrationInterface {
    name = 'AddNewPropsIngCaja1763344233351'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."cajas_tipo_enum" RENAME TO "cajas_tipo_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."cajas_tipo_enum" AS ENUM('Apertura', 'Ingreso', 'Aporte', 'Cobro Varios', 'Certificacion Examen', 'Egreso', 'Transferencia', 'Cierre')`);
        await queryRunner.query(`ALTER TABLE "cajas" ALTER COLUMN "tipo" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "cajas" ALTER COLUMN "tipo" TYPE "public"."cajas_tipo_enum" USING "tipo"::"text"::"public"."cajas_tipo_enum"`);
        await queryRunner.query(`ALTER TABLE "cajas" ALTER COLUMN "tipo" SET DEFAULT 'Ingreso'`);
        await queryRunner.query(`DROP TYPE "public"."cajas_tipo_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."cajas_tipo_enum_old" AS ENUM('Apertura', 'Ingreso', 'Egreso', 'Transferencia', 'Cierre')`);
        await queryRunner.query(`ALTER TABLE "cajas" ALTER COLUMN "tipo" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "cajas" ALTER COLUMN "tipo" TYPE "public"."cajas_tipo_enum_old" USING "tipo"::"text"::"public"."cajas_tipo_enum_old"`);
        await queryRunner.query(`ALTER TABLE "cajas" ALTER COLUMN "tipo" SET DEFAULT 'Ingreso'`);
        await queryRunner.query(`DROP TYPE "public"."cajas_tipo_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."cajas_tipo_enum_old" RENAME TO "cajas_tipo_enum"`);
    }

}
