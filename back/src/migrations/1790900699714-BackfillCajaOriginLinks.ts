import { MigrationInterface, QueryRunner } from 'typeorm';

export class BackfillCajaOriginLinks1790900699714
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      WITH candidate_pairs AS (
        SELECT
          replica.id AS copy_id,
          original.id AS source_id,
          COUNT(*) OVER (PARTITION BY replica.id) AS source_matches,
          COUNT(*) OVER (PARTITION BY original.id) AS copy_matches
        FROM cajas replica
        INNER JOIN sesiones_caja copy_session
          ON copy_session.id = replica."sesionCajaId"
        INNER JOIN cajas original
          ON original."vendedorId" IS NOT NULL
          AND original.tipo = replica.tipo
          AND original."metodoPago" = replica."metodoPago"
          AND original.monto = replica.monto
          AND original.fecha = replica.fecha
          AND original.descripcion = regexp_replace(
            replica.descripcion,
            ' - Copia automática$',
            ''
          )
        WHERE replica."vendedorId" IS NULL
          AND copy_session."adminId" IS NOT NULL
          AND replica."origenCajaId" IS NULL
          AND replica.descripcion LIKE '% - Copia automática'
      )
      UPDATE cajas replica
      SET "origenCajaId" = candidate_pairs.source_id
      FROM candidate_pairs
      WHERE replica.id = candidate_pairs.copy_id
        AND candidate_pairs.source_matches = 1
        AND candidate_pairs.copy_matches = 1
    `);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // Keep the recovered links on rollback; the association is additive metadata.
  }
}
