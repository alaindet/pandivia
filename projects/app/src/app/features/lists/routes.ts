import { Routes } from '@angular/router';

import { ListsPageComponent } from './lists.component';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { LISTS_FEATURE_NAME, ListsEffects, listsReducer } from './store';

export const LISTS_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ListsPageComponent,
    providers: [
      provideState(LISTS_FEATURE_NAME, listsReducer),
      provideEffects(ListsEffects),
    ],
  },
];
