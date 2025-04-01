import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { MediaQueryService } from '@fruit/services';

import { APP_ROUTES } from './app.routes';
import { TRANSLOCO_PROVIDERS } from './core/config/transloco';
import { FIREBASE_PROVIDERS } from './core/config/firebase';

const CORE_PROVIDERS = [
  provideHttpClient(),
  provideRouter(APP_ROUTES),
  provideServiceWorker('ngsw-worker.js', {
    enabled: !isDevMode(),
    registrationStrategy: 'registerWhenStable:30000',
  }),
];

export const appConfig: ApplicationConfig = {
  providers: [
    ...CORE_PROVIDERS,
    ...TRANSLOCO_PROVIDERS,
    ...FIREBASE_PROVIDERS,
    MediaQueryService,
  ],
};
