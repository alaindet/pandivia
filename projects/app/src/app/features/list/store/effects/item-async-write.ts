import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import { ListService } from '../../services/old-list.service';
import { listItemActions, listItemAsyncWriteActions } from '../actions';

@Injectable()
export class ListItemAsyncWriteEffects {

  private actions = inject(Actions);
  private listService = inject(ListService);

  createItem$ = createEffect(() => this.actions.pipe(
    ofType(listItemActions.create),
    switchMap(({ dto }) => this.listService.createItem(dto).pipe(
      map(item => {
        const message = 'common.async.createItemSuccess';
        return listItemAsyncWriteActions.createSuccess({ message, item });
      }),
      catchError(() => {
        const message = 'common.async.createItemError';
        return of(listItemAsyncWriteActions.createError({ message }));
      }),
    )),
  ));

  editItem$ = createEffect(() => this.actions.pipe(
    ofType(
      listItemActions.edit,
      listItemActions.complete,
      listItemActions.undo,
      listItemActions.toggle,
      listItemActions.increment,
      listItemActions.decrement,
    ),
    map(action => {
      switch(action.type) {
        case listItemActions.edit.type:
          return () => this.listService.editItem(action.item);
        case listItemActions.complete.type:
          return () => this.listService.completeItem(action.itemId);
        case listItemActions.undo.type:
          return () => this.listService.undoItem(action.itemId);
        case listItemActions.toggle.type:
          return () => this.listService.toggleItem(action.itemId);
        case listItemActions.increment.type:
          return () => this.listService.incrementItem(action.itemId);
        case listItemActions.decrement.type:
          return () => this.listService.decrementItem(action.itemId);
      }
    }),
    switchMap(request => request().pipe(
      map(item => {
        const message = 'common.async.editItemSuccess';
        return listItemAsyncWriteActions.editSuccess({ message, item });
      }),
      catchError(() => {
        const message = 'common.async.editItemError';
        return of(listItemAsyncWriteActions.editError({ message }));
      }),
    )),
  ));

  deleteItem$ = createEffect(() => this.actions.pipe(
    ofType(listItemActions.remove),
    switchMap(({ itemId }) => this.listService.removeItem(itemId).pipe(
      map(item => {
        const message = 'common.async.removeItemSuccess';
        return listItemAsyncWriteActions.removeSuccess({ message, item });
      }),
      catchError(() => {
        const message = 'common.async.removeItemError';
        return of(listItemAsyncWriteActions.removeError({ message }));
      }),
    )),
  ));
}
