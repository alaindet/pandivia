import { createReducer } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';

import { NOTIFICATION_TYPE } from '@app/common/types';
import { UI_FEATURE_INITIAL_STATE } from './state';
import { notificationsActions } from './actions';

export const uiReducer = createReducer(
  UI_FEATURE_INITIAL_STATE,

  immerOn(notificationsActions.addSuccess, (state, { message }) => {
    const id = Date.now() + Math.random();
    state.notifications.push({ id, type: NOTIFICATION_TYPE.SUCCESS, message });
  }),

  immerOn(notificationsActions.addError, (state, { message }) => {
    const id = Date.now() + Math.random();
    state.notifications.push({ id, type: NOTIFICATION_TYPE.ERROR, message });
  }),

  immerOn(notificationsActions.dismiss, (state) => {
    state.notifications.pop();
  }),
);
