import { createReducer } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';

import * as fromActions from './actions';
import { LIST_FEATURE_INITIAL_STATE } from './state';
import { LOADING_STATUS } from '@app/common/types';
import { LIST_FILTER } from '../types';

export const listReducer = createReducer(LIST_FEATURE_INITIAL_STATE,

  immerOn(
    fromActions.fetchListItemsActions.fetchItems,
    fromActions.fetchListItemsActions.forceFetchItems,
    state => {
      state.status = LOADING_STATUS.LOADING;
    },
  ),

  immerOn(fromActions.fetchListItemsActions.fetchItemsCached, state => {
    state.status = LOADING_STATUS.IDLE;
  }),

  immerOn(fromActions.fetchListItemsActions.fetchItemsSuccess, (state, { items }) => {
    state.status = LOADING_STATUS.IDLE;
    state.items = items;
  }),

  immerOn(fromActions.fetchListItemsActions.fetchItemsError, state => {
    state.status = LOADING_STATUS.ERROR;
  }),

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

  immerOn(fromActions.listItemActions.undoItem, (state, { itemId }) => {
    const index = state.items.findIndex(item => item.id === itemId);
    if (index === -1) return;
    state.items[index].isDone = false;
  }),

  immerOn(fromActions.listItemActions.completeItem, (state, { itemId }) => {
    const index = state.items.findIndex(item => item.id === itemId);
    if (index === -1) return;
    state.items[index].isDone = true;
  }),

  immerOn(fromActions.listItemActions.toggleItem, (state, { itemId }) => {
    const index = state.items.findIndex(item => item.id === itemId);
    if (index === -1) return;
    state.items[index].isDone = !state.items[index].isDone;
  }),

  immerOn(fromActions.listItemActions.incrementItemAmount, (state, { itemId }) => {
    const index = state.items.findIndex(item => item.id === itemId);
    if (index === -1) return;
    state.items[index].amount += 1;
  }),

  immerOn(fromActions.listItemActions.decrementItemAmount, (state, { itemId }) => {
    const index = state.items.findIndex(item => item.id === itemId);
    if (index === -1) return;
    state.items[index].amount -= 1;

    // Automatic delete?
    // if (state.items[index].amount === 1) {
    //   state.items = state.items.filter(item => item.id !== itemId);
    // } else {
    //   state.items[index].amount -= 1;
    // }
  }),
);
