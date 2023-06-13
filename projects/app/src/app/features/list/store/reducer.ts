import { createReducer } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';

import { LOADING_STATUS } from '@app/common/types';
import { LIST_FILTER } from '../types';
import {
  listItemsAsyncReadActions,
  listAllItemsActions,
  listCategoryActions,
  listItemActions,
  listItemsAsyncWriteActions,
  listItemAsyncWriteActions,
  listFilterActions,
} from './actions';
import { LIST_FEATURE_INITIAL_STATE } from './state';

export const listReducer = createReducer(LIST_FEATURE_INITIAL_STATE,

  // Generic async ------------------------------------------------------------

  immerOn(
    listItemsAsyncReadActions.fetchItems,
    listItemsAsyncReadActions.forceFetchItems,

    listAllItemsActions.complete,
    listAllItemsActions.undo,
    listAllItemsActions.removeCompleted,
    listAllItemsActions.remove,

    listCategoryActions.complete,
    listCategoryActions.undo,
    listCategoryActions.removeCompleted,
    listCategoryActions.remove,

    listItemActions.complete,
    listItemActions.create,
    listItemActions.decrement,
    listItemActions.edit,
    listItemActions.increment,
    listItemActions.remove,
    listItemActions.toggle,
    listItemActions.undo,
    state => {
      state.status = LOADING_STATUS.LOADING;
    },
  ),

  immerOn(
    listItemsAsyncReadActions.fetchItemsError,

    listItemsAsyncWriteActions.editError,
    listItemsAsyncWriteActions.removeError,

    listItemAsyncWriteActions.createError,
    listItemAsyncWriteActions.editError,
    listItemAsyncWriteActions.removeError,
    (state, { message }) => {
      console.log(message); // TODO: Remove?
      state.status = LOADING_STATUS.ERROR;
    },
  ),

  // Fetching -----------------------------------------------------------------

  immerOn(listItemsAsyncReadActions.fetchItemsCached, state => {
    state.status = LOADING_STATUS.IDLE;
  }),

  immerOn(listItemsAsyncReadActions.fetchItemsSuccess, (state, { items }) => {
    state.status = LOADING_STATUS.IDLE;
    state.lastUpdated = Date.now();
    state.items = items;
  }),

  // Filters ------------------------------------------------------------------

  immerOn(listFilterActions.setCategoryFilter, (state, { category }) => {
    state.filters[LIST_FILTER.CATEGORY] = category;
  }),

  immerOn(listFilterActions.clearCategoryFilter, state => {
    state.filters[LIST_FILTER.CATEGORY] = null;
  }),

  immerOn(listFilterActions.setDoneFilter, (state, { isDone }) => {
    state.filters[LIST_FILTER.IS_DONE] = isDone;
  }),

  immerOn(listFilterActions.clearDoneFilter, state => {
    state.filters[LIST_FILTER.CATEGORY] = null;
  }),

  immerOn(listFilterActions.clearAllFilters, state => {
    state.filters[LIST_FILTER.CATEGORY] = null;
    state.filters[LIST_FILTER.IS_DONE] = null;
  }),

  immerOn(listFilterActions.clearFilterByName, (state, { name }) => {
    state.filters[name] = null;
  }),

  // List items async write ---------------------------------------------------

  immerOn(listItemsAsyncWriteActions.editSuccess, (state, action) => {
    const { message, items } = action;
    console.log(message); // TODO: Remove?
    state.status = LOADING_STATUS.IDLE;
    state.lastUpdated = Date.now();
    state.items = items;
  }),

  immerOn(listItemsAsyncWriteActions.removeSuccess, (state, action) => {
    const { message, items } = action;
    console.log(message); // TODO: Remove?
    state.status = LOADING_STATUS.IDLE;
    state.lastUpdated = Date.now();
    state.items = items;
  }),

  // List item async write ----------------------------------------------------

  immerOn(listItemAsyncWriteActions.createSuccess, (state, action) => {
    const { message, item } = action;
    console.log(message); // TODO: Remove?
    state.status = LOADING_STATUS.IDLE;
    state.itemModalSuccessCounter += 1;
    state.items.unshift(item);
  }),

  immerOn(listItemAsyncWriteActions.editSuccess, (state, action) => {
    const { message, item } = action;
    console.log(message); // TODO: Remove?
    state.status = LOADING_STATUS.IDLE;
    state.itemModalSuccessCounter += 1;
    state.items = state.items.map(anItem => anItem.id === item.id ? item : anItem);
  }),

  immerOn(listItemAsyncWriteActions.removeSuccess, (state, action) => {
    const { message, item } = action;
    console.log(message); // TODO: Remove?
    state.status = LOADING_STATUS.IDLE;
    state.items = state.items.filter(anItem => anItem.id !== item.id);
  }),
);
