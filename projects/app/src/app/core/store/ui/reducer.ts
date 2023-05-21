import { createReducer } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';

import { NOTIFICATION_TYPE } from '@app/common/types';
import { UI_FEATURE_INITIAL_STATE } from './state';
import * as fromActions from './actions';

export const uiReducer = createReducer(
  UI_FEATURE_INITIAL_STATE,

  immerOn(fromActions.notificationsActions.addSuccess, (state, { message }) => {
    const id = Date.now() + Math.random();
    state.notifications.push({ id, type: NOTIFICATION_TYPE.SUCCESS, message });
  }),

  immerOn(fromActions.notificationsActions.addError, (state, { message }) => {
    const id = Date.now() + Math.random();
    state.notifications.push({ id, type: NOTIFICATION_TYPE.ERROR, message });
  }),

  immerOn(fromActions.notificationsActions.dismiss, state => {
    state.notifications.pop();
  }),

  immerOn(fromActions.notificationsActions.dismiss, state => {
    state.notifications.pop();
  }),

  immerOn(fromActions.loaderActions.start, state => {
    state.loading = true;
  }),

  immerOn(fromActions.loaderActions.stop, state => {
    state.loading = false;
  }),
);
