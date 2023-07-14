import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';

import { ListService } from '../../services';
import { fetchListItemsHelper } from '../helpers';
import { selectListShouldFetch } from '../selectors';
import { listCompleteItems, listFetchItems, listRemoveCompletedItems, listRemoveItems, listUndoItems } from '../actions';

@Injectable()
export class ListAllItemsEffects {

  private store = inject(Store);
  private actions = inject(Actions);
  private svc = inject(ListService).allItems;

  fetchItems$ = createEffect(() => this.actions.pipe(
    ofType(listFetchItems.try),
    withLatestFrom(this.store.select(selectListShouldFetch)),
    switchMap(([_, shouldFetch]) => shouldFetch
      ? fetchListItemsHelper(this.svc)
      : of(listFetchItems.cached())
    ),
  ));

  forceFetchItems$ = createEffect(() => this.actions.pipe(
    ofType(listFetchItems.force),
    switchMap(() => fetchListItemsHelper(this.svc)),
  ));

  complete$ = createEffect(() => this.actions.pipe(
    ofType(listCompleteItems.try),
    switchMap(() => this.svc.complete().pipe(
      map(() => {
        const message = 'common.async.editItemsSuccess';
        return listCompleteItems.ok({ message });
      }),
      catchError(() => {
        const message = 'common.async.editItemsError';
        return of(listCompleteItems.err({ message }));
      }),
    )),
  ));

  undo$ = createEffect(() => this.actions.pipe(
    ofType(listUndoItems.try),
    switchMap(() => this.svc.undo().pipe(
      map(() => {
        const message = 'common.async.editItemsSuccess';
        return listUndoItems.ok({ message });
      }),
      catchError(() => {
        const message = 'common.async.editItemError';
        return of(listUndoItems.err({ message  }));
      }),
    )),
  ));

  removeAll$ = createEffect(() => this.actions.pipe(
    ofType(listRemoveItems.try),
    switchMap(() => this.svc.remove().pipe(
      map(() => {
        const message = 'common.async.removeItemsSuccess';
        return listRemoveItems.ok({ message });
      }),
      catchError(() => {
        const message = 'common.async.removeItemsError';
        return of(listRemoveItems.err({ message }));
      }),
    )),
  ));

  removeCompleted$ = createEffect(() => this.actions.pipe(
    ofType(listRemoveCompletedItems.try),
    switchMap(() => this.svc.removeCompleted().pipe(
      map(() => {
        const message = 'common.async.removeItemsSuccess';
        return listRemoveCompletedItems.ok({ message });
      }),
      catchError(() => {
        const message = 'common.async.removeItemsError';
        return of(listRemoveCompletedItems.err({ message }));
      }),
    )),
  ));
}
