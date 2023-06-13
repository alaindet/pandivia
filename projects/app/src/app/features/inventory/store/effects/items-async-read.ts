import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of, switchMap, withLatestFrom } from 'rxjs';

import { InventoryService } from '../../services';
import { inventoryItemsAsyncReadActions } from '../actions';
import { fetchItemsHelper } from '../helpers';
import { selectInventoryShouldFetch } from '../selectors';

@Injectable()
export class InventoryItemsAsyncReadEffects {

  private store = inject(Store);
  private actions = inject(Actions);
  private inventoryService = inject(InventoryService);

  fetchItems$ = createEffect(() => this.actions.pipe(
    ofType(inventoryItemsAsyncReadActions.fetchItems),
    withLatestFrom(this.store.select(selectInventoryShouldFetch)),
    switchMap(([_, shouldFetch]) => shouldFetch
      ? fetchItemsHelper(this.inventoryService)
      : of(inventoryItemsAsyncReadActions.fetchItemsCached())
    ),
  ));

  forceFetchItems$ = createEffect(() => this.actions.pipe(
    ofType(inventoryItemsAsyncReadActions.forceFetchItems),
    switchMap(() => fetchItemsHelper(this.inventoryService)),
  ));
}
