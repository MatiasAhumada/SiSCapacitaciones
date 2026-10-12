# COD-1378 — Inventario de despliegue

Relevamiento de solo lectura realizado el 12/10/2026 para evaluar el aislamiento de staging solicitado por COD-1378. No se cambiaron servicios, configuración ni datos del VPS.

## Repositorio y despliegue

- El VPS `srv722748` tiene `/root/SiSCapacitaciones` en `dev`, commit `934121170ab5b99d050e665ddf465ffd4ff0cd09`, igual a `origin/dev` observado localmente.
- `origin/master` está en `f210c881cbcd0c002a698011fe49f8b212987671` (commit inicial del 13/02/2025) y es ancestro de `origin/dev`. Inicializar `staging` desde el `dev` aprobado evita que empiece desde el commit viejo de `master`; promover a `master` debe hacerse mediante PR revisable, no moviendo ni forzando ramas.
- El workflow `.github/workflows/deploy.yml` se activa al hacer push a `dev`. Ejecuta `git reset --hard origin/dev`, instala y compila los tres proyectos, corre `npm run migration:run`, reinicia PM2 y publica los builds web. Por lo tanto, push a `dev` es despliegue productivo directo.
- Al relevamiento no existía workflow ni rama remota `staging`; la rama se inicializa para COD-1378 desde el SHA actual de `origin/dev`. Los despliegues separados de API/frontend y la promoción automatizada siguen fuera del alcance de esta tarea y corresponden a COD-1379/1380/1381, aún en `SIS`.
- En el checkout del VPS quedan cambios en `back/package-lock.json`, `front/package-lock.json` y `titulos/package-lock.json`; no se tocaron.

## Servicios y tráfico

- PM2 mantiene `siscapacitaciones-api` online en `/root/SiSCapacitaciones/back/dist/main.js`; escucha en `*:4040`. No se encontró proceso ni listener en 4043.
- `siscapacitaciones.net` sirve `front/dist` y enruta `/backend/` al puerto 4040. `certificacionnacional.org` y `www.certificacionnacional.org` sirven `/var/www/titulos` y también enrutan al 4040. No se encontró virtual host de staging.
- PM2 reporta una revisión `bfd79aee9a0a929aaebc9965cfbbf81a0cc3085a`, distinta del checkout `934121170ab5b99d050e665ddf465ffd4ff0cd09`. Los directorios compilados tienen marcas de tiempo compatibles con el despliegue del 2/10, pero no hay evidencia suficiente para afirmar el SHA exacto ejecutado.
- El certificado de `siscapacitaciones.net` vence el 10/12/2026. El certificado de `certificacionnacional.org` venció el 15/04/2026: la verificación TLS falla, aunque el sitio responde si se omite la validación del certificado.

## Base de datos y respaldos

- PostgreSQL escucha en todas las interfaces (`0.0.0.0:5432` y `::`). UFW aparece inactivo; no se comprobó firewall del proveedor.
- Hay bases `cursos`, `cursos_dev` y `root`. Las estadísticas consultadas muestran actividad en `cursos`, mientras `cursos_dev` aparece sin tuplas estimadas. No se inspeccionaron registros de negocio.
- El usuario confirma que `cursos` es la base de producción y `cursos_dev` la base configurada para staging/pruebas, una copia fiel de producción. Debe tratarse como información sensible hasta definir anonimización, refresco y política de acceso; el recuento estadístico por sí solo no acredita su contenido actual.
- `back/src/config/configOrm.ts` requiere `DB_*`. El `.env` del backend y el entorno del proceso PM2 no muestran variables `DB_*`/`PG*`; no había conexión activa del API a esas bases al consultar. La base realmente usada por producción y la que alcanzaría la migración del workflow quedan sin verificar. No se ejecutaron migraciones.
- Existen `/root/postgres-backups/cursos.dump` y `cursos_dev.dump`, de 27/09/2026. No se confirmó política de retención, automatización, integridad ni restaurabilidad.
- `/root/SiSCapacitaciones/back/.env` tiene permisos `0644` bajo `/root` con permisos `0755`; se confirmó que `www-data` puede leer el archivo. No se leyeron ni registraron valores secretos y no se modificaron permisos.

## Capacidad observada

El servidor reportó 2 vCPU, 7.8 GiB de RAM (3.8 GiB disponibles), 4 GiB de swap (1.9 GiB usados) y 54 GiB libres en el filesystem principal. No se hizo prueba de carga ni de builds paralelos.

## Validación local de COD-1378

Se ejecutaron `npm run lint` y `npm run build` para `back`, `front` y `titulos` en un worktree temporal basado en el commit actual, preservando los cambios preexistentes del checkout compartido. Los seis hallazgos de variables/importaciones sin uso en `titulos` se corrigieron en `Home.jsx` y `Login.jsx`; lint y build de los tres proyectos finalizaron correctamente. No se ejecutaron pruebas funcionales de staging porque no hay entorno de staging aislado.

## Estado y pasos para activar despliegues separados

La rama `staging` parte del `dev` aprobado y `master` se conserva sin cambios. Antes de habilitar workflows de staging/producción hacen falta: resolver hostname y TLS de staging; aislar código, configuración, logs, PM2 y estáticos; asegurar que las migraciones de staging usen `cursos_dev` y las de producción `cursos`; aislar SMTP/R2 y demás efectos externos; acordar si `titulos` requiere staging; definir respaldo/restauración y rollback; corregir permisos del `.env`; y confirmar el commit servido por PM2. El workflow existente sigue desplegando a producción al hacer push a `dev`, por lo que no se cambió en COD-1378.

El relevamiento del VPS fue de solo lectura: no hubo despliegue, migración, cambio de estado Jira ni acceso a datos de negocio.
