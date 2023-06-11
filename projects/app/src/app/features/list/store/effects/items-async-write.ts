import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import { ListService } from '../../list.service';
import { listAllItemsActions, listCategoryActions, listItemsAsyncWriteActions } from '../actions';

@Injectable()
export class ListItemsAsyncWriteEffects {

  private actions = inject(Actions);
  private listService = inject(ListService);

  editItems$ = createEffect(() => this.actions.pipe(
    ofType(
      listAllItemsActions.complete,
      listAllItemsActions.undo,
      listCategoryActions.complete,
      listCategoryActions.undo,
    ),
    switchMap(action => {
      switch(action.type) {
        case listAllItemsActions.complete.type:
          return this.listService.completeAllItems();
        case listAllItemsActions.undo.type:
          return this.listService.undoAllItems();
        case listCategoryActions.complete.type:
          return this.listService.completeItemsByCategory(action.category);
        case listCategoryActions.undo.type:
          return this.listService.undoItemsByCategory(action.category);
      }
    }),
    map(items => {
      const message = 'Items edited'; // TODO: Translate
      return listItemsAsyncWriteActions.editSuccess({ message, items })
    }),
    catchError(() => {
      const message = `Error while editing items`; // TODO: Translate
      return of(listItemsAsyncWriteActions.editError({ message }));
    }),
  ));

  removeItems$ = createEffect(() => this.actions.pipe(
    ofType(
      listAllItemsActions.removeCompleted,
      listAllItemsActions.remove,
      listCategoryActions.removeCompleted,
      listCategoryActions.remove,
    ),
    switchMap(action => {
      switch(action.type) {
        case listAllItemsActions.removeCompleted.type:
          return of([]); // TODO: Call service method
        case listAllItemsActions.remove.type:
          return of([]); // TODO: Call service method
        case listCategoryActions.removeCompleted.type:
          return of([]); // TODO: Call service method
        case listCategoryActions.remove.type:
          return of([]); // TODO: Call service method
      }
    }),
    map(items => {
      const message = 'Items deleted'; // TODO: Translate
      return listItemsAsyncWriteActions.editSuccess({ message, items })
    }),
    catchError(() => {
      const message = `Error while deleting items`; // TODO: Translate
      return of(listItemsAsyncWriteActions.editError({ message }));
    }),
  ));
}