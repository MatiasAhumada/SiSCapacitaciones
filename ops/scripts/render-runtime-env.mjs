const required = [
  'DB_HOST', 'DB_PORT', 'DB_USERNAME', 'DB_PASSWORD', 'JWT_SECRET',
  'FRONTEND_URL', 'SMTP_MODE',
  'R2_ENDPOINT', 'R2_BUCKET_NAME', 'R2_PUBLIC_URL',
  'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY',
];
const smtpValues = [
  'SMTP_HOST', 'SMTP_PORT', 'SMTP_SECURE', 'SMTP_USER', 'SMTP_PASSWORD',
  'SMTP_FROM', 'SMTP_TEST_RECIPIENT',
];

const environment = process.argv[2];
if (!['staging', 'production'].includes(environment)) {
  throw new Error('Usage: node render-runtime-env.mjs <staging|production>');
}

const configuration = environment === 'staging'
  ? { port: 4043, database: 'cursos_dev', process: 'siscapacitaciones-api-staging' }
  : { port: 4040, database: 'cursos', process: 'siscapacitaciones-api' };
const values = {
  DEPLOY_ENV: environment,
  PORT: String(configuration.port),
  DB_NAME: configuration.database,
  PM2_PROCESS_NAME: configuration.process,
  ...Object.fromEntries([...required, ...smtpValues].map((key) => [key, process.env[key] || ''])),
};

const missing = required.filter((key) => !values[key]);
if (environment === 'staging' && values.SMTP_MODE === 'disabled') {
  for (const key of smtpValues) values[key] = '';
} else if (environment === 'staging' && values.SMTP_MODE === 'test') {
  missing.push(...['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASSWORD', 'SMTP_FROM', 'SMTP_TEST_RECIPIENT']
    .filter((key) => !values[key]));
}
if (environment === 'production') {
  missing.push(...['SMTP_HOST', 'SMTP_PORT', 'SMTP_SECURE', 'SMTP_USER', 'SMTP_PASSWORD', 'SMTP_FROM']
    .filter((key) => !values[key]));
}
if (missing.length) throw new Error(`Runtime configuration is missing: ${[...new Set(missing)].join(', ')}.`);

for (const [key, value] of Object.entries(values)) {
  if (/[\r\n]/.test(value)) throw new Error(`${key} must not contain a newline.`);
  const escaped = value.replaceAll('\\', '\\\\').replaceAll('"', '\\"');
  process.stdout.write(`${key}="${escaped}"\n`);
}
