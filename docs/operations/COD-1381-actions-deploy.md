# COD-1381 — Activación de despliegues por rama

## Workflows

- `Deploy backend` corre en `push` a `staging` o `master`, valida el SHA del evento, ejecuta lint, tests de backend y builds reproducibles de `back`, `front` y `titulos`. Luego publica backend y frontend de staging o backend, frontend y `titulos` de producción desde ese mismo SHA. No tiene trigger para `dev`.
- Cada entorno tiene una clave de concurrencia distinta. Los workflows reciben el SHA del push; los builds no consultan una rama móvil después del checkout.

## GitHub Environments

Crear/proteger los Environments `staging` y `production` y guardar los valores por ambiente. Los nombres compartidos son:

- Secrets de conexión: `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `VPS_KNOWN_HOSTS`.
- Secrets de runtime: `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `FRONTEND_URL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, `SMTP_TEST_RECIPIENT`, `R2_ENDPOINT`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`.
- Staging frontend: `VITE_APP_URL`, `VPS_PASSWORD` (el publicador staging existente usa autenticación por contraseña y `VPS_KNOWN_HOSTS`). El endpoint termina en `/backend` y debe pertenecer al host aislado de staging.
- Variables de runtime: `SMTP_MODE`, `BACKUP_VERIFICATION_ID`, `BACKUP_RESTORABLE=true`, `SCHEMA_COMPATIBLE=true`.

Staging debe usar `PORT=4043`, `DB_NAME=cursos_dev`, PM2 `siscapacitaciones-api-staging`, SMTP `disabled` o `test`, bucket R2 aislado y URLs de staging. Producción usa `PORT=4040`, `DB_NAME=cursos`, PM2 `siscapacitaciones-api`, SMTP `production`, URLs productivas y el bucket productivo. `VITE_APP_URL` de producción es `https://siscapacitaciones.net/backend`; `titulos` usa `https://certificacionnacional.org/backend`.

Los prechecks fallan sin exponer valores si falta un secreto, identidad de host, backup identificado/restaurable, compatibilidad de esquema o runtime que coincida con la matriz. El instalador escribe el runtime privado por stdin. Las migraciones sólo se ejecutan con `npm run deploy:environment`, cuyo script remoto llama al comando `migration:run` declarado en `back/package.json`. La verificación de salud exige que ambos procesos API sigan respondiendo; la API objetivo recupera su release PM2 previo si no pasa.

## Promoción y evidencia pendiente

El camino es PR `dev → staging`, validación/despliegue aislado y PR `staging → master`. El workflow de producción verifica que `origin/staging` sea ancestro del SHA en `master`; así no despliega el contenido inicial antiguo de `master`. Configurar protección de rama para exigir PR y los checks `CI / Validate back`, `CI / Validate front` y `CI / Validate titulos` en `staging` y `master`; las protecciones de ramas son ajustes del repositorio y no se pueden versionar en estos YAML.

Antes de pasar COD-1381 a Finalizado, revisar las ejecuciones de Actions en ambas ramas: staging debe acreditar `4043`/`cursos_dev` con ambos PM2 en línea; producción debe acreditar `4040`/`cursos`, ambos sitios y `titulos`, y los roots previos deben seguir disponibles para rollback. Este cambio local no ejecuta un deploy, una migración ni modifica servidores.
