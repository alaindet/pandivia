import { createReducer } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';

import { LOADING_STATUS } from '@app/common/types';
import * as fromActions from './actions';
import { LIST_FEATURE_INITIAL_STATE } from './state';
import { LIST_FILTER } from '../types';
import { getItemIndex, updateItemsByCategory } from './helpers';
import { ListItem } from '@app/core';
import { getRandomHash } from '@app/common/utils';

export const listReducer = createReducer(LIST_FEATURE_INITIAL_STATE,

  // Fetching -----------------------------------------------------------------

  immerOn(
    fromActions.listFetchItemsActions.fetchItems,
    fromActions.listFetchItemsActions.forceFetchItems,
    state => {
      state.status = LOADING_STATUS.LOADING;
    },
  ),

  immerOn(fromActions.listFetchItemsActions.fetchItemsCached, state => {
    state.status = LOADING_STATUS.IDLE;
  }),

  immerOn(fromActions.listFetchItemsActions.fetchItemsSuccess, (state, { items }) => {
    state.status = LOADING_STATUS.IDLE;
    state.lastUpdated = Date.now();
    state.items = items;
  }),

  immerOn(fromActions.listFetchItemsActions.fetchItemsError, state => {
    state.status = LOADING_STATUS.ERROR;
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

  // List actions -------------------------------------------------------------

  immerOn(fromActions.listAllItemsActions.complete, state => {
    state.items.forEach(item => item.isDone = true);
  }),

  immerOn(fromActions.listAllItemsActions.undo, state => {
    state.items.forEach(item => item.isDone = false);
  }),

  immerOn(fromActions.listAllItemsActions.removeCompleted, state => {
    state.items = state.items.filter(item => !item.isDone);
  }),

  immerOn(fromActions.listAllItemsActions.remove, state => {
    state.items = [];
  }),

  // List category actions ----------------------------------------------------

  immerOn(fromActions.listCategoryActions.complete, (state, { category }) => {
    updateItemsByCategory(state, category, item => item.isDone = true);
  }),
  
  immerOn(fromActions.listCategoryActions.undo, (state, { category }) => {
    updateItemsByCategory(state, category, item => item.isDone = false);
  }),

  immerOn(fromActions.listCategoryActions.removeCompleted, (state, { category }) => {
    state.items = state.items.filter(item => {
      return (!(item.category === category && item.isDone));
    });
  }),

  immerOn(fromActions.listCategoryActions.remove, (state, { category }) => {
    state.items = state.items.filter(item => {
      return item.category !== category;
    });
  }),

  // List item actions --------------------------------------------------------

  immerOn(fromActions.listItemActions.create, (state, { dto }) => {
    const id = getRandomHash(5); // TODO: Mock
    const item = { ...dto, id } as ListItem;
    state.items.unshift(item);
  }),

  immerOn(fromActions.listItemActions.edit, (state, { item }) => {
    const index = getItemIndex(state, item.id);
    if (index !== null) state.items[index] = item;
  }),

  immerOn(fromActions.listItemActions.complete, (state, { itemId }) => {
    const index = getItemIndex(state, itemId);
    if (index !== null) state.items[index].isDone = true;
  }),

  immerOn(fromActions.listItemActions.undo, (state, { itemId }) => {
    const index = getItemIndex(state, itemId);
    if (index !== null) state.items[index].isDone = false;
  }),

  immerOn(fromActions.listItemActions.toggle, (state, { itemId }) => {
    const index = getItemIndex(state, itemId);
    if (index !== null) state.items[index].isDone = !state.items[index].isDone;
  }),

  immerOn(fromActions.listItemActions.increment, (state, { itemId }) => {
    const index = getItemIndex(state, itemId);
    if (index !== null) state.items[index].amount += 1;
  }),

  immerOn(fromActions.listItemActions.decrement, (state, { itemId }) => {
    const index = getItemIndex(state, itemId);
    if (index !== null) state.items[index].amount -= 1;
  }),

  immerOn(fromActions.listItemActions.remove, (state, { itemId }) => {
    const index = getItemIndex(state, itemId);
    if (index !== null) state.items = state.items.filter(it => it.id !== itemId);
  }),
);