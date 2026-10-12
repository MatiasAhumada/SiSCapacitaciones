# COD-1379 — Backend y PM2 por entorno

Esta guía implementa el contrato de backend que usarán los workflows posteriores. COD-1379 no habilita el deploy automático: COD-1381 conecta las ramas aprobadas con Actions y COD-1382 valida el VPS. No se ejecutaron migraciones ni se accedió a `cursos` o `cursos_dev` al preparar este cambio.

## Contrato

| Entorno | Rama | GitHub Environment | API | Base | Proceso PM2 | Configuración privada |
| --- | --- | --- | ---: | --- | --- | --- |
| Staging | `staging` | `staging` | `4043` | `cursos_dev` | `siscapacitaciones-api-staging` | `/etc/siscapacitaciones/staging.env` |
| Producción | `master` | `production` | `4040` | `cursos` | `siscapacitaciones-api` | `/etc/siscapacitaciones/production.env` |

Cada release vive bajo `/opt/siscapacitaciones/<entorno>/releases/<sha>/`. El proceso PM2 usa como `cwd` el backend de ese release; PM2 administra sólo las APIs. Nginx sigue sirviendo los archivos estáticos. Los logs se separan por proceso en `/var/log/siscapacitaciones/`.

## Secrets por GitHub Environment

Usar los nombres ya acordados en COD-1378: `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, `R2_ENDPOINT`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `VITE_APP_URL` y `FRONTEND_URL`. Los dos Environments pueden compartir nombres con valores y permisos distintos. No copiar secretos al checkout ni imprimirlos.

El archivo privado también declara los valores no secretos `DEPLOY_ENV`, `PORT`, `DB_NAME`, `PM2_PROCESS_NAME` y `SMTP_MODE`. En staging, `SMTP_MODE` es `disabled` o `test`; en modo test todos los correos se fuerzan a `SMTP_TEST_RECIPIENT`. En producción debe ser `production`. Staging usa `FRONTEND_URL` propia y un bucket R2 aislado; no se admite un bucket cuyo nombre indique producción.

El workflow debe crear el archivo remoto desde secretos del GitHub Environment por entrada estándar, sin interpolarlos en argumentos o logs:

```sh
npm run deploy:install-runtime -- staging < staging-runtime.env
npm run deploy:install-runtime -- production < production-runtime.env
```

El texto de ejemplo representa el flujo del runner, no un archivo versionado. `install-runtime-env.cjs` valida entorno, puerto, base, PM2, SMTP y R2, y escribe atómicamente en `/etc/siscapacitaciones/<entorno>.env` con modo `0600` dentro de un directorio `0700`. El usuario SSH necesita permisos restringidos para escribir allí y operar PM2; no se requiere sesión manual.

## Precondiciones y ejecución

Antes de llamar `deploy:environment`, Actions debe comprobar por SSH que hay un backup reciente, restaurable e identificado; que el esquema es compatible con la versión desplegada; que la DB destino efectiva coincide con `DB_NAME`; y que el SHA proviene de la rama aprobada. Pasar a la llamada `BACKUP_VERIFICATION_ID`, `BACKUP_RESTORABLE=true`, `SCHEMA_COMPATIBLE=true` y el `GIT_SHA` completo. No inferir la restaurabilidad por la existencia de un archivo. Para producción, Actions debe bloquear hasta obtener una evidencia verificable de respaldo restaurable.

La validación remota está disponible con:

```sh
npm run deploy:environment -- staging staging /opt/siscapacitaciones/staging/releases/<sha>
npm run deploy:environment -- production master /opt/siscapacitaciones/production/releases/<sha>
```

El script vuelve a validar rama, ruta, permisos del `.env`, puerto, `DB_NAME`, nombre PM2, SMTP, bucket, SHA, backup y compatibilidad antes de enlazar configuración o ejecutar el comando de migración configurado en `package.json`. TypeORM y el CLI leen el mismo archivo privado (`APP_ENV_FILE` y el enlace `.env` del release), con `synchronize` y `dropSchema` desactivados. Luego reinicia sólo el PM2 elegido, ejecuta `pm2 save` y comprueba por HTTP `/health` que respondan ambos procesos, que cada uno identifique su entorno y que el proceso no objetivo siga en línea.

Health check independiente desde el VPS:

```sh
npm run deploy:health-check -- staging
npm run deploy:health-check -- production
```

`GET /health` no consulta la DB y devuelve sólo estado, nombre del entorno y SHA. Actions registra la rama y SHA en su resumen; las respuestas de health y los scripts no exponen configuración sensible.

## Rollback y límites

Un rollback de código consiste en desplegar de nuevo un release anterior dentro del mismo directorio de entorno, después de comprobar compatibilidad. No revierte el esquema de base de datos. No borrar releases previos hasta acordar retención y verificar el rollback. Si falla una condición previa, Actions debe detenerse antes de migrar o reiniciar procesos.

COD-1379 sólo prepara código, scripts y documentación. Las pruebas locales deben usar valores simulados y no ejecutar migraciones sobre `cursos` ni `cursos_dev`; la operación real de staging/producción se valida en COD-1381/COD-1382.
