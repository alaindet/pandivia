import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import { InventoryService } from '../../services';
import { inventoryCreateItem, inventoryEditItem, inventoryRemoveItem } from '../actions';

@Injectable()
export class InventoryItemEffects {

  private actions = inject(Actions);
  private inventoryService = inject(InventoryService);

  createItem$ = createEffect(() => this.actions.pipe(
    ofType(inventoryCreateItem.try),
    switchMap(({ dto }) => this.inventoryService.createItem(dto).pipe(
      map(item => {
        const message = 'common.async.createItemSuccess';
        return inventoryCreateItem.ok({ item, message })
      }),
      catchError(err => {
        console.error(err);
        const message = 'common.async.createItemError';
        return of(inventoryCreateItem.err({ message }));
      }),
    )),
  ));

  editItem$ = createEffect(() => this.actions.pipe(
    ofType(inventoryEditItem.try),
    switchMap(({ item }) => this.inventoryService.editItem(item).pipe(
      map(item => {
        const message = 'common.async.editItemSuccess';
        return inventoryEditItem.ok({ message, item })
      }),
      catchError(err => {
        console.error(err);
        const message = 'common.async.editItemError';
        return of(inventoryEditItem.err({ message }));
      }),
    )),
  ));

  deleteItem$ = createEffect(() => this.actions.pipe(
    ofType(inventoryRemoveItem.try),
    switchMap(({ itemId }) => this.inventoryService.removeItem(itemId).pipe(
      map(() => {
        const message = 'common.async.removeItemSuccess';
        return inventoryRemoveItem.ok({ itemId, message });
      }),
      catchError(err => {
        console.error(err);
        const message = 'common.async.removeItemError';
        return of(inventoryRemoveItem.err({ message }));
      }),
    )),
  ));
}
