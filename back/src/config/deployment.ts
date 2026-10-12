export type DeploymentEnvironment = 'staging' | 'production';

export interface DeploymentConfiguration {
  environment: DeploymentEnvironment;
  branch: string;
  port: number;
  database: string;
  processName: string;
  otherEnvironment: DeploymentEnvironment;
  otherPort: number;
}

const DEPLOYMENTS: Record<DeploymentEnvironment, DeploymentConfiguration> = {
  staging: {
    environment: 'staging',
    branch: 'staging',
    port: 4043,
    database: 'cursos_dev',
    processName: 'siscapacitaciones-api-staging',
    otherEnvironment: 'production',
    otherPort: 4040,
  },
  production: {
    environment: 'production',
    branch: 'master',
    port: 4040,
    database: 'cursos',
    processName: 'siscapacitaciones-api',
    otherEnvironment: 'staging',
    otherPort: 4043,
  },
};

export function getDeploymentConfiguration(
  environment: string,
): DeploymentConfiguration {
  if (environment !== 'staging' && environment !== 'production') {
    throw new Error('DEPLOY_ENV must be staging or production.');
  }

  return DEPLOYMENTS[environment];
}

export function validateDeploymentEnvironment(
  env: NodeJS.ProcessEnv,
  branch?: string,
): DeploymentConfiguration | undefined {
  const environment = env.DEPLOY_ENV;
  if (!environment) {
    return undefined;
  }

  const expected = getDeploymentConfiguration(environment);
  const port = parsePort(env.PORT);

  if (port !== expected.port) {
    throw new Error(
      `PORT must be ${expected.port} for ${expected.environment}.`,
    );
  }
  if (env.DB_NAME !== expected.database) {
    throw new Error(
      `DB_NAME must be ${expected.database} for ${expected.environment}.`,
    );
  }
  if (env.PM2_PROCESS_NAME !== expected.processName) {
    throw new Error(
      `PM2_PROCESS_NAME must be ${expected.processName} for ${expected.environment}.`,
    );
  }
  if (
    expected.environment === 'staging' &&
    !['disabled', 'test'].includes(env.SMTP_MODE || '')
  ) {
    throw new Error('Staging SMTP_MODE must be disabled or test.');
  }
  if (expected.environment === 'production' && env.SMTP_MODE !== 'production') {
    throw new Error('Production SMTP_MODE must be production.');
  }
  if (env.SMTP_MODE === 'test' && !env.SMTP_TEST_RECIPIENT) {
    throw new Error('SMTP_TEST_RECIPIENT is required when SMTP_MODE is test.');
  }
  if (
    expected.environment === 'staging' &&
    env.FRONTEND_URL === 'https://siscapacitaciones.net'
  ) {
    throw new Error('Staging FRONTEND_URL must be isolated from production.');
  }
  if (branch !== undefined && branch !== expected.branch) {
    throw new Error(
      `Branch ${branch} cannot deploy to ${expected.environment}; expected ${expected.branch}.`,
    );
  }

  return expected;
}

export function resolveApiPort(env: NodeJS.ProcessEnv): number {
  if (!env.PORT) {
    if (env.DEPLOY_ENV === 'staging') {
      throw new Error(
        'PORT is required for staging; it cannot default to 4040.',
      );
    }
    if (env.DEPLOY_ENV === 'production') {
      throw new Error('PORT is required for production deployment.');
    }
    return 4040;
  }

  const port = parsePort(env.PORT);
  if (env.DEPLOY_ENV) {
    validateDeploymentEnvironment(env);
  }
  return port;
}

function parsePort(value: string | undefined): number {
  if (!value || !/^\d+$/.test(value)) {
    throw new Error('PORT must be an integer between 1 and 65535.');
  }

  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535.');
  }

  return port;
}
