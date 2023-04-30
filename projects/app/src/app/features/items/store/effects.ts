import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, of } from 'rxjs';

import { createItemActions, updateItemActions, deleteItemActions } from './actions';
import { ListItemsApiService } from '../items.api.service';

@Injectable()
export class ListItemsEffects {

  private actions = inject(Actions);
  private api = inject(ListItemsApiService);

  createItemOnList$ = createEffect(() => this.actions.pipe(
    ofType(createItemActions.tryToCreate),
    switchMap(({ request }) => this.api.createItem(request).pipe(
      map(item => {
        const { listId } = request;
        if (!item) throw new Error(`Cannot create a new item on list with id ${listId}`);
        return createItemActions.successfullyCreated({ item });
      }),
      catchError(() => of(createItemActions.failedToCreate({ request }))),
    )),
  ));

  updateItemOnList$ = createEffect(() => this.actions.pipe(
    ofType(updateItemActions.tryToUpdate),
    switchMap(({ request }) => this.api.updateItem(request).pipe(
      map(item => {
        if (!item) throw new Error(`No item found with id ${request.id}`);
        return updateItemActions.successfullyUpdated({ item });
      }),
      catchError(() => of(updateItemActions.failedToUpdate({ request }))),
    )),
  ));

  deleteItemOnList$ = createEffect(() => this.actions.pipe(
    ofType(deleteItemActions.tryToDelete),
    switchMap(({ request }) => this.api.deleteItem(request).pipe(
      map(item => {
        if (!item) throw new Error(`No item found with id ${request.id}`);
        return deleteItemActions.successfullyDeleted({ item });
      }),
      catchError(() => of(deleteItemActions.failedToDelete({ request }))),
    )),
  ));
}
