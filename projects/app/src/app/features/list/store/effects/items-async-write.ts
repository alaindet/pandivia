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
    map(action => {
      switch(action.type) {
        case listAllItemsActions.complete.type:
          return () => this.listService.completeAllItems();
        case listAllItemsActions.undo.type:
          return () => this.listService.undoAllItems();
        case listCategoryActions.complete.type:
          return () => this.listService.completeItemsByCategory(action.category);
        case listCategoryActions.undo.type:
          return () => this.listService.undoItemsByCategory(action.category);
      }
    }),
    // This allows to react to the error without breaking the effect chain!
    // https://medium.com/city-pantry/handling-errors-in-ngrx-effects-a95d918490d9
    switchMap(request => request().pipe(
      map(items => {
        const message = 'Items edited'; // TODO: Translate
        return listItemsAsyncWriteActions.editSuccess({ message, items });
      }),
      catchError(() => {
        const message = `Error while editing items`; // TODO: Translate
        return of(listItemsAsyncWriteActions.editError({ message }));
      }),
    )),
  ));

  removeItems$ = createEffect(() => this.actions.pipe(
    ofType(
      listAllItemsActions.remove,
      listAllItemsActions.removeCompleted,
      listCategoryActions.remove,
      listCategoryActions.removeCompleted,
    ),
    map(action => {
      switch(action.type) {
        case listAllItemsActions.remove.type:
          return () => this.listService.removeAll();
        case listAllItemsActions.removeCompleted.type:
          return () => this.listService.removeAllCompleted();
        case listCategoryActions.removeCompleted.type:
          return () => this.listService.removeCompletedByCategory(action.category);
        case listCategoryActions.remove.type:
          return () => this.listService.removeByCategory(action.category);
      }
    }),
    switchMap(request => request().pipe(
      map(items => {
        const message = 'Items deleted'; // TODO: Translate
        return listItemsAsyncWriteActions.editSuccess({ message, items })
      }),
      catchError(() => {
        const message = `Error while deleting items`; // TODO: Translate
        return of(listItemsAsyncWriteActions.editError({ message }));
      }),
    )),
  ));
}
