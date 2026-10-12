import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const [templatePath, outputPath, frontendUrl, apiUrl, sha] = process.argv.slice(2);
if (!templatePath || !outputPath || !frontendUrl || !apiUrl || !sha) {
  throw new Error('Usage: node render-staging-nginx.mjs <template> <output> <frontend-url> <api-url> <sha>');
}

const frontend = new URL(frontendUrl);
const api = new URL(apiUrl);
if (frontend.protocol !== 'https:' || api.protocol !== 'https:') {
  throw new Error('Staging frontend and API URLs must use HTTPS.');
}
if (frontend.pathname !== '/' || frontend.search || frontend.hash) {
  throw new Error('FRONTEND_URL must be the HTTPS origin without a path, query, or fragment.');
}
if (frontend.username || frontend.password || api.username || api.password) {
  throw new Error('Staging URLs must not contain credentials.');
}
if (!/^[a-f0-9]{40}$/i.test(sha)) throw new Error('A full Git commit SHA is required.');
if (!/^[a-z0-9.-]+$/i.test(frontend.hostname)) throw new Error('Invalid staging frontend hostname.');
if (!/^[a-z0-9.-]+$/i.test(api.hostname)) throw new Error('Invalid staging API hostname.');
if (frontend.hostname === api.hostname) throw new Error('Staging frontend and API must use separate hostnames.');
const productionHosts = new Set([
  'siscapacitaciones.net', 'www.siscapacitaciones.net',
  'certificacionnacional.org', 'www.certificacionnacional.org',
]);
if (productionHosts.has(frontend.hostname) || productionHosts.has(api.hostname)) {
  throw new Error('Staging URLs cannot use a production hostname.');
}
if (api.pathname.replace(/\/$/, '') !== '/backend' || api.search || api.hash) {
  throw new Error('VITE_APP_URL must point to the staging API /backend path.');
}

const content = readFileSync(resolve(templatePath), 'utf8')
  .replaceAll('__STAGING_FRONTEND_HOST__', frontend.hostname)
  .replaceAll('__STAGING_API_HOST__', api.hostname)
  .replaceAll('__DEPLOYMENT_SHA__', sha);
if (content.includes('__')) throw new Error('Nginx template contains unresolved placeholders.');
writeFileSync(resolve(outputPath), content, { mode: 0o600 });
process.stdout.write(`Rendered staging Nginx configuration for ${frontend.hostname}.\n`);
