import { createReducer } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';

import { LOADING_STATUS } from '@app/common/types';
import { LIST_FILTER, ListItem } from '../types';
import { LIST_FEATURE_INITIAL_STATE } from './state';
import { updateItem } from './helpers';
import { listCompleteItem, listCompleteItems, listCompleteItemsByCategory, listCreateItem, listDecrementItem, listEditItem, listFeatureReset, listFetchItems, listFilters, listIncrementItem, listRemoveCompletedItems, listRemoveCompletedItemsByCategory, listRemoveItem, listRemoveItems, listRemoveItemsByCategory, listToggleItem, listUndoItem, listUndoItems, listUndoItemsByCategory } from './actions';

export const listReducer = createReducer(LIST_FEATURE_INITIAL_STATE,

  immerOn(listFeatureReset, state => {
    state.items = LIST_FEATURE_INITIAL_STATE.items;
    state.status = LIST_FEATURE_INITIAL_STATE.status;
    state.lastUpdated = LIST_FEATURE_INITIAL_STATE.lastUpdated;
    state.itemModalSuccessCounter = LIST_FEATURE_INITIAL_STATE.itemModalSuccessCounter;
    state.filters = { ...LIST_FEATURE_INITIAL_STATE.filters };
  }),

  immerOn(
    listFetchItems.try,
    listFetchItems.force,
    listCompleteItems.try,
    listUndoItems.try,
    listRemoveItems.try,
    listRemoveCompletedItems.try,
    listCompleteItemsByCategory.try,
    listUndoItemsByCategory.try,
    listRemoveCompletedItemsByCategory.try,
    listRemoveItemsByCategory.try,
    listCreateItem.try,
    listEditItem.try,
    listCompleteItem.try,
    listUndoItem.try,
    listToggleItem.try,
    listIncrementItem.try,
    listDecrementItem.try,
    listRemoveItem.try,
    state => {
      state.status = LOADING_STATUS.LOADING;
    },
  ),

  immerOn(
    listFetchItems.err,
    listCompleteItems.err,
    listUndoItems.err,
    listRemoveItems.err,
    listRemoveCompletedItems.err,
    listCompleteItemsByCategory.err,
    listUndoItemsByCategory.err,
    listRemoveCompletedItemsByCategory.err,
    listRemoveItemsByCategory.err,
    listCreateItem.err,
    listEditItem.err,
    listCompleteItem.err,
    listUndoItem.err,
    listToggleItem.err,
    listIncrementItem.err,
    listDecrementItem.err,
    listRemoveItem.err,
    state => {
      state.status = LOADING_STATUS.ERROR;
    },
  ),

  // All items ----------------------------------------------------------------

  immerOn(listFetchItems.ok, (state, { items }) => {
    state.status = LOADING_STATUS.IDLE;
    state.lastUpdated = Date.now();
    state.items = items;
  }),

  immerOn(listFetchItems.cached, state => {
    state.status = LOADING_STATUS.IDLE;
  }),

  immerOn(listCompleteItems.ok, state => {
    state.status = LOADING_STATUS.IDLE;
    state.items = state.items.map(item => ({ ...item, isDone: true }));
  }),

  immerOn(listUndoItems.ok, state => {
    state.status = LOADING_STATUS.IDLE;
    state.items = state.items.map(item => ({ ...item, isDone: false }));
  }),

  immerOn(listRemoveItems.ok, state => {
    state.status = LOADING_STATUS.IDLE;
    state.lastUpdated = Date.now();
    state.items = [];
  }),

  immerOn(listRemoveCompletedItems.ok, state => {
    state.status = LOADING_STATUS.IDLE;
    state.items = state.items.filter(item => !item.isDone);
  }),

  // Category items -----------------------------------------------------------

  immerOn(listCompleteItemsByCategory.ok, (state, { category }) => {
    state.status = LOADING_STATUS.IDLE;
    state.items = state.items.map(item => {
      if (item.category !== category) return item;
      return { ...item, isDone: true };
    });
  }),

  immerOn(listUndoItemsByCategory.ok, (state, { category }) => {
    state.status = LOADING_STATUS.IDLE;
    state.items = state.items.map(item => {
      if (item.category !== category) return item;
      return { ...item, isDone: false };
    });
  }),

  immerOn(listRemoveCompletedItemsByCategory.ok, (state, { category }) => {
    state.status = LOADING_STATUS.IDLE;
    state.items = state.items.filter(item => {
      if (item.category !== category) return true;
      return !item.isDone;
    });
  }),

  immerOn(listRemoveItemsByCategory.ok, (state, { category }) => {
    state.status = LOADING_STATUS.IDLE;
    state.items = state.items.filter(item => {
      if (item.category !== category) return true;
      return false;
    });
  }),

  // Item ---------------------------------------------------------------------

  immerOn(listCreateItem.ok, (state, { item }) => {
    state.status = LOADING_STATUS.IDLE;
    state.itemModalSuccessCounter += 1;
    state.items.push(item);
  }),

  immerOn(listEditItem.ok, (state, { item }) => {
    state.status = LOADING_STATUS.IDLE;
    state.itemModalSuccessCounter += 1;
    state.items = updateItem(state.items, item.id, () => item);
  }),

  immerOn(listCompleteItem.ok, (state, { itemId }) => {
    state.status = LOADING_STATUS.IDLE;
    const updater = () => ({ isDone: true });
    state.items = updateItem(state.items, itemId, updater);
  }),

  immerOn(listUndoItem.ok, (state, { itemId }) => {
    state.status = LOADING_STATUS.IDLE;
    const updater = () => ({ isDone: false });
    state.items = updateItem(state.items, itemId, updater);
  }),

  immerOn(listToggleItem.ok, (state, { itemId }) => {
    state.status = LOADING_STATUS.IDLE;
    const updater = (old: ListItem) => ({ isDone: !old.isDone });
    state.items = updateItem(state.items, itemId, updater);
  }),

  immerOn(listIncrementItem.ok, (state, { itemId }) => {
    state.status = LOADING_STATUS.IDLE;
    const updater = (old: ListItem) => ({ amount: old.amount + 1 });
    state.items = updateItem(state.items, itemId, updater);
  }),

  immerOn(listDecrementItem.ok, (state, { itemId }) => {
    state.status = LOADING_STATUS.IDLE;
    const updater = (old: ListItem) => ({ amount: old.amount - 1 });
    state.items = updateItem(state.items, itemId, updater);
  }),

  immerOn(listRemoveItem.ok, (state, { itemId }) => {
    state.status = LOADING_STATUS.IDLE;
    state.itemModalSuccessCounter += 1;
    state.items = state.items.filter(item => item.id !== itemId);
  }),

  // Filters ------------------------------------------------------------------

  immerOn(listFilters.setCategory, (state, { category }) => {
    state.filters[LIST_FILTER.CATEGORY] = category;
  }),

  immerOn(listFilters.clearCategory, state => {
    state.filters[LIST_FILTER.CATEGORY] = null;
  }),

  immerOn(listFilters.setCompleted, (state, { isDone }) => {
    state.filters[LIST_FILTER.IS_DONE] = isDone;
  }),

  immerOn(listFilters.clearCompleted, state => {
    state.filters[LIST_FILTER.CATEGORY] = null;
  }),

  immerOn(listFilters.clearAll, state => {
    state.filters[LIST_FILTER.CATEGORY] = null;
    state.filters[LIST_FILTER.IS_DONE] = null;
  }),

  immerOn(listFilters.clearByName, (state, { name }) => {
    state.filters[name] = null;
  }),
);
