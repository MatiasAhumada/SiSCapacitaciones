import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVendedrSesionCaja1752273735342 implements MigrationInterface {
    name = 'AddVendedrSesionCaja1752273735342'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sesiones_caja" ADD "vendedorId" uuid`);
        await queryRunner.query(`ALTER TABLE "sesiones_caja" ADD CONSTRAINT "FK_574170c91e271313014a932f7f8" FOREIGN KEY ("vendedorId") REFERENCES "vendedores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sesiones_caja" DROP CONSTRAINT "FK_574170c91e271313014a932f7f8"`);
        await queryRunner.query(`ALTER TABLE "sesiones_caja" DROP COLUMN "vendedorId"`);
    }

}
