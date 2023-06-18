import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { APP_ROUTES } from './app.routes';
import { NGRX_PROVIDERS, TRANSLOCO_PROVIDERS } from './core/config';

const CORE_PROVIDERS = [
  provideHttpClient(),
  provideRouter(APP_ROUTES),
];

export const appConfig: ApplicationConfig = {
  providers: [
    ...CORE_PROVIDERS,
    ...NGRX_PROVIDERS,
    ...TRANSLOCO_PROVIDERS,
  ]
};
