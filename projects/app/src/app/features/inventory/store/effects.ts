import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, switchMap, withLatestFrom } from 'rxjs';

import { createUiController } from '@app/core/store/ui';
import { InventoryService } from '../inventory.service';
import * as fromActions from './actions';
import { fetchItemsHelper } from './helpers';
import { selectInventoryExists } from './selectors';

@Injectable()
export class InventoryEffects {

  private store = inject(Store);
  private actions = inject(Actions);
  private inventoryService = inject(InventoryService);
  private ui = createUiController(this.actions);

  fetchItems$ = createEffect(() => this.actions.pipe(
    ofType(fromActions.fetchInventoryItemsActions.fetchItems),
    withLatestFrom(this.store.select(selectInventoryExists)),
    filter(([_, exists]) => !exists),
    switchMap(() => fetchItemsHelper(this.inventoryService)),
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
  );

  showError$ = this.ui.showErrorOn(
    fromActions.fetchInventoryItemsActions.fetchItemsError,
  );
}

export const INVENTORY_FEATURE_EFFECTS = [
  InventoryEffects,
];
