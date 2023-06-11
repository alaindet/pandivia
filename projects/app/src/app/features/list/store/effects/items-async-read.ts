import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of, switchMap, withLatestFrom } from 'rxjs';

import { ListService } from '../../list.service';
import * as fromActions from '../actions';
import { fetchItemsHelper } from '../helpers';
import { selectListShouldFetch } from '../selectors';

@Injectable()
export class ListItemsAsyncReadEffects {

  private store = inject(Store);
  private actions = inject(Actions);
  private listService = inject(ListService);

  fetchItems$ = createEffect(() => this.actions.pipe(
    ofType(fromActions.listItemsAsyncReadActions.fetchItems),
    withLatestFrom(this.store.select(selectListShouldFetch)),
    switchMap(([_, shouldFetch]) => shouldFetch
      ? fetchItemsHelper(this.listService)
      : of(fromActions.listItemsAsyncReadActions.fetchItemsCached())
    ),
  ));

  forceFetchItems$ = createEffect(() => this.actions.pipe(
    ofType(fromActions.listItemsAsyncReadActions.forceFetchItems),
    switchMap(() => fetchItemsHelper(this.listService)),
  ));
}