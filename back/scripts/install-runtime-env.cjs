const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');
const { getDeploymentConfiguration } = require('../dist/config/deployment');

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

async function main() {
  const environment = process.argv[2];
  const deployment = getDeploymentConfiguration(environment);
  const content = await readStdin();
  if (!content.trim()) throw new Error('Runtime configuration input is empty.');

  const values = dotenv.parse(content);
  const required = [
    'DB_HOST', 'DB_PORT', 'DB_USERNAME', 'DB_PASSWORD', 'JWT_SECRET',
    'FRONTEND_URL', 'SMTP_MODE', 'R2_ENDPOINT', 'R2_BUCKET_NAME',
    'R2_PUBLIC_URL', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY',
  ];
  const missing = required.filter((key) => !values[key]);
  if (missing.length) throw new Error(`Runtime configuration is missing: ${missing.join(', ')}.`);
  if (!/^\d+$/.test(values.DB_PORT) || Number(values.DB_PORT) < 1 || Number(values.DB_PORT) > 65535) {
    throw new Error('DB_PORT must be an integer between 1 and 65535.');
  }
  if (values.DEPLOY_ENV !== environment) throw new Error('Runtime DEPLOY_ENV does not match the selected environment.');
  if (values.PORT !== String(deployment.port)) throw new Error(`Runtime PORT must be ${deployment.port}.`);
  if (values.DB_NAME !== deployment.database) throw new Error(`Runtime DB_NAME must be ${deployment.database}.`);
  if (values.PM2_PROCESS_NAME !== deployment.processName) {
    throw new Error(`Runtime PM2_PROCESS_NAME must be ${deployment.processName}.`);
  }
  if (environment === 'staging') {
    if (!['disabled', 'test'].includes(values.SMTP_MODE)) throw new Error('Staging SMTP_MODE must be disabled or test.');
    if (values.FRONTEND_URL === 'https://siscapacitaciones.net') {
      throw new Error('Staging FRONTEND_URL must be isolated from production.');
    }
    if (/prod(uction)?/i.test(values.R2_BUCKET_NAME)) throw new Error('Staging must use an isolated R2 bucket.');
    if (values.SMTP_MODE === 'test') {
      const smtpRequired = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASSWORD', 'SMTP_FROM', 'SMTP_TEST_RECIPIENT'];
      const smtpMissing = smtpRequired.filter((key) => !values[key]);
      if (smtpMissing.length) throw new Error(`Test SMTP configuration is missing: ${smtpMissing.join(', ')}.`);
    }
  } else {
    if (values.SMTP_MODE !== 'production') throw new Error('Production SMTP_MODE must be production.');
    const smtpRequired = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_SECURE', 'SMTP_USER', 'SMTP_PASSWORD', 'SMTP_FROM'];
    const smtpMissing = smtpRequired.filter((key) => !values[key]);
    if (smtpMissing.length) throw new Error(`Production SMTP configuration is missing: ${smtpMissing.join(', ')}.`);
  }
  for (const key of ['FRONTEND_URL', 'R2_ENDPOINT', 'R2_PUBLIC_URL']) {
    let url;
    try {
      url = new URL(values[key]);
    } catch {
      throw new Error(`${key} must be a valid absolute URL.`);
    }
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error(`${key} must use HTTP or HTTPS.`);
  }
  if (values.SMTP_MODE !== 'disabled' &&
      (!/^\d+$/.test(values.SMTP_PORT || '') || Number(values.SMTP_PORT) < 1 || Number(values.SMTP_PORT) > 65535)) {
    throw new Error('SMTP_PORT must be an integer between 1 and 65535.');
  }

  const directory = '/etc/siscapacitaciones';
  fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
  fs.chmodSync(directory, 0o700);
  const target = path.join(directory, `${environment}.env`);
  const temporary = `${target}.tmp-${process.pid}`;
  const descriptor = fs.openSync(temporary, 'wx', 0o600);
  try {
    fs.writeFileSync(descriptor, content, 'utf8');
    fs.fsyncSync(descriptor);
  } finally {
    fs.closeSync(descriptor);
  }
  fs.chmodSync(temporary, 0o600);
  fs.renameSync(temporary, target);
  process.stdout.write(`Installed private ${environment} runtime configuration.\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
