import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { userSignOut } from '@app/features/user/store';
import { map } from 'rxjs';
import { inventoryFeatureReset } from '../actions';

@Injectable()
export class InventorySignOutEffects {

  private actions = inject(Actions);

  resetFeature$ = createEffect(() => this.actions.pipe(
    ofType(userSignOut.ok),
    map(() => inventoryFeatureReset()),
  ));
}
