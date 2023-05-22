import { catchError, map, of, switchMap } from 'rxjs';

import { InventoryService } from '../inventory.service';
import * as fromActions from './actions';
import { createEffect, ofType } from '@ngrx/effects';
import { loaderActions } from '@app/core';

export function fetchItemsHelper(inventoryService: InventoryService) {

  const onSuccess = fromActions.fetchInventoryItemsActions.fetchItemsSuccess;
  const onError = fromActions.fetchInventoryItemsActions.fetchItemsError;

  return inventoryService.getItems().pipe(
    map(items => onSuccess({ items })),
    catchError(() => {
      const error = 'Could not fetch items'; // TODO: Translate
      return of(onError({ error }));
    })
  )
}

// TODO
export function startLoaderOn(actions$: any, targetActions: any[]) {
  return createEffect(() => actions$.pipe(
    ofType(...targetActions),
    switchMap(() => of(loaderActions.start())),
  ));
}
