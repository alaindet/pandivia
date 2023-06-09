import { Routes } from '@angular/router';

import { ListPageComponent } from './list.component';

export const LIST_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ListPageComponent,
    // providers: [
    //   provideState(LIST_FEATURE_NAME, listReducer),
    //   provideEffects(...LIST_FEATURE_EFFECTS),
    // ],
  },
];
