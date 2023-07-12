import { createReducer } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';

import { LOADING_STATUS } from '@app/common/types';
import { LIST_FILTER } from '../types';
import { LIST_FEATURE_INITIAL_STATE } from './state';
import { setSuccessState } from './helpers';
import { listChangeItemAmount, listCompleteItem, listCompleteItems, listCompleteItemsByCategory, listCreateItem, listEditItem, listFetchItems, listRemoveCompletedItems, listRemoveCompletedItemsByCategory, listRemoveItem, listRemoveItems, listRemoveItemsByCategory, listToggleItem } from './actions';

// export type ListFeatureState = {
//   items: ListItem[];
//   status: LoadingStatus;
//   lastUpdated: UnixTimestamp | null;
//   itemModalSuccessCounter: number;
//   filters: ListFilters;
// };
export const listReducer = createReducer(LIST_FEATURE_INITIAL_STATE,

  immerOn(
    listFetchItems.try,
    listFetchItems.force,
    listCompleteItems.try,
    listRemoveItems.try,
    listRemoveCompletedItems.try,
    listCompleteItemsByCategory.try,
    listRemoveCompletedItemsByCategory.try,
    listRemoveItemsByCategory.try,
    listCreateItem.try,
    listEditItem.try,
    listCompleteItem.try,
    listToggleItem.try,
    listChangeItemAmount.try,
    listRemoveItem.try,
    state => {
      state.status = LOADING_STATUS.LOADING;
    },
  ),

  immerOn(
    listFetchItems.err,
    listCompleteItems.err,
    listRemoveItems.err,
    listRemoveCompletedItems.err,
    listCompleteItemsByCategory.err,
    listRemoveCompletedItemsByCategory.err,
    listRemoveItemsByCategory.err,
    listCreateItem.err,
    listEditItem.err,
    listCompleteItem.err,
    listToggleItem.err,
    listChangeItemAmount.err,
    listRemoveItem.err,
    state => {
      state.status = LOADING_STATUS.ERROR;
    },
  ),


  // Generic async ------------------------------------------------------------

  // immerOn(
  //   itemsAsyncReadActions.fetchItems,
  //   itemsAsyncReadActions.forceFetchItems,

  //   allItemsActions.complete,
  //   allItemsActions.undo,
  //   allItemsActions.removeCompleted,
  //   allItemsActions.remove,

  //   categoryActions.complete,
  //   categoryActions.undo,
  //   categoryActions.removeCompleted,
  //   categoryActions.remove,

  //   itemActions.complete,
  //   itemActions.create,
  //   itemActions.decrement,
  //   itemActions.edit,
  //   itemActions.increment,
  //   itemActions.remove,
  //   itemActions.toggle,
  //   itemActions.undo,
  //   state => {
  //     state.status = LOADING_STATUS.LOADING;
  //   },
  // ),

  // immerOn(
  //   itemsAsyncReadActions.fetchItemsError,

  //   itemsAsyncWriteActions.editError,
  //   itemsAsyncWriteActions.removeError,

  //   itemAsyncWriteActions.createError,
  //   itemAsyncWriteActions.editError,
  //   itemAsyncWriteActions.removeError,
  //   state => {
  //     state.status = LOADING_STATUS.ERROR;
  //   },
  // ),

  // // Fetching -----------------------------------------------------------------

  // immerOn(itemsAsyncReadActions.fetchItemsCached, state => {
  //   state.status = LOADING_STATUS.IDLE;
  // }),

  // immerOn(itemsAsyncReadActions.fetchItemsSuccess, (state, { items }) => {
  //   setSuccessState(state);
  //   state.items = items;
  // }),

  // // Filters ------------------------------------------------------------------

  // immerOn(filterActions.setCategoryFilter, (state, { category }) => {
  //   state.filters[LIST_FILTER.CATEGORY] = category;
  // }),

  // immerOn(filterActions.clearCategoryFilter, state => {
  //   state.filters[LIST_FILTER.CATEGORY] = null;
  // }),

  // immerOn(filterActions.setDoneFilter, (state, { isDone }) => {
  //   state.filters[LIST_FILTER.IS_DONE] = isDone;
  // }),

  // immerOn(filterActions.clearDoneFilter, state => {
  //   state.filters[LIST_FILTER.CATEGORY] = null;
  // }),

  // immerOn(filterActions.clearAllFilters, state => {
  //   state.filters[LIST_FILTER.CATEGORY] = null;
  //   state.filters[LIST_FILTER.IS_DONE] = null;
  // }),

  // immerOn(filterActions.clearFilterByName, (state, { name }) => {
  //   state.filters[name] = null;
  // }),

  // // List items async write ---------------------------------------------------

  // immerOn(
  //   itemsAsyncWriteActions.editSuccess,
  //   itemsAsyncWriteActions.removeSuccess,
  //   (state, { items }) => {
  //     setSuccessState(state);
  //     state.items = items;
  //   },
  // ),

  // // List item async write ----------------------------------------------------

  // immerOn(itemAsyncWriteActions.createSuccess, (state, { item }) => {
  //   setSuccessState(state);
  //   state.itemModalSuccessCounter += 1;
  //   state.items.unshift(item);
  // }),

  // immerOn(itemAsyncWriteActions.editSuccess, (state, { item }) => {
  //   setSuccessState(state);
  //   state.itemModalSuccessCounter += 1;
  //   state.items = state.items.map(anItem => anItem.id === item.id ? item : anItem);
  // }),

  // immerOn(itemAsyncWriteActions.removeSuccess, (state, { item }) => {
  //   setSuccessState(state);
  //   state.items = state.items.filter(anItem => anItem.id !== item.id);
  // }),
);
