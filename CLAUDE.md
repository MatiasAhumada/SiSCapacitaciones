# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository structure

This is a monorepo with three independent Node projects, each with its own `package.json`, `node_modules`, and dev server. There is no root-level build/test tool — always `cd` into the relevant project first.

- **`back/`** — NestJS + TypeORM + PostgreSQL REST API (port 4040). Serves both `front` and `titulos`.
- **`front/`** — React 18 + Vite admin/vendedor dashboard (port 8080, dev host `siscapacitaciones.net`). The internal management app used by admins and sales reps ("vendedores").
- **`titulos/`** — React 19 + Vite public site (port 8081, dev host `certificacionnacional.org`). A separate, mostly-public app for certificate/title lookup, unrelated in UI to `front` but calling the same backend.

All three deploy together via `.github/workflows/deploy.yml` on push to `dev`: SSH into the VPS, `git reset --hard origin/dev`, then build+restart `back` (pm2), and build+copy static output for `front` and `titulos` to Nginx-served directories (`/var/www/siscapacitaciones`, `/var/www/titulos`). There is no CI test/lint gate before deploy — pushing to `dev` deploys directly to production.

## Commands

### back (NestJS API)
```bash
cd back
npm run start:dev        # watch mode, http://localhost:4040, Swagger at /api
npm run build             # nest build -> dist/
npm run lint               # eslint --fix on src/apps/libs
npm run format              # prettier --write src/**/*.ts
npm test                     # jest unit tests
npm run test:e2e              # jest e2e (test/jest-e2e.json)
npx jest src/Modules/curso/curso.service.spec.ts   # run a single test file
npm run migration:generate -- src/migrations/Name   # generate a TypeORM migration from entity diffs
npm run migration:run                                 # apply pending migrations
npm run migration:revert                               # revert last migration
```
Migrations use `src/config/configOrm.ts` as the TypeORM data source (`connectionSource`). `synchronize: false` — schema changes always go through migrations, never rely on auto-sync.

### front / titulos (Vite + React)
```bash
cd front   # or: cd titulos
npm run dev       # vite dev server
npm run build      # production build -> dist/
npm run lint        # eslint --fix
npm run format       # (front only) prettier --write
```

## Backend architecture (`back/src`)

- **Modules-per-domain** under `src/Modules/*` (Nest convention, but capitalized `Modules` and some folders like `Middleware` — match existing casing when adding files). Each module follows the standard Nest CLI shape: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `dto/`, `entities/`.
- `src/Modules/app.module.ts` is the composition root — new modules must be registered there and their entities added to `src/config/configOrm.ts`'s `entities` array (TypeORM does not auto-discover entities here; `autoLoadEntities: true` is set but the explicit list is still kept in sync).
- Path alias `@modules/*` → `src/*` (see `tsconfig.json`), used in a few cross-module imports (e.g. `configOrm.ts` importing `AsistenciaProfesor` via `@modules/Modules/...`). Prefer the existing relative-import style used within a module; the alias appears inconsistently.
- **Auth**: `Modules/auth` issues JWTs (`AuthService.login`) and there's a `JwtStrategy` (`Modules/auth/jwt`), but **no `@UseGuards(AuthGuard('jwt'))` is currently applied to any controller** — API routes are not server-side protected. Route protection today is only client-side (`front`'s `RequireAuth`/`localStorage`). Be aware of this when adding new endpoints or when asked to harden auth — don't assume existing endpoints are already gated.
- Three user types authenticate through the same `AuthService.validateUser`: `Admins`, `Vendedor` (bcrypt password), and `Alumno` (DNI-as-password, no bcrypt) — each checked against a different repository in sequence.
- `LoggerMiddleware` (`src/Middleware/Peticiones.middleware.ts`) is applied globally in `AppModule.configure` and just logs method+URL.
- File storage uses Cloudflare R2 via `@aws-sdk/client-s3` (env: `R2_ENDPOINT`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`, etc.) — see `Modules/images`.
- PDF/certificate generation uses `pdf-lib`/`jspdf` (`Modules/pdf`, `Modules/certificado`); email via `nodemailer` (`Modules/mail`).
- `src/Seeds/*.ts` are one-off data scripts run with `ts-node` (see `seed:*` npm scripts), not part of the app bootstrap.

## Frontend architecture (`front/src`)

- Plain JS + JSX (no TypeScript), routing via `react-router-dom` in `App.jsx`, all under two role-prefixed trees: `/admin/*` and `/vendedor/*`, both wrapped in `RequireAuth` + `ProtectedLayout`. `/firmar-contrato/:id` (contract signing) and `/login` are the only unauthenticated routes.
- **Auth state**: `context/AuthContext.jsx` stores the logged-in user in `localStorage` (`auth_user`), derives `isAdmin`/`role` from it, and syncs across tabs via the `storage` event. `RequireAuth` just checks whether a user object exists — it does not validate the JWT.
- **App-lock feature**: `App.jsx` polls `services/AppLock.service.js` (`getAppLockStatus`) every 30s; if locked, the entire app is replaced by `AppLockModal` (used for maintenance/billing holds — see `components/AppLockModal`).
- One `*.service.js` file per backend module under `src/services/`, all built on `axios` against `constants/ApiUrl.js`'s `API_URL` (from `VITE_APP_URL` env var). Follow this per-domain service pattern for new API integrations rather than calling axios directly from components.
- Components are organized by feature under `src/components/<Feature>/<Feature>.jsx` (co-located, not by type). `Dash*` components are list/table views, `Create*` are forms, mirroring the backend module names (Vendedor, Profesor, Alumno, Curso, Comision, Caja, Certificados, Inscripcion).
- Uses Tailwind v4 (via `@tailwindcss/vite`) alongside Bootstrap/react-bootstrap and AntD concurrently — check which a given component/feature area already uses before introducing a fourth styling approach.
- Signature capture (`react-signature-canvas`) and contract PDF flows live around `FirmarContrato`; PDF export/print uses `jspdf`/`html2pdf.js`/`react-to-print`.

## `titulos` app (`titulos/src`)

Small, separate app: `App.jsx` → `Login.jsx` / `Home.jsx` under `components/Views`, API calls centralized in `components/queries/queries.js`. Do not assume it shares components or context with `front` — it only shares the backend API and env var convention (`VITE_APP_URL`).

## Conventions

- Backend: Prettier + ESLint (flat config, `unused-imports` plugin enforced as an error for unused imports). Run `npm run lint` in `back` before considering backend work done.
- Frontend (`front`): Prettier config is `singleQuote: true, semi: true, printWidth: 100, trailingComma: 'es5'`.
- All three apps' `.env` files define connection info (`back`: Postgres + SMTP + R2 + `JWT_SECRET`; `front`/`titulos`: just `VITE_APP_URL`) — never commit secrets from these files.
