import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { CounterPageComponent } from './counter.component';
import { COUNTER_FEATURE_NAME, CounterEffects, counterReducer } from './store';

export const COUNTER_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: CounterPageComponent,
    providers: [
      provideState(COUNTER_FEATURE_NAME, counterReducer),
      provideEffects(CounterEffects),
    ],
  },
];
