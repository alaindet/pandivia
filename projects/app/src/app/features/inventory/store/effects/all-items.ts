import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';

import { InventoryService } from '../../services';
import { fetchInventoryItemsHelper } from '../helpers';
import { selectInventoryShouldFetch } from '../selectors';
import { inventoryFetchItems, inventoryRemoveItems } from '../actions';

@Injectable()
export class InventoryAllItemsEffects {

  private store = inject(Store);
  private actions = inject(Actions);
  private inventoryService = inject(InventoryService);

  fetchItems$ = createEffect(() => this.actions.pipe(
    ofType(inventoryFetchItems.try),
    withLatestFrom(this.store.select(selectInventoryShouldFetch)),
    switchMap(([_, shouldFetch]) => shouldFetch
      ? fetchInventoryItemsHelper(this.inventoryService)
      : of(inventoryFetchItems.cached())
    ),
  ));

  forceFetchItems$ = createEffect(() => this.actions.pipe(
    ofType(inventoryFetchItems.force),
    switchMap(() => fetchInventoryItemsHelper(this.inventoryService)),
  ));

  removeItems$ = createEffect(() => this.actions.pipe(
    ofType(inventoryRemoveItems.try),
    switchMap(() => this.inventoryService.removeAll().pipe(
      map(() => {
        const message = 'common.async.removeItemsSuccess';
        return inventoryRemoveItems.ok({ message });
      }),
      catchError(err => {
        console.error(err);
        const message = 'common.async.removeItemsError';
        return of(inventoryRemoveItems.err({ message }));
      }),
    )),
  ));
}
