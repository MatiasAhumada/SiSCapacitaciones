const path = require('node:path');
const {
  getDeploymentConfiguration,
  validateDeploymentEnvironment,
} = require('./dist/config/deployment');

const deployment = validateDeploymentEnvironment(process.env);
if (!deployment) {
  throw new Error('DEPLOY_ENV is required to configure a PM2 process.');
}

const releaseDirectory = process.env.RELEASE_DIR;
if (!releaseDirectory || !path.isAbsolute(releaseDirectory)) {
  throw new Error('RELEASE_DIR must be an absolute path.');
}

const config = getDeploymentConfiguration(deployment.environment);
const logDirectory = process.env.PM2_LOG_DIR || '/var/log/siscapacitaciones';

module.exports = {
  apps: [
    {
      name: config.processName,
      cwd: releaseDirectory,
      script: path.join(releaseDirectory, 'dist/main.js'),
      interpreter: 'node',
      env: { ...process.env },
      out_file: path.join(logDirectory, `${config.processName}.out.log`),
      error_file: path.join(logDirectory, `${config.processName}.error.log`),
      merge_logs: true,
      autorestart: true,
      time: true,
    },
  ],
};
