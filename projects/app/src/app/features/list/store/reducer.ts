import { createReducer } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';

import { LOADING_STATUS } from '@app/common/types';
import { LIST_FILTER } from '../types';
import * as fromActions from './actions';
import { LIST_FEATURE_INITIAL_STATE } from './state';

export const listReducer = createReducer(LIST_FEATURE_INITIAL_STATE,

  // Generic async ------------------------------------------------------------

  immerOn(
    fromActions.listItemsAsyncReadActions.fetchItems,
    fromActions.listItemsAsyncReadActions.forceFetchItems,
    fromActions.listAllItemsActions.complete,
    fromActions.listAllItemsActions.undo,
    fromActions.listCategoryActions.complete,
    fromActions.listCategoryActions.undo,
    fromActions.listAllItemsActions.removeCompleted,
    fromActions.listAllItemsActions.remove,
    fromActions.listCategoryActions.removeCompleted,
    fromActions.listCategoryActions.remove,
    state => {
      state.status = LOADING_STATUS.LOADING;
    },
  ),

  immerOn(
    fromActions.listItemsAsyncReadActions.fetchItemsError,
    fromActions.listItemsAsyncWriteActions.editError,
    fromActions.listItemsAsyncWriteActions.removeError,
    fromActions.listItemAsyncWriteActions.createError,
    fromActions.listItemAsyncWriteActions.editError,
    fromActions.listItemAsyncWriteActions.removeError,
    (state, { message }) => {
      console.log(message); // TODO: Remove?
      state.status = LOADING_STATUS.ERROR;
    },
  ),

  // Fetching -----------------------------------------------------------------

  immerOn(fromActions.listItemsAsyncReadActions.fetchItemsCached, state => {
    state.status = LOADING_STATUS.IDLE;
  }),

  immerOn(fromActions.listItemsAsyncReadActions.fetchItemsSuccess, (state, { items }) => {
    state.status = LOADING_STATUS.IDLE;
    state.lastUpdated = Date.now();
    state.items = items;
  }),

  // Filters ------------------------------------------------------------------

  immerOn(fromActions.listFilterActions.setCategoryFilter, (state, { category }) => {
    state.filters[LIST_FILTER.CATEGORY] = category;
  }),

  immerOn(fromActions.listFilterActions.clearCategoryFilter, state => {
    state.filters[LIST_FILTER.CATEGORY] = null;
  }),

  immerOn(fromActions.listFilterActions.setDoneFilter, (state, { isDone }) => {
    state.filters[LIST_FILTER.IS_DONE] = isDone;
  }),

  immerOn(fromActions.listFilterActions.clearDoneFilter, state => {
    state.filters[LIST_FILTER.CATEGORY] = null;
  }),

  immerOn(fromActions.listFilterActions.clearAllFilters, state => {
    state.filters[LIST_FILTER.CATEGORY] = null;
    state.filters[LIST_FILTER.IS_DONE] = null;
  }),

  immerOn(fromActions.listFilterActions.clearFilterByName, (state, { name }) => {
    state.filters[name] = null;
  }),

  // List items async write ---------------------------------------------------

  immerOn(fromActions.listItemsAsyncWriteActions.editSuccess, (state, action) => {
    const { message, items } = action;
    console.log(message); // TODO: Remove?
    state.status = LOADING_STATUS.IDLE;
    state.lastUpdated = Date.now();
    state.items = items;
  }),

  immerOn(fromActions.listItemsAsyncWriteActions.removeSuccess, (state, action) => {
    const { message, items } = action;
    console.log(message); // TODO: Remove?
    state.status = LOADING_STATUS.IDLE;
    state.lastUpdated = Date.now();
    state.items = items;
  }),

  // List item async write ----------------------------------------------------

  immerOn(fromActions.listItemAsyncWriteActions.createSuccess, (state, action) => {
    const { message, item } = action;
    console.log(message); // TODO: Remove?
    state.status = LOADING_STATUS.IDLE;
    state.items = state.items.map(anItem => anItem.id === item.id ? item : anItem);
  }),

  immerOn(fromActions.listItemAsyncWriteActions.editSuccess, (state, action) => {
    const { message, item } = action;
    console.log(message); // TODO: Remove?
    state.status = LOADING_STATUS.IDLE;
    state.items = state.items.map(anItem => anItem.id === item.id ? item : anItem);
  }),

  immerOn(fromActions.listItemAsyncWriteActions.removeSuccess, (state, action) => {
    const { message, item } = action;
    console.log(message); // TODO: Remove?
    state.status = LOADING_STATUS.IDLE;
    state.items = state.items.filter(anItem => anItem.id !== item.id);
  }),
);