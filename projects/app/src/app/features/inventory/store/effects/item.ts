import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, catchError, map, of, switchMap, take, throwError, withLatestFrom } from 'rxjs';

import { InventoryService } from '../../services';
import { inventoryCloneItemFromList, inventoryCreateItem, inventoryEditItem, inventoryRemoveItem } from '../actions';
import { Store } from '@ngrx/store';
import { selectInventoryItemExistsWithName } from '../selectors';

@Injectable()
export class InventoryItemEffects {

  private store = inject(Store);
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

  cloneFromListItem$ = createEffect(() => this.actions.pipe(
    ofType(inventoryCloneItemFromList.try),
    switchMap(({ dto }) => {
      const inventoryItemExists = selectInventoryItemExistsWithName(dto.name);
      return this.store.select(inventoryItemExists).pipe(
        take(1),
        switchMap(exists => {

          if (exists) {
            const message = `Item "${dto.name}" already exists in the Inventory`;
            return of(inventoryCloneItemFromList.errDuplicate({ message }));
          }

          return this.inventoryService.createItem(dto).pipe(
            map(item => {
              const message = `Item "${dto.name}" was successfully created in the Inventory`;
              return inventoryCloneItemFromList.ok({ item, message });
            }),
            catchError(err => {
              console.error(err);
              const message = `Cannot create item "${dto.name}" in the Inventory`;
              return of(inventoryCloneItemFromList.err({ message }));
            }),
          );
        }),
      );
    }),
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
