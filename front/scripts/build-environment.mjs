import { rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const environment = process.argv[2];
if (!['staging', 'production'].includes(environment)) {
  throw new Error('Usage: node build-environment.mjs <staging|production>');
}

const productionApiUrl = 'https://siscapacitaciones.net/backend';
const apiUrl = environment === 'production'
  ? productionApiUrl
  : process.env.VITE_APP_URL;
if (!apiUrl) throw new Error('Set VITE_APP_URL in the staging environment before building.');

const parsed = new URL(apiUrl);
if (parsed.protocol !== 'https:' || parsed.pathname.replace(/\/$/, '') !== '/backend' || parsed.search || parsed.hash || parsed.username || parsed.password) {
  throw new Error('VITE_APP_URL must be an HTTPS API URL ending in /backend.');
}
if (environment === 'production' && apiUrl !== productionApiUrl) {
  throw new Error('Production builds must target the production API URL.');
}
if (environment === 'staging' && [
  'siscapacitaciones.net', 'www.siscapacitaciones.net',
  'certificacionnacional.org', 'www.certificacionnacional.org',
].includes(parsed.hostname)) {
  throw new Error('Staging builds cannot target a production API hostname.');
}

rmSync('dist', { recursive: true, force: true });
const viteCli = resolve('node_modules/vite/bin/vite.js');
const result = spawnSync(process.execPath, [viteCli, 'build'], {
  env: { ...process.env, VITE_APP_URL: apiUrl },
  stdio: 'inherit',
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
process.stdout.write(`Built ${environment} frontend for ${parsed.origin}/backend.\n`);
