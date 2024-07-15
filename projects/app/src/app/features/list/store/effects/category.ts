import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { ListService } from '../../services';
import { catchError, map, of, switchMap } from 'rxjs';
import { listCompleteItemsByCategory, listRemoveCompletedItemsByCategory, listRemoveItemsByCategory, listUndoItemsByCategory } from '../actions';

@Injectable()
export class ListCategoryItemsEffects {

  private actions = inject(Actions);
  private svc = inject(ListService).categoryItems;

  complete$ = createEffect(() => this.actions.pipe(
    ofType(listCompleteItemsByCategory.try),
    switchMap(({ category }) => this.svc.complete(category).pipe(
      map(() => {
        const message = 'common.async.editItemsSuccess';
        return listCompleteItemsByCategory.ok({ category, message });
      }),
      catchError(() => {
        const message = 'common.async.editItemsError';
        return of(listCompleteItemsByCategory.err({ message }));
      }),
    )),
  ));

  undo$ = createEffect(() => this.actions.pipe(
    ofType(listUndoItemsByCategory.try),
    switchMap(({ category }) => this.svc.undo(category).pipe(
      map(() => {
        const message = 'common.async.editItemsSuccess';
        return listUndoItemsByCategory.ok({ category, message });
      }),
      catchError(() => {
        const message = 'common.async.editItemsError';
        return of(listUndoItemsByCategory.err({ message }));
      }),
    )),
  ));

  removeCompleted$ = createEffect(() => this.actions.pipe(
    ofType(listRemoveCompletedItemsByCategory.try),
    switchMap(({ category }) => this.svc.removeCompleted(category).pipe(
      map(() => {
        const message = 'common.async.removeItemsSuccess';
        return listRemoveCompletedItemsByCategory.ok({ category, message });
      }),
      catchError(() => {
        const message = 'common.async.removeItemsError';
        return of(listRemoveCompletedItemsByCategory.err({ message }));
      }),
    )),
  ));

  remove$ = createEffect(() => this.actions.pipe(
    ofType(listRemoveItemsByCategory.try),
    switchMap(({ category }) => this.svc.remove(category).pipe(
      map(() => {
        const message = 'common.async.removeItemsSuccess';
        return listRemoveItemsByCategory.ok({ category, message });
      }),
      catchError(() => {
        const message = 'common.async.removeItemsError';
        return of(listRemoveItemsByCategory.err({ message }));
      }),
    )),
  ));
}
