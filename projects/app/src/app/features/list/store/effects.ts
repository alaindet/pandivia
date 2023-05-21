import { Injectable, inject } from '@angular/core';
import { catchError, filter, map, of, switchMap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as fromActions from './actions';
import { selectListExists } from './selectors';
import { ListService } from '../list.service';
import { loaderActions, notificationsActions } from '@app/core/store';

@Injectable()
export class ListEffects {

  private store = inject(Store);
  private actions = inject(Actions);
  private listService = inject(ListService);

  fetchItems$ = createEffect(() => this.actions.pipe(
    ofType(fromActions.fetchItemsActions.fetchItems),
    withLatestFrom(this.store.select(selectListExists)),
    filter(([_, exists]) => !exists),
    switchMap(() => fetchItemsHelper(this.listService)),
  ));

  forceFetchItems$ = createEffect(() => this.actions.pipe(
    ofType(fromActions.fetchItemsActions.forceFetchItems),
    switchMap(() => fetchItemsHelper(this.listService)),
  ));

  // TODO: Generalize?
  startLoader$ = createEffect(() => this.actions.pipe(
    ofType(
      fromActions.fetchItemsActions.fetchItems,
      fromActions.fetchItemsActions.forceFetchItems,
    ),
    switchMap(() => of(loaderActions.start())),
  ));

  // TODO: Generalize?
  stopLoader$ = createEffect(() => this.actions.pipe(
    ofType(
      fromActions.fetchItemsActions.fetchItemsSuccess,
      fromActions.fetchItemsActions.fetchItemsError,
    ),
    switchMap(() => of(loaderActions.stop())),
  ));

  // TODO: Generalize?
  showError$ = createEffect(() => this.actions.pipe(
    ofType(fromActions.fetchItemsActions.fetchItemsError),
    switchMap(action => of(notificationsActions.addError({ message: action.error }))),
  ));
}

function fetchItemsHelper(listService: ListService) {
  return listService.getItems().pipe(
    map(items => fromActions.fetchItemsActions.fetchItemsSuccess({ items })),
    catchError(() => {
      const error = 'Could not fetch items'; // TODO: Translate
      return of(fromActions.fetchItemsActions.fetchItemsError({ error }));
    })
  )
}

export const LIST_FEATURE_EFFECTS = [
  ListEffects,
];