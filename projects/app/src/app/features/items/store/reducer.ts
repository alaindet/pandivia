import { createReducer } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';

import { LOADING_STATUS } from '@app/common/types';
import { createItemActions, deleteItemActions, updateItemActions } from './actions';
import { LIST_ITEMS_FEATURE_INITIAL_STATE } from './state';

export const listItemsReducer = createReducer(LIST_ITEMS_FEATURE_INITIAL_STATE,

  immerOn(
    createItemActions.tryToCreate,
    updateItemActions.tryToUpdate,
    deleteItemActions.tryToDelete,
    (state, { request }) => state[request.listId].status = LOADING_STATUS.LOADING,
  ),

  immerOn(
    createItemActions.failedToCreate,
    updateItemActions.failedToUpdate,
    deleteItemActions.failedToDelete,
    (state, { request }) => state[request.listId].status = LOADING_STATUS.ERROR,
  ),

  immerOn(createItemActions.successfullyCreated, (state, { item }) => {
    const items = [...state[item.listId].items, item];
    const list = { ...state[item.listId], items };
    return { ...state, [item.listId]: list };
  }),

  immerOn(updateItemActions.successfullyUpdated, (state, { item }) => {
    const items = state[item.listId].items.map(it => it.id === item.id ? item : it);
    const list = { ...state[item.listId], items };
    return { ...state, [item.listId]: list };
  }),

  immerOn(createItemActions.successfullyCreated, (state, { item }) => {
    const items = state[item.listId].items.filter(it => it.id !== item.id);
    const list = { ...state[item.listId], items };
    return { ...state, [item.listId]: list };
  }),
);
