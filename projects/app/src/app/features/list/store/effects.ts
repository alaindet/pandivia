import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, switchMap, withLatestFrom } from 'rxjs';

import { createUiController } from '@app/core/store/ui';
import { ListService } from '../list.service';
import * as fromActions from './actions';
import { fetchItemsHelper } from './helpers';
import { selectListExists } from './selectors';

@Injectable()
export class ListEffects {

  private store = inject(Store);
  private actions = inject(Actions);
  private listService = inject(ListService);
  private ui = createUiController(this.actions);

  fetchItems$ = createEffect(() => this.actions.pipe(
    ofType(fromActions.fetchListItemsActions.fetchItems),
    withLatestFrom(this.store.select(selectListExists)),
    filter(([_, exists]) => !exists),
    switchMap(() => fetchItemsHelper(this.listService)),
  ));

  forceFetchItems$ = createEffect(() => this.actions.pipe(
    ofType(fromActions.fetchListItemsActions.forceFetchItems),
    switchMap(() => fetchItemsHelper(this.listService)),
  ));

  startLoader$ = this.ui.startLoaderOn(
    fromActions.fetchListItemsActions.fetchItems,
    fromActions.fetchListItemsActions.forceFetchItems,
  );

  stopLoader$ = this.ui.stopLoaderOn(
    fromActions.fetchListItemsActions.fetchItemsSuccess,
    fromActions.fetchListItemsActions.fetchItemsError,
  );

  showError$ = this.ui.showErrorOn(
    fromActions.fetchListItemsActions.fetchItemsError,
  );
}

export const LIST_FEATURE_EFFECTS = [
  ListEffects,
];
