const productionHosts = new Set([
  'siscapacitaciones.net',
  'www.siscapacitaciones.net',
  'certificacionnacional.org',
  'www.certificacionnacional.org',
]);

function parseHttpsUrl(value, name) {
  if (!value) throw new Error(`Configure ${name} in GitHub Environment staging.`);

  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`${name} must be an absolute HTTPS URL.`);
  }

  if (
    parsed.protocol !== 'https:' ||
    parsed.username ||
    parsed.password ||
    parsed.search ||
    parsed.hash
  ) {
    throw new Error(`${name} must be an HTTPS URL without credentials, query, or fragment.`);
  }
  if (productionHosts.has(parsed.hostname.toLowerCase())) {
    throw new Error(`${name} cannot use a production hostname for staging.`);
  }

  return parsed;
}

const api = parseHttpsUrl(process.env.VITE_APP_URL, 'VITE_APP_URL variable');
if (api.pathname.replace(/\/$/, '') !== '/backend') {
  throw new Error('VITE_APP_URL must end in /backend.');
}

const frontend = parseHttpsUrl(process.env.FRONTEND_URL, 'FRONTEND_URL secret');
if (frontend.pathname !== '/') {
  throw new Error('FRONTEND_URL must be the staging HTTPS origin without a path.');
}
if (frontend.hostname.toLowerCase() === api.hostname.toLowerCase()) {
  throw new Error('FRONTEND_URL and VITE_APP_URL must use different staging hostnames.');
}

process.stdout.write('Staging URLs are present, isolated from production, and use separate hostnames.\n');
