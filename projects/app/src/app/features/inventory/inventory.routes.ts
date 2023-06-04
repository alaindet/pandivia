import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { InventoryPageComponent } from './inventory.component';
import { INVENTORY_FEATURE_EFFECTS, INVENTORY_FEATURE_NAME, inventoryReducer } from './store';

export const INVENTORY_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: InventoryPageComponent,
    providers: [
      provideState(INVENTORY_FEATURE_NAME, inventoryReducer),
      provideEffects(...INVENTORY_FEATURE_EFFECTS),
    ],
  },
];
