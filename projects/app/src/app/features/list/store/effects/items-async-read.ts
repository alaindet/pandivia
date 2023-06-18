import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of, switchMap, withLatestFrom } from 'rxjs';

import { ListService } from '../../services/list.service';
import { listItemsAsyncReadActions } from '../actions';
import { fetchListItemsHelper } from '../helpers';
import { selectListShouldFetch } from '../selectors';

@Injectable()
export class ListItemsAsyncReadEffects {

  private store = inject(Store);
  private actions = inject(Actions);
  private listService = inject(ListService);

  fetchItems$ = createEffect(() => this.actions.pipe(
    ofType(listItemsAsyncReadActions.fetchItems),
    withLatestFrom(this.store.select(selectListShouldFetch)),
    switchMap(([_, shouldFetch]) => shouldFetch
      ? fetchListItemsHelper(this.listService)
      : of(listItemsAsyncReadActions.fetchItemsCached())
    ),
  ));

  forceFetchItems$ = createEffect(() => this.actions.pipe(
    ofType(listItemsAsyncReadActions.forceFetchItems),
    switchMap(() => fetchListItemsHelper(this.listService)),
  ));
}
