import { Routes } from '@angular/router';

import { InventoryPageComponent } from './inventory.component';

export const INVENTORY_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: InventoryPageComponent,
  },
];
