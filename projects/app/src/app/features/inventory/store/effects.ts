import { Injectable, inject } from '@angular/core';
import { catchError, filter, map, of, switchMap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { loaderActions, notificationsActions } from '@app/core/store';
import * as fromActions from './actions';
import { selectInventoryExists } from './selectors';
import { InventoryService } from '../inventory.service';
import { fetchItemsHelper } from './helpers';

@Injectable()
export class ListEffects {

  private store = inject(Store);
  private actions = inject(Actions);
  private inventoryService = inject(InventoryService);

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

  // TODO: Generalize?
  startLoader$ = createEffect(() => this.actions.pipe(
    ofType(
      fromActions.fetchInventoryItemsActions.fetchItems,
      fromActions.fetchInventoryItemsActions.forceFetchItems,
    ),
    switchMap(() => of(loaderActions.start())),
  ));

  // // TODO: Generalize?
  // stopLoader$ = createEffect(() => this.actions.pipe(
  //   ofType(
  //     fromActions.fetchInventoryItemsActions.fetchItemsSuccess,
  //     fromActions.fetchInventoryItemsActions.fetchItemsError,
  //   ),
  //   switchMap(() => of(loaderActions.stop())),
  // ));

  // // TODO: Generalize?
  // showError$ = createEffect(() => this.actions.pipe(
  //   ofType(fromActions.fetchInventoryItemsActions.fetchItemsError),
  //   switchMap(action => of(notificationsActions.addError({ message: action.error }))),
  // ));
}

export const LIST_FEATURE_EFFECTS = [
  ListEffects,
];
