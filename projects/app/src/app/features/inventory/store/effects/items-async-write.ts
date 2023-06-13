import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import { InventoryService } from '../../services';
import {
  inventoryAllItemsActions,
  inventoryCategoryActions,
  inventoryItemsAsyncWriteActions,
} from '../actions';

@Injectable()
export class InventoryItemsAsyncWriteEffects {

  private actions = inject(Actions);
  private inventoryService = inject(InventoryService);

  removeItems$ = createEffect(() => this.actions.pipe(
    ofType(
      inventoryAllItemsActions.remove,
      inventoryCategoryActions.remove,
    ),
    map(action => {
      switch(action.type) {
        case inventoryAllItemsActions.remove.type:
          return () => this.inventoryService.removeAll();
        case inventoryCategoryActions.remove.type:
          return () => this.inventoryService.removeByCategory(action.category);
      }
    }),
    switchMap(request => request().pipe(
      map(items => {
        const message = 'Items deleted'; // TODO: Translate
        return inventoryItemsAsyncWriteActions.editSuccess({ message, items })
      }),
      catchError(() => {
        const message = `Error while deleting items`; // TODO: Translate
        return of(inventoryItemsAsyncWriteActions.editError({ message }));
      }),
    )),
  ));
}
