import { createReducer } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';

import { LOADING_STATUS } from '@app/common/types';
import { LISTS_FEATURE_INITIAL_STATE } from './state';
import { createListActions, updateListActions, deleteListActions } from './actions';

export const listsReducer = createReducer(LISTS_FEATURE_INITIAL_STATE,

  immerOn(
    createListActions.tryToCreate,
    updateListActions.tryToUpdate,
    deleteListActions.tryToDelete,
    state => state.status = LOADING_STATUS.LOADING,
  ),

  immerOn(
    createListActions.failedToCreate,
    updateListActions.failedToUpdate,
    deleteListActions.failedToDelete,
    state => state.status = LOADING_STATUS.ERROR,
  ),

  immerOn(createListActions.successfullyCreated, (state, { list }) => {
    state.lists.push(list);
    state.status = LOADING_STATUS.IDLE;
  }),

  immerOn(updateListActions.successfullyUpdated, (state, { list }) => {
    const index = state.lists.findIndex(l => l.id === list.id);
    state.lists[index] = list;
    state.status = LOADING_STATUS.IDLE;
  }),

  immerOn(deleteListActions.successfullyDeleted, (state, { list }) => {
    const index = state.lists.findIndex(l => l.id === list.id);
    delete state.lists[index];
    state.status = LOADING_STATUS.IDLE;
  }),
);
