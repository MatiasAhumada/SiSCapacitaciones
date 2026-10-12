# COD-1380 — Frontend estático y Nginx de staging

Este ticket agrega un build y un despliegue manual del frontend administrativo a staging. No habilita despliegues automáticos por push: COD-1381 controla esa activación. El frontend productivo (`/var/www/siscapacitaciones`), `titulos` (`/var/www/titulos`) y sus APIs no son destinos de este workflow.

## Contrato

| Entorno | Rama | GitHub Environment | URL API incluida en Vite | API interna | Archivos servidos |
| --- | --- | --- | ---: | --- | --- |
| Staging | `staging` | `staging` | `https://<staging-api-host>/backend` | `127.0.0.1:4043` | `/var/www/siscapacitaciones-staging/current` |
| Producción | `master` | `production` | `https://siscapacitaciones.net/backend` | `127.0.0.1:4040` | `/var/www/siscapacitaciones` |

`npm run build:staging` requiere `VITE_APP_URL` y lo incrusta en ese artefacto; `npm run build:production` fija el endpoint productivo documentado y CI valida ese build. Nunca se copia el `dist` de un entorno al otro. `titulos` conserva su build y publicación productivos; no se incluye en staging.

## Workflow y requisitos

`.github/workflows/deploy-staging-frontend.yml` permite una ejecución `workflow_dispatch` únicamente desde `staging`. COD-1381 podrá incorporar el disparador automático una vez aprobada la activación. El job instala dependencias con `npm ci`, corre lint sin modificar el checkout, compila con `VITE_APP_URL`, y confirma que la URL seleccionada quedó dentro de los assets generados.

El job puede resolver `VPS_HOST`, `VPS_USER` y `VPS_PASSWORD` desde secretos del repositorio o del Environment `staging` (un secreto de Environment con el mismo nombre prevalece). Configurar además estos secrets en GitHub Environment `staging`:

- `VPS_KNOWN_HOSTS` (líneas `known_hosts` previamente confiables; no se aprende la clave del host durante el job).
- `FRONTEND_URL`: URL HTTPS del vhost frontend exclusivo de staging.
- `VITE_APP_URL`: URL HTTPS del vhost de API exclusivo de staging, terminada en `/backend`.

El workflow autentica SSH usando el secreto `VPS_PASSWORD` mediante `sshpass`; el runner instala esa herramienta durante el job. La cuenta SSH debe permitir autenticación por contraseña y conservar `sudo -n` para las operaciones administrativas. La verificación estricta de la identidad del VPS sigue dependiendo de `VPS_KNOWN_HOSTS`.

Los dos vhosts deben tener DNS y certificados TLS ya instalados. La cuenta SSH requiere `rsync`, `curl`, Nginx, `systemctl`, y `sudo -n` para instalar la configuración/reload; puede escribir releases bajo `/var/www/siscapacitaciones-staging`. Los valores, permisos, herramientas y certificados se validan antes de activar; DNS/HTTPS públicos se validan inmediatamente después conservando el release anterior y, ante error, se restaura automáticamente.

## Publicación y validación

El frontend se copia a `/var/www/siscapacitaciones-staging/releases/<sha>` y Nginx sirve el symlink `current`; los releases previos se conservan. La configuración versionada `ops/nginx/siscapacitaciones-staging.conf.template` crea vhosts separados para frontend y API, envía únicamente `/backend/` al puerto `4043`, conserva el fallback de React Router y registra entorno/SHA en health headers. Nginx valida la configuración antes de activar el nuevo symlink.

Antes de confirmar, el VPS comprueba por HTTPS contra sí mismo la página y su SHA, un asset JavaScript y `/backend/health` con `environment=staging`. El runner después valida esos servicios usando DNS público y TLS normales, además de los fallbacks `/admin/alumnos` y `/vendedor/inscripciones`. El symlink y la configuración anteriores se conservan hasta que pasen ambas comprobaciones; ante cualquier fallo se restauran y Nginx se recarga. Ningún paso escribe en `/var/www/siscapacitaciones`, `/var/www/titulos` ni configura el puerto `4040`.

El frontend estático no contiene reglas de permisos por rol: el login y las vistas administrativas/de vendedor siguen dependiendo de la API y sus roles. El workflow comprueba la entrega de la SPA y su API de staging; la validación funcional integral con usuarios y DB se cubre junto al despliegue real de COD-1381/COD-1382.
