# COD-1387 — URL de staging vacía en GitHub Actions

## Ejecución fallida

- PR: [#24 — Dev](https://github.com/MatiasAhumada/SiSCapacitaciones/pull/24), `dev → staging`.
- Deploy: [run 38276400013](https://github.com/MatiasAhumada/SiSCapacitaciones/actions/runs/38276400013), SHA `a8cd00fdd9d81fe324db6d4ad6df69c1fdf440a5`.
- `Validate front / Build project`: falló porque el runner recibió vacío `VITE_APP_URL`.
- `Validate back`: pasó (lint, tests y build).
- `Validate titulos`: pasó (lint y build).
- `deploy`: omitido por `needs: validate`; no se modificó el VPS en esa ejecución.
- La ejecución de CI del PR también mostró `Validate front` fallido; back y títulos pasaron.

## Configuración revisada

Se inspeccionaron los nombres y ámbitos en GitHub Settings sin leer valores:

- El Environment `staging` existe; no tiene secretos ni variables. No requiere aprobación ni espera y deja las ramas sin restricción.
- En el alcance del repositorio hay secretos `VPS_HOST`, `VPS_PASSWORD` y `VPS_USER`; no hay variables.
- `VITE_APP_URL` no está definido en los alcances visibles. El workflow intentaba leerlo del contexto `secrets`, pero la URL es configuración pública, no un secreto. El `.env` del VPS sigue siendo la fuente existente allí; Actions no lo lee desde el runner.
- No se copió ni registró ningún valor de URL o credencial.

## Cambio en el workflow

`VITE_APP_URL` queda como variable no sensible de GitHub Environment `staging`. Un precheck en el mismo Environment de los jobs `validate` y `deploy` valida antes de instalar o compilar:

- existencia de `VITE_APP_URL` y `FRONTEND_URL`;
- HTTPS, ruta API `/backend`, hostnames separados y fuera de producción;
- errores accionables que sólo muestran el nombre del ajuste y la regla incumplida.

La misma `vars.VITE_APP_URL` alimenta validación, build, comprobación del bundle, render Nginx y publicación/verificación pública. Los bundles estáticos y Nginx se preparan antes de desplegar la API; el deploy completo sigue dependiendo de todas las validaciones.

## Evidencia pendiente

No se puede producir ni afirmar una ejecución corregida de Actions mientras falte `VITE_APP_URL` en Environment `staging`. Configurar allí el mismo endpoint API público que ya está en el `.env` del frontend de staging, sin eliminar ni reemplazar el valor del VPS. El URL debe terminar en `/backend` y tener un hostname distinto de producción y del frontend. Luego, reintentar en staging y registrar el SHA/run, resultados de los tres `Validate`, health HTTP y estado PM2.

El cambio no ejecuta migraciones ni despliega. La rama `dev` sigue sin trigger de deploy y `master` mantiene su URL productiva fija.
