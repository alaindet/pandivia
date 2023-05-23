import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of, switchMap, withLatestFrom } from 'rxjs';

import { createUiController } from '@app/core/store/ui';
import { InventoryService } from '../inventory.service';
import * as fromActions from './actions';
import { fetchItemsHelper } from './helpers';
import { selectInventoryShouldFetch } from './selectors';

@Injectable()
export class InventoryEffects {

  private store = inject(Store);
  private actions = inject(Actions);
  private inventoryService = inject(InventoryService);
  private ui = createUiController(this.actions);

  fetchItems$ = createEffect(() => this.actions.pipe(
    ofType(fromActions.fetchInventoryItemsActions.fetchItems),
    withLatestFrom(this.store.select(selectInventoryShouldFetch)),
    switchMap(([_, shouldFetch]) => shouldFetch
      ? fetchItemsHelper(this.inventoryService)
      : of(fromActions.fetchInventoryItemsActions.fetchItemsCached())
    ),
  ));

  forceFetchItems$ = createEffect(() => this.actions.pipe(
    ofType(fromActions.fetchInventoryItemsActions.forceFetchItems),
    switchMap(() => fetchItemsHelper(this.inventoryService)),
  ));

  startLoader$ = this.ui.startLoaderOn(
    fromActions.fetchInventoryItemsActions.fetchItems,
    fromActions.fetchInventoryItemsActions.forceFetchItems,
  );

  stopLoader$ = this.ui.stopLoaderOn(
    fromActions.fetchInventoryItemsActions.fetchItemsSuccess,
    fromActions.fetchInventoryItemsActions.fetchItemsError,
    fromActions.fetchInventoryItemsActions.fetchItemsCached,
  );

  showError$ = this.ui.showErrorOn(
    fromActions.fetchInventoryItemsActions.fetchItemsError,
  );
}

export const INVENTORY_FEATURE_EFFECTS = [
  InventoryEffects,
];
