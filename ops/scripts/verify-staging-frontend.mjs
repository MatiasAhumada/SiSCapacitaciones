const [frontendValue, apiValue, expectedSha] = process.argv.slice(2);
if (!frontendValue || !apiValue || !expectedSha) {
  throw new Error('Usage: node verify-staging-frontend.mjs <frontend-url> <api-url> <sha>');
}

const frontendUrl = new URL(frontendValue);
const apiBaseUrl = new URL(apiValue.endsWith('/') ? apiValue : `${apiValue}/`);
if (frontendUrl.protocol !== 'https:' || apiBaseUrl.protocol !== 'https:') {
  throw new Error('Staging frontend and API must use HTTPS.');
}
if (frontendUrl.pathname !== '/' || frontendUrl.search || frontendUrl.hash) {
  throw new Error('FRONTEND_URL must be the HTTPS origin without a path, query, or fragment.');
}
if (frontendUrl.username || frontendUrl.password || apiBaseUrl.username || apiBaseUrl.password) {
  throw new Error('Staging URLs must not contain credentials.');
}
if (apiBaseUrl.pathname.replace(/\/$/, '') !== '/backend') {
  throw new Error('VITE_APP_URL must point to the staging API /backend path.');
}

async function request(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`${new URL(url).hostname} returned HTTP ${response.status}.`);
  return response;
}

const page = await request(new URL('/health', frontendUrl));
const pageIdentity = await page.json();
if (pageIdentity.environment !== 'staging' || pageIdentity.commit !== expectedSha) {
  throw new Error('The public staging frontend health check returned the wrong environment or commit.');
}

const indexResponse = await request(frontendUrl);
const html = await indexResponse.text();
const scriptPath = html.match(/<script[^>]+src="([^"]+\.js)"/i)?.[1];
if (!scriptPath) throw new Error('The public staging frontend did not return a JavaScript entry asset.');
await request(new URL(scriptPath, frontendUrl));
for (const route of ['/admin/alumnos', '/vendedor/inscripciones']) {
  const routeResponse = await request(new URL(route, frontendUrl));
  if (!(await routeResponse.text()).includes('<div id="root">')) {
    throw new Error(`The staging frontend did not return its SPA shell for ${route}.`);
  }
}

const apiHealth = await request(new URL('health', apiBaseUrl));
const apiIdentity = await apiHealth.json();
if (apiIdentity.status !== 'ok' || apiIdentity.environment !== 'staging') {
  throw new Error('The public staging API health check did not identify the staging backend.');
}
process.stdout.write(`Public staging DNS/TLS, frontend (${expectedSha}), asset, and API 4043 checks passed.\n`);
