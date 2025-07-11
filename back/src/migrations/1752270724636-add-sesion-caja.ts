import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSesionCaja1752270724636 implements MigrationInterface {
    name = 'AddSesionCaja1752270724636'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sesiones_caja" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fechaApertura" TIMESTAMP NOT NULL DEFAULT now(), "fechaCierre" TIMESTAMP, "montoApertura" numeric(10,2) NOT NULL, "montoCierre" numeric(10,2), "totalIngresos" numeric(10,2) NOT NULL DEFAULT '0', "totalEgresos" numeric(10,2) NOT NULL DEFAULT '0', CONSTRAINT "PK_2be32d7b54e0475de4659439f04" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "cajas" ADD "sesionCajaId" uuid`);
        await queryRunner.query(`ALTER TABLE "cajas" ADD CONSTRAINT "FK_7e77c251ac05ed2e0f84e4b14c3" FOREIGN KEY ("sesionCajaId") REFERENCES "sesiones_caja"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cajas" DROP CONSTRAINT "FK_7e77c251ac05ed2e0f84e4b14c3"`);
        await queryRunner.query(`ALTER TABLE "cajas" DROP COLUMN "sesionCajaId"`);
        await queryRunner.query(`DROP TABLE "sesiones_caja"`);
    }

}
