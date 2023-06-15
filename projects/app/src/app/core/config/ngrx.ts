import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { environment } from '@app/environment';
import { rootEffects, rootReducer } from '@app/core/store';

export const NGRX_PROVIDERS = [
  provideStore(rootReducer),
  environment.production ? [] : provideStoreDevtools(),
  provideEffects(rootEffects),
];
