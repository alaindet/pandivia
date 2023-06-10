import { createReducer } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';

import * as fromActions from './actions';
import { INVENTORY_FEATURE_INITIAL_STATE } from './state';
import { LOADING_STATUS } from '@app/common/types';
import { getRandomHash } from '@app/common/utils';
import { InventoryItem } from '@app/core';

export const inventoryReducer = createReducer(INVENTORY_FEATURE_INITIAL_STATE,

  // Fetching -----------------------------------------------------------------

  immerOn(
    fromActions.inventoryFetchItemsActions.fetchItems,
    fromActions.inventoryFetchItemsActions.forceFetchItems,
    state => {
      state.status = LOADING_STATUS.LOADING;
    },
  ),

  immerOn(fromActions.inventoryFetchItemsActions.fetchItemsCached, state => {
    state.status = LOADING_STATUS.IDLE;
  }),

  immerOn(fromActions.inventoryFetchItemsActions.fetchItemsSuccess, (state, { items }) => {
    state.status = LOADING_STATUS.IDLE;
    state.items = items;
  }),

  immerOn(fromActions.inventoryFetchItemsActions.fetchItemsError, state => {
    state.status = LOADING_STATUS.ERROR;
  }),

  // Inventory item actions ---------------------------------------------------

  immerOn(fromActions.inventoryItemActions.create, (state, { dto }) => {
    const id = getRandomHash(5); // TODO: Mock
    const item = { ...dto, id } as InventoryItem;
    state.items.unshift(item);
  }),
);
