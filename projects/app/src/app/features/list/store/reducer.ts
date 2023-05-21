import { createReducer } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';

import * as fromActions from './actions';
import { LIST_FEATURE_INITIAL_STATE } from './state';
import { LOADING_STATUS } from '@app/common/types';

export const listReducer = createReducer(LIST_FEATURE_INITIAL_STATE,

  immerOn(
    fromActions.fetchItemsActions.fetchItems,
    fromActions.fetchItemsActions.forceFetchItems,
    state => {
      state.status = LOADING_STATUS.LOADING;
    },
  ),

  immerOn(fromActions.fetchItemsActions.fetchItemsSuccess, state => {
    state.status = LOADING_STATUS.IDLE;
  }),

  immerOn(fromActions.fetchItemsActions.fetchItemsError, state => {
    state.status = LOADING_STATUS.ERROR;
  }),
);