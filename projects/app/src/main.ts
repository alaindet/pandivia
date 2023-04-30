import { enableProdMode, importProvidersFrom } from '@angular/core';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';

import { environment } from '@app/environment';
import { rootReducer, rootEffects } from '@app/core/store';
import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/routes';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom([
      BrowserModule,
      HttpClientModule,
    ]),
    provideRouter(APP_ROUTES),
    provideStore(rootReducer),
    environment.production ? [] : provideStoreDevtools(),
    provideEffects(rootEffects),
  ],
}).catch(err => console.error(err));
