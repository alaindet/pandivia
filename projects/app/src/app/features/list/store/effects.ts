import { Injectable, inject } from '@angular/core';
import { catchError, filter, map, of, switchMap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as fromActions from './actions';
import { selectListExists } from './selectors';
import { ListService } from '../list.service';

@Injectable()
export class CounterEffects {

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