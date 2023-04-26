import { Environment } from './model';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const doNothing = (): void => {};

export const environment: Environment = {
  production: true,
  backend: 'https://gymbkprg.adamhlavacek.com/api',
  edulint: 'https://edulint.rechtackova.cz/',
  urlPrefix: '',
  logger: {
    log: doNothing,
    error: console.error,
    debug: doNothing,
    warn: doNothing
  },
  mergeSimilarWaves: true,
  oldFrontendUrl: 'https://gymbkprg-admin.adamhlavacek.com/'
};
