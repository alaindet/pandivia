import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import { OldInventoryService, InventoryService } from '../../services';
import { inventoryItemActions, inventoryItemAsyncWriteActions } from '../actions';

@Injectable()
export class InventoryItemAsyncWriteEffects {

  private actions = inject(Actions);
  private oldInventoryService = inject(OldInventoryService);
  private inventoryService = inject(InventoryService);

  createItem$ = createEffect(() => this.actions.pipe(
    ofType(inventoryItemActions.create),
    switchMap(({ dto }) => this.inventoryService.createItem(dto).pipe(
      map(item => {
        const message = 'common.async.createItemSuccess';
        return inventoryItemAsyncWriteActions.createSuccess({ message, item })
      }),
      catchError(() => {
        const message = 'common.async.createItemError';
        return of(inventoryItemAsyncWriteActions.createError({ message }));
      }),
    )),
  ));

  editItem$ = createEffect(() => this.actions.pipe(
    ofType(inventoryItemActions.edit),
    switchMap(({ item }) => this.oldInventoryService.editItem(item).pipe(
      map(item => {
        const message = 'common.async.editItemSuccess';
        return inventoryItemAsyncWriteActions.editSuccess({ message, item })
      }),
      catchError(() => {
        const message = 'common.async.editItemError';
        return of(inventoryItemAsyncWriteActions.editError({ message }));
      }),
    )),
  ));

  deleteItem$ = createEffect(() => this.actions.pipe(
    ofType(inventoryItemActions.remove),
    switchMap(({ itemId }) => this.oldInventoryService.removeItem(itemId).pipe(
      map(item => {
        const message = 'common.async.removeItemSuccess';
        return inventoryItemAsyncWriteActions.removeSuccess({ message, item })
      }),
      catchError(() => {
        const message = 'common.async.removeItemError';
        return of(inventoryItemAsyncWriteActions.removeError({ message }));
      }),
    )),
  ));
}
