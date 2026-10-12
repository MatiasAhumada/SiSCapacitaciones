const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const dotenv = require('dotenv');
const {
  getDeploymentConfiguration,
  validateDeploymentEnvironment,
} = require('../dist/config/deployment');

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

async function main() {
  const [environment, branch, requestedReleaseDirectory] = process.argv.slice(2);
  if (!environment || !branch || !requestedReleaseDirectory || process.argv.length !== 5) {
    fail('Usage: deploy-environment.sh <staging|production> <branch> <release-directory>');
  }

  let deployment;
  try {
    deployment = getDeploymentConfiguration(environment);
  } catch (error) {
    fail(error.message);
  }

  if (branch !== deployment.branch) {
    fail(`Branch ${branch} cannot deploy to ${environment}; expected ${deployment.branch}.`);
  }

  const releaseDirectory = fs.realpathSync(requestedReleaseDirectory);
  const releasesRoot = `/opt/siscapacitaciones/${environment}/releases/`;
  if (!releaseDirectory.startsWith(releasesRoot)) {
    fail(`Release directory must be inside /opt/siscapacitaciones/${environment}/releases.`);
  }
  if (!fs.existsSync(path.join(releaseDirectory, 'package.json')) ||
      !fs.existsSync(path.join(releaseDirectory, 'ecosystem.config.cjs'))) {
    fail('Release directory is missing the backend package or PM2 configuration.');
  }

  const runtimeFile = `/etc/siscapacitaciones/${environment}.env`;
  if (!fs.existsSync(runtimeFile)) {
    fail(`Runtime configuration is missing: ${runtimeFile}.`);
  }
  if ((fs.statSync(runtimeFile).mode & 0o777) !== 0o600) {
    fail('Runtime configuration must have mode 600.');
  }

  let runtime;
  try {
    runtime = dotenv.parse(fs.readFileSync(runtimeFile));
  } catch {
    fail('Runtime configuration could not be read.');
  }

  const required = [
    'DB_HOST', 'DB_PORT', 'DB_USERNAME', 'DB_PASSWORD', 'JWT_SECRET',
    'FRONTEND_URL', 'SMTP_MODE', 'R2_ENDPOINT', 'R2_BUCKET_NAME',
    'R2_PUBLIC_URL', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY',
  ];
  const missing = required.filter((key) => !runtime[key]);
  if (missing.length) fail(`Runtime configuration is missing: ${missing.join(', ')}.`);
  if (!/^\d+$/.test(runtime.DB_PORT) || Number(runtime.DB_PORT) < 1 || Number(runtime.DB_PORT) > 65535) {
    fail('DB_PORT must be an integer between 1 and 65535.');
  }
  if (runtime.DEPLOY_ENV !== environment) fail('Runtime DEPLOY_ENV does not match the selected environment.');
  if (runtime.PORT !== String(deployment.port)) fail(`Runtime PORT must be ${deployment.port}.`);
  if (runtime.DB_NAME !== deployment.database) fail(`Runtime DB_NAME must be ${deployment.database}.`);
  if (runtime.PM2_PROCESS_NAME !== deployment.processName) fail(`Runtime PM2_PROCESS_NAME must be ${deployment.processName}.`);
  if (environment === 'staging' && !['disabled', 'test'].includes(runtime.SMTP_MODE)) {
    fail('Staging SMTP_MODE must be disabled or test.');
  }
  if (environment === 'staging' && /prod(uction)?/i.test(runtime.R2_BUCKET_NAME)) {
    fail('Staging must use an isolated R2 bucket.');
  }
  if (environment === 'staging' && runtime.SMTP_MODE === 'test') {
    const smtpRequired = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASSWORD', 'SMTP_FROM', 'SMTP_TEST_RECIPIENT'];
    const smtpMissing = smtpRequired.filter((key) => !runtime[key]);
    if (smtpMissing.length) fail(`Test SMTP configuration is missing: ${smtpMissing.join(', ')}.`);
  }
  if (environment === 'production') {
    const smtpRequired = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_SECURE', 'SMTP_USER', 'SMTP_PASSWORD', 'SMTP_FROM'];
    const smtpMissing = smtpRequired.filter((key) => !runtime[key]);
    if (smtpMissing.length) fail(`Production SMTP configuration is missing: ${smtpMissing.join(', ')}.`);
  }
  for (const key of ['FRONTEND_URL', 'R2_ENDPOINT', 'R2_PUBLIC_URL']) {
    let url;
    try {
      url = new URL(runtime[key]);
    } catch {
      fail(`${key} must be a valid absolute URL.`);
    }
    if (!['http:', 'https:'].includes(url.protocol)) fail(`${key} must use HTTP or HTTPS.`);
  }
  if (runtime.SMTP_MODE !== 'disabled' &&
      (!/^\d+$/.test(runtime.SMTP_PORT || '') || Number(runtime.SMTP_PORT) < 1 || Number(runtime.SMTP_PORT) > 65535)) {
    fail('SMTP_PORT must be an integer between 1 and 65535.');
  }

  const backupId = process.env.BACKUP_VERIFICATION_ID;
  if (!backupId || process.env.BACKUP_RESTORABLE !== 'true') {
    fail('A verified, restorable database backup is required before migration.');
  }
  if (process.env.SCHEMA_COMPATIBLE !== 'true') {
    fail('Schema compatibility must be confirmed before migration.');
  }

  const commit = process.env.GIT_SHA;
  if (!commit || !/^[0-9a-f]{40}$/i.test(commit)) fail('GIT_SHA must be a full commit SHA.');

  const childEnvironment = {
    PATH: process.env.PATH,
    HOME: process.env.HOME,
    USER: process.env.USER,
    LANG: process.env.LANG,
    NODE_ENV: process.env.NODE_ENV || 'production',
    PM2_HOME: process.env.PM2_HOME,
    ...runtime,
    APP_ENV_FILE: runtimeFile,
    DEPLOY_ENV: environment,
    GITHUB_REF_NAME: branch,
    RELEASE_DIR: releaseDirectory,
    GIT_SHA: commit,
    PM2_LOG_DIR: '/var/log/siscapacitaciones',
  };
  try {
    validateDeploymentEnvironment(childEnvironment, branch);
  } catch (error) {
    fail(error.message);
  }

  const dotenvLink = path.join(releaseDirectory, '.env');
  try {
    if (fs.existsSync(dotenvLink) && !fs.lstatSync(dotenvLink).isSymbolicLink()) {
      fail('Release .env must not be a tracked or copied file.');
    }
    fs.rmSync(dotenvLink, { force: true });
    fs.symlinkSync(runtimeFile, dotenvLink);
  } catch (error) {
    if (error.code) fail('Could not link the private runtime configuration into the release.');
    throw error;
  }

  await checkHealth(deployment.otherEnvironment, deployment.otherPort);
  run('npm', ['run', 'migration:run'], releaseDirectory, childEnvironment);
  run('pm2', ['startOrReload', 'ecosystem.config.cjs', '--only', deployment.processName, '--update-env'], releaseDirectory, childEnvironment);
  run('pm2', ['save'], releaseDirectory, childEnvironment);
  await checkHealth(environment, deployment.port, commit);
  await checkHealth(deployment.otherEnvironment, deployment.otherPort);
  process.stdout.write(`${environment} deployment ${commit} is healthy; both API processes responded.\n`);
}

function run(command, args, cwd, env) {
  const result = spawnSync(command, args, { cwd, env, stdio: 'inherit' });
  if (result.error) fail(`${command} could not be started.`);
  if (result.status !== 0) fail(`${command} failed; deployment stopped.`);
}

async function checkHealth(environment, port, expectedCommit) {
  let response;
  try {
    response = await fetch(`http://127.0.0.1:${port}/health`, { signal: AbortSignal.timeout(8000) });
  } catch {
    fail(`${environment} health check failed on port ${port}.`);
  }
  if (!response.ok) fail(`${environment} health check failed on port ${port}.`);

  let health;
  try {
    health = await response.json();
  } catch {
    fail(`${environment} returned an invalid health response.`);
  }
  if (health.status !== 'ok' || health.environment !== environment || !health.commit ||
      (expectedCommit && health.commit !== expectedCommit)) {
    fail(`${environment} returned an invalid health response.`);
  }
  process.stdout.write(`${environment} healthy (${health.commit}).\n`);
}

main().catch(() => fail('Deployment failed due to an unexpected error.'));
