import { createReducer } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';

import { LOADING_STATUS } from '@app/common/types';
import { replaceOn } from '@app/common/utils';
import { INVENTORY_FILTER } from '../types';
import { INVENTORY_FEATURE_INITIAL_STATE } from './state';
import { inventoryFetchItems, inventoryRemoveItems, inventoryRemoveItemsByCategory, inventoryCreateItem, inventoryEditItem, inventoryRemoveItem, inventoryFilters, inventoryFeatureReset } from './actions';

export const inventoryReducer = createReducer(INVENTORY_FEATURE_INITIAL_STATE,

  immerOn(inventoryFeatureReset, state => {
    state.items = INVENTORY_FEATURE_INITIAL_STATE.items;
    state.status = INVENTORY_FEATURE_INITIAL_STATE.status;
    state.lastUpdated = INVENTORY_FEATURE_INITIAL_STATE.lastUpdated;
    state.itemModalSuccessCounter = INVENTORY_FEATURE_INITIAL_STATE.itemModalSuccessCounter;
    state.filters = { ...INVENTORY_FEATURE_INITIAL_STATE.filters };
  }),

  immerOn(
    inventoryFetchItems.try,
    inventoryFetchItems.force,
    inventoryRemoveItems.try,
    inventoryRemoveItemsByCategory.try,
    inventoryCreateItem.try,
    inventoryEditItem.try,
    inventoryRemoveItem.try,
    state => {
      state.status = LOADING_STATUS.LOADING;
    },
  ),

  immerOn(
    inventoryFetchItems.err,
    inventoryRemoveItems.err,
    inventoryRemoveItemsByCategory.err,
    inventoryCreateItem.err,
    inventoryEditItem.err,
    inventoryRemoveItem.err,
    state => {
      state.status = LOADING_STATUS.ERROR;
    },
  ),

  immerOn(inventoryFetchItems.cached, state => {
    state.status = LOADING_STATUS.IDLE;
  }),

  immerOn(inventoryFetchItems.ok, (state, { items }) => {
    state.status = LOADING_STATUS.IDLE;
    state.lastUpdated = Date.now();
    state.items = items;
  }),

  immerOn(inventoryFilters.setCategory, (state, { category }) => {
    state.filters[INVENTORY_FILTER.CATEGORY] = category;
  }),

  immerOn(inventoryFilters.clearCategory, state => {
    state.filters[INVENTORY_FILTER.CATEGORY] = null;
  }),

  immerOn(inventoryFilters.setSearchQuery, (state, { searchQuery }) => {
    state.filters[INVENTORY_FILTER.SEARCH_QUERY] = searchQuery;
  }),

  immerOn(inventoryFilters.clearSearchQuery, state => {
    state.filters[INVENTORY_FILTER.SEARCH_QUERY] = null;
  }),

  immerOn(inventoryFilters.clearAll, state => {
    state.filters[INVENTORY_FILTER.CATEGORY] = null;
  }),

  immerOn(inventoryFilters.clearByName, (state, { name }) => {
    state.filters[name] = null;
  }),

  immerOn(inventoryRemoveItems.ok, state => {
    state.status = LOADING_STATUS.IDLE;
    state.lastUpdated = Date.now();
    state.items = [];
  }),

  immerOn(inventoryRemoveItemsByCategory.ok, (state, { category }) => {
    state.status = LOADING_STATUS.IDLE;
    state.lastUpdated = Date.now();
    state.items = state.items.filter(item => item.category !== category);
  }),

  immerOn(inventoryCreateItem.ok, (state, { item }) => {
    state.status = LOADING_STATUS.IDLE;
    state.itemModalSuccessCounter += 1;
    state.items.push(item);
  }),

  immerOn(inventoryEditItem.ok, (state, { item }) => {
    state.status = LOADING_STATUS.IDLE;
    state.itemModalSuccessCounter += 1;
    state.items = replaceOn(state.items, anItem => anItem.id === item.id, item);
  }),

  immerOn(inventoryRemoveItem.ok, (state, { itemId }) => {
    state.status = LOADING_STATUS.IDLE;
    state.items = state.items.filter(item => item.id !== itemId);
  }),
);
