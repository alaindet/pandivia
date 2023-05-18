import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';

import { rootReducer, rootEffects } from '@app/core/store';
import { environment } from '../environments/environment';
import { APP_ROUTES } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom([
      HttpClientModule,
    ]),
    provideRouter(APP_ROUTES),
    provideStore(rootReducer),
    environment.production ? [] : provideStoreDevtools(),
    provideEffects(rootEffects),
  ]
};
