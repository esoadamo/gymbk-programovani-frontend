import { Environment } from './model';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const doNothing = (): void => {};

export const environment: Environment = {
  production: true,
  backend: 'https://api-prg.gumbk.cz',
  edulint: {
    url: 'https://edulint.com',
    version: '2.10.2',
    config: 'https://ksi.fi.muni.cz/assets/edulint/ksi.toml'
  },
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
