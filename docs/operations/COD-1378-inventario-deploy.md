# COD-1378 — Corte de deploy desde `dev` y preparación de promoción

Actualizado el 12/10/2026 para el alcance revisado del ticket. Este cambio sólo modifica el repositorio y GitHub Actions; no se conectó al VPS, no se ejecutó una migración y no se alteraron servicios, configuración ni datos productivos.

## Resultado del cambio

- `.github/workflows/deploy.yml` fue retirado: ya no hay un workflow que despliegue en un push a `dev`.
- `.github/workflows/ci.yml` valida lint y build de `back`, `front` y `titulos` al abrir o actualizar un PR cuyo destino sea `dev`, `staging` o `master`. No publica artefactos ni se conecta al VPS.
- La instancia productiva existente debe continuar atendiendo tráfico con los procesos y archivos estáticos actualmente instalados. Desde que entre este cambio, no habrá despliegue automático hasta que se habilite el flujo aprobado en los tickets siguientes; puede existir un intervalo sin actualizaciones automáticas.
- `titulos/` sigue incluido en la futura promoción productiva. No se habilitará para staging hasta definir y registrar su URL y API de staging.

## Ramas observadas en GitHub

SHA observados al preparar este cambio (12/10/2026):

| Rama | SHA | Observación |
| --- | --- | --- |
| `dev` | `9e92967c640bc3467174d86b7035a1c779db937e` | Merge PR #23 desde `staging`; es la base aprobada de trabajo. |
| `staging` | `d8fa3c89300785d30e7fa807eb7480d940e7913f` | Ancestro de `dev` al momento del relevamiento. |
| `master` | `f210c881cbcd0c002a698011fe49f8b212987671` | Commit inicial de 2025 y ancestro de `dev`; no es una versión apta para desplegar. |

Camino de promoción: PR revisable `dev → staging`, validación en el entorno aislado que prepararán COD-1379/COD-1380, y luego PR revisable `staging → master`. No se reescriben ramas, no se usa push forzado y ningún despliegue a producción se habilita antes de que `master` contenga por PR el código y los workflows aprobados. COD-1381/COD-1382 cubren la activación y su validación; este ticket no declara staging ni master desplegados.

## Matriz de configuración por entorno

Los valores de nombres y destinos de abajo son el contrato propuesto para los tickets siguientes. Los valores entre `<...>` son marcadores; nunca deben reemplazarse por secretos en este documento. Los nombres de secretos serán configurados como secrets de GitHub Environment y los valores de runtime residirán en el `.env` de cada proceso, fuera de Git.

| Parámetro | `staging` | `production` |
| --- | --- | --- |
| Rama de despliegue | `staging` | `master` |
| GitHub Environment | `staging` | `production` |
| API listen port | `4043` | `4040` (actual `main.ts` lo fija en código; COD-1379 debe permitir configurarlo) |
| `DB_NAME` | `cursos_dev` | `cursos` |
| PM2 process | `siscapacitaciones-api-staging` | `siscapacitaciones-api` |
| Backend checkout/release root | `/opt/siscapacitaciones/staging` | `/root/SiSCapacitaciones` (actual; migrar a releases inmutables antes de promover) |
| API URL / `VITE_APP_URL` | `https://<staging-api-host>/backend` | `https://siscapacitaciones.net/backend` |
| Frontend public URL / `FRONTEND_URL` | `https://<staging-frontend-host>` | `https://siscapacitaciones.net` |
| Frontend static root | `/var/www/siscapacitaciones-staging` | `/var/www/siscapacitaciones` |
| Títulos public URL / `VITE_APP_URL` | Pendiente; no incluir en deploy staging hasta acordar URL y API | `https://certificacionnacional.org/backend` |
| Títulos static root | Pendiente | `/var/www/titulos` |
| SMTP | Credenciales/cuenta de prueba independientes; no usar correo real de clientes | Secretos productivos existentes, fuera de Git |
| R2 | Bucket y credenciales de staging aislados, sin escribir sobre objetos productivos | Bucket productivo y secretos existentes, fuera de Git |
| Release/rollback | Releases versionados separados de producción; ruta y retención se cierran en COD-1379/1380 | Releases versionados y puntero de release activo; definir antes de activar deploy |

