import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import { InventoryService } from '../../services';
import { inventoryItemActions, inventoryItemAsyncWriteActions } from '../actions';

@Injectable()
export class InventoryItemAsyncWriteEffects {

  private actions = inject(Actions);
  private inventoryService = inject(InventoryService);

  createItem$ = createEffect(() => this.actions.pipe(
    ofType(inventoryItemActions.create),
    switchMap(({ dto }) => this.inventoryService.createItem(dto).pipe(
      map(item => {
        const message = `Item "${dto.name}" created`; // TODO: Translate
        return inventoryItemAsyncWriteActions.createSuccess({ message, item })
      }),
      catchError(() => {
        const message = `Error while creating item "${dto.name}"`; // TODO: Translate
        return of(inventoryItemAsyncWriteActions.createError({ message }));
      }),
    )),
  ));

  editItem$ = createEffect(() => this.actions.pipe(
    ofType(inventoryItemActions.edit),
    switchMap(({ item }) => this.inventoryService.editItem(item).pipe(
      map(item => {
        const message = `Item "${item.name}" edited`; // TODO: Translate
        return inventoryItemAsyncWriteActions.editSuccess({ message, item })
      }),
      catchError(() => {
        const message = `Error while editing item`; // TODO: Translate
        return of(inventoryItemAsyncWriteActions.editError({ message }));
      }),
    )),
  ));

  deleteItem$ = createEffect(() => this.actions.pipe(
    ofType(inventoryItemActions.remove),
    switchMap(({ itemId }) => this.inventoryService.removeItem(itemId).pipe(
      map(item => {
        const message = `Item "${item.name}" removed`; // TODO: Translate
        return inventoryItemAsyncWriteActions.removeSuccess({ message, item })
      }),
      catchError(() => {
        const message = `Error while editing item with ID "${itemId}"`; // TODO: Translate
        return of(inventoryItemAsyncWriteActions.removeError({ message }));
      }),
    )),
  ));
}
