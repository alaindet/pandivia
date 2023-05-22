import { createReducer } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';

import * as fromActions from './actions';
import { INVENTORY_FEATURE_INITIAL_STATE } from './state';
import { LOADING_STATUS } from '@app/common/types';

export const inventoryReducer = createReducer(INVENTORY_FEATURE_INITIAL_STATE,

  immerOn(
    fromActions.fetchInventoryItemsActions.fetchItems,
    fromActions.fetchInventoryItemsActions.forceFetchItems,
    state => {
      state.status = LOADING_STATUS.LOADING;
    },
  ),

  immerOn(fromActions.fetchInventoryItemsActions.fetchItemsSuccess, (state, { items }) => {
    state.status = LOADING_STATUS.IDLE;
    state.items = items;
  }),

  immerOn(fromActions.fetchInventoryItemsActions.fetchItemsError, state => {
    state.status = LOADING_STATUS.ERROR;
  }),
);
