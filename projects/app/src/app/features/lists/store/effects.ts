import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, of } from 'rxjs';

import { createListActions, deleteListActions, updateListActions } from './actions';
import { ListsApiService } from '../lists.api.service';

@Injectable()
export class ListsEffects {

  private actions = inject(Actions);
  private api = inject(ListsApiService);

  createList$ = createEffect(() => this.actions.pipe(
    ofType(createListActions.tryToCreate),
    switchMap(({ name }) => this.api.createList(name).pipe(
      map(list => {
        if (!list) throw new Error(`Cannot create a new list with name "${name}"`);
        return createListActions.successfullyCreated({ list });
      }),
      catchError(() => of(createListActions.failedToCreate())),
    )),
  ));

  updateList$ = createEffect(() => this.actions.pipe(
    ofType(updateListActions.tryToUpdate),
    switchMap(({ list }) => this.api.updateList(list).pipe(
      map(theList => {
        if (!theList) throw new Error(`No list found with id "${list.id}"`);
        return updateListActions.successfullyUpdated({ list: theList });
      }),
      catchError(() => of(updateListActions.failedToUpdate({ list }))),
    )),
  ));

  deleteList$ = createEffect(() => this.actions.pipe(
    ofType(deleteListActions.tryToDelete),
    switchMap(({ list }) => this.api.deleteList(list).pipe(
      map(theList => {
        if (!theList) throw new Error(`No list found with id "${list.id}"`);
        return deleteListActions.successfullyDeleted({ list: theList });
      }),
      catchError(() => of(deleteListActions.failedToDelete({ list }))),
    )),
  ));
}