Nombres esperados para los secrets por GitHub Environment: `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, `R2_ENDPOINT`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `VITE_APP_URL` y `FRONTEND_URL`. Los nombres pueden repetirse entre Environments porque cada uno entrega valores distintos y con permisos propios. Preferir clave SSH; no mantener `VPS_PASSWORD` como mecanismo de despliegue.

## Precondiciones y controles para el workflow de despliegue futuro

El workflow de despliegue, que se implementará en los tickets siguientes, debe seleccionar explícitamente el GitHub Environment según la rama aprobada y comprobar todo lo siguiente antes de compilar o cambiar servicios:

1. Rechazar ramas/destinos no permitidos y verificar que el SHA a desplegar es el `HEAD` aprobado de `staging` o `master`; registrar rama y SHA en el resumen del job.
2. Exigir `VPS_HOST`, `VPS_USER` y `VPS_SSH_KEY` no vacíos, conectarse por SSH con host key verificada y fallar con un mensaje que nombre el parámetro faltante, nunca imprimir su valor.
3. Por SSH, verificar usuario/permisos, espacio disponible, Node/npm, Git, PM2, PostgreSQL alcanzable, Nginx y sus herramientas de validación, directorios/releases y permisos de escritura. Comprobar puerto libre `4043` en staging o servicio/listener esperado en `4040` en producción.
4. Validar configuración de DB antes de migrar: `DB_HOST`, `DB_PORT`, usuario y contraseña disponibles; confirmar que la base seleccionada sea exactamente `cursos_dev` para staging o `cursos` para producción. Abortar ante cualquier discrepancia. Comprobar un respaldo reciente y restaurable antes de una migración de producción.
5. Verificar que el hostname configurado resuelve al destino, que el virtual host Nginx apunta a las rutas y API del mismo entorno, y que la configuración pasa `nginx -t`. Confirmar DNS y TLS válidos para el hostname antes de habilitar tráfico.
6. Verificar secretos/variables de runtime de SMTP, R2, `FRONTEND_URL` y `VITE_APP_URL`. Staging debe usar cuentas/buckets aislados para evitar mensajes y escrituras sobre datos productivos.
7. Ejecutar health checks de API y de los sitios después de activar el release; ante error, restaurar el release anterior y reiniciar sólo el PM2 del entorno seleccionado. No usar `git reset --hard` en un checkout compartido ni borrar estáticos activos antes de tener listo el nuevo release.

Si una precondición no se cumple, el job debe fallar antes de ejecutar migraciones, reiniciar PM2, cambiar symlinks o reemplazar archivos servidos. La configuración observada previamente no acredita que todos estos requisitos estén listos: no se deben inferir credenciales, DNS/TLS, respaldo restaurable ni DB efectiva a partir de este inventario.

## Estado productivo conocido y límites de la evidencia

El inventario anterior de solo lectura reportó API PM2 `siscapacitaciones-api` en puerto 4040, frontend en `/var/www/siscapacitaciones`, títulos en `/var/www/titulos`, DBs `cursos` y `cursos_dev`, y ambos dominios productivos enrutados a 4040. También dejó constancia de que el SHA servido por PM2, la DB efectiva de producción, la restaurabilidad de respaldos y varios aspectos de DNS/TLS/configuración seguían sin verificar. Este cambio no repite una inspección del VPS y no afirma que esos datos hayan cambiado o continúen iguales.

El deploy productivo anterior ejecutaba `npm run migration:run`, reiniciaba PM2 y reemplazaba los directorios estáticos en cada push a `dev`. Retirarlo evita nuevos cambios automáticos desde `dev`; no detiene ni reinicia la instancia ya ejecutándose. No se hicieron pruebas de staging porque todavía no hay un entorno aislado listo dentro del alcance de este ticket.
