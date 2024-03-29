import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';

import { InventoryService } from '../../services';
import { inventoryRemoveItemsByCategory } from '../actions';

@Injectable()
export class InventoryCategoryItemsEffects {

  private store = inject(Store);
  private actions = inject(Actions);
  private inventoryService = inject(InventoryService);

  removeItemsByCategory$ = createEffect(() => this.actions.pipe(
    ofType(inventoryRemoveItemsByCategory.try),
    switchMap(({ category }) => {
      return this.inventoryService.removeByCategory(category).pipe(
        map(() => {
          const message = 'common.async.removeItemsSuccess';
          return inventoryRemoveItemsByCategory.ok({ category, message });
        }),
        catchError(err => {
          console.error(err);
          const message = 'common.async.removeItemsError';
          return of(inventoryRemoveItemsByCategory.err({ message }));
        }),
      );
    }),
  ));
}
