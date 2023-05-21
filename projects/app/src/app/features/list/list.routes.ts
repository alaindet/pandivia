import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { ListFeatureComponent } from './list.component';
import { LIST_FEATURE_EFFECTS, LIST_FEATURE_NAME, listReducer } from './store';

export const LIST_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ListFeatureComponent,
    providers: [
      provideState(LIST_FEATURE_NAME, listReducer),
      provideEffects(...LIST_FEATURE_EFFECTS),
    ],
  },
];
