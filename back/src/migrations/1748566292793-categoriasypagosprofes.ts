import { MigrationInterface, QueryRunner } from "typeorm";

export class Categoriasypagosprofes1748566292793 implements MigrationInterface {
    name = 'Categoriasypagosprofes1748566292793'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categorias" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nombre" character varying NOT NULL, CONSTRAINT "PK_3886a26251605c571c6b4f861fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subcategorias" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nombre" character varying NOT NULL, "categoriaId" uuid, CONSTRAINT "PK_9bbef90f7112e787d4e4b23d455" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "cajas" ADD "profesorId" uuid`);
        await queryRunner.query(`ALTER TABLE "cajas" ADD "subcategoriaId" uuid`);
        await queryRunner.query(`ALTER TABLE "subcategorias" ADD CONSTRAINT "FK_55b0166e1926780a24cdda43be0" FOREIGN KEY ("categoriaId") REFERENCES "categorias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cajas" ADD CONSTRAINT "FK_7f6bcbab7c7fd81e9c04ac08032" FOREIGN KEY ("profesorId") REFERENCES "profesores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cajas" ADD CONSTRAINT "FK_1a20c5189ae362c9ceee6da9b42" FOREIGN KEY ("subcategoriaId") REFERENCES "subcategorias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cajas" DROP CONSTRAINT "FK_1a20c5189ae362c9ceee6da9b42"`);
        await queryRunner.query(`ALTER TABLE "cajas" DROP CONSTRAINT "FK_7f6bcbab7c7fd81e9c04ac08032"`);
        await queryRunner.query(`ALTER TABLE "subcategorias" DROP CONSTRAINT "FK_55b0166e1926780a24cdda43be0"`);
        await queryRunner.query(`ALTER TABLE "cajas" DROP COLUMN "subcategoriaId"`);
        await queryRunner.query(`ALTER TABLE "cajas" DROP COLUMN "profesorId"`);
        await queryRunner.query(`DROP TABLE "subcategorias"`);
        await queryRunner.query(`DROP TABLE "categorias"`);
    }

}
