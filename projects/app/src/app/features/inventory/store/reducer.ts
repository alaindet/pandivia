import { createReducer } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';

import { LOADING_STATUS } from '@app/common/types';
import { INVENTORY_FILTER } from '../types';
import {
  inventoryAllItemsActions as allItemsActions,
  inventoryCategoryActions as categoryActions,
  inventoryFilterActions as filterActions,
  inventoryItemActions as itemActions,
  inventoryItemAsyncWriteActions as itemAsyncWriteActions,
  inventoryItemsAsyncReadActions as itemsAsyncReadActions,
  inventoryItemsAsyncWriteActions as itemsAsyncWriteActions,
} from './actions';
import { setSuccessState } from './helpers';
import { INVENTORY_FEATURE_INITIAL_STATE } from './state';
import { replaceOn } from '@app/common/utils';

export const inventoryReducer = createReducer(INVENTORY_FEATURE_INITIAL_STATE,

  // Generic async ------------------------------------------------------------
  immerOn(
    itemsAsyncReadActions.fetchItems,
    itemsAsyncReadActions.forceFetchItems,

    allItemsActions.remove,

    categoryActions.remove,

    itemActions.create,
    itemActions.edit,
    itemActions.remove,
    state => {
      state.status = LOADING_STATUS.LOADING;
    },
  ),

  immerOn(
    itemsAsyncReadActions.fetchItemsError,

    itemsAsyncWriteActions.editError,
    itemsAsyncWriteActions.removeError,

    itemAsyncWriteActions.createError,
    itemAsyncWriteActions.editError,
    itemAsyncWriteActions.removeError,
    (state, { message }) => {
      console.log(message); // TODO: Remove?
      state.status = LOADING_STATUS.ERROR;
    },
  ),

  // Fetching -----------------------------------------------------------------

  immerOn(itemsAsyncReadActions.fetchItemsCached, state => {
    state.status = LOADING_STATUS.IDLE;
  }),

  immerOn(itemsAsyncReadActions.fetchItemsSuccess, (state, { items }) => {
    setSuccessState(state);
    state.items = items;
  }),

  // Filters ------------------------------------------------------------------

  immerOn(filterActions.setCategoryFilter, (state, { category }) => {
    state.filters[INVENTORY_FILTER.CATEGORY] = category;
  }),

  immerOn(filterActions.clearCategoryFilter, state => {
    state.filters[INVENTORY_FILTER.CATEGORY] = null;
  }),

  immerOn(filterActions.clearAllFilters, state => {
    state.filters[INVENTORY_FILTER.CATEGORY] = null;
  }),

  immerOn(filterActions.clearFilterByName, (state, { name }) => {
    state.filters[name] = null;
  }),

  // List items async write ---------------------------------------------------

  immerOn(
    itemsAsyncWriteActions.editSuccess,
    itemsAsyncWriteActions.removeSuccess,
    (state, { items, message }) => {
      setSuccessState(state, message);
      state.items = items;
    },
  ),

    // List item async write ----------------------------------------------------

    immerOn(itemAsyncWriteActions.createSuccess, (state, { item, message }) => {
      setSuccessState(state, message);
      state.itemModalSuccessCounter += 1;
      state.items.unshift(item);
    }),

    immerOn(itemAsyncWriteActions.editSuccess, (state, { item, message }) => {
      setSuccessState(state, message);
      state.itemModalSuccessCounter += 1;
      state.items = replaceOn(state.items, it => it.id === item.id, () => item);
    }),

    immerOn(itemAsyncWriteActions.removeSuccess, (state, { item, message }) => {
      setSuccessState(state, message);
      state.items = state.items.filter(anItem => anItem.id !== item.id);
    }),
);
