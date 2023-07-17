import { createReducer } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';

import { NOTIFICATION_TYPE } from '@app/common/types';
import { UI_FEATURE_INITIAL_STATE } from './state';
import {
  uiNotificationAddSuccess,
  uiNotificationAddError,
  uiNotificationDismiss,
  uiLoaderStart,
  uiLoaderStop,
  uiSetCurrentNavigation,
  uiSetPageTitle,
  uiSetTheme,
} from './actions';

export const uiReducer = createReducer(
  UI_FEATURE_INITIAL_STATE,

  immerOn(uiNotificationAddSuccess, (state, { message }) => {
    const id = Date.now() + Math.random();
    state.notifications.push({ id, type: NOTIFICATION_TYPE.SUCCESS, message });
  }),

  immerOn(uiNotificationAddError, (state, { message }) => {
    const id = Date.now() + Math.random();
    state.notifications.push({ id, type: NOTIFICATION_TYPE.ERROR, message });
  }),

  immerOn(uiNotificationDismiss, state => {
    state.notifications.pop();
  }),

  immerOn(uiLoaderStart, state => {
    state.loading = true;
  }),

  immerOn(uiLoaderStop, state => {
    state.loading = false;
  }),

  immerOn(uiSetCurrentNavigation, (state, { current }) => {
    state.navigation.current = current;
  }),

  immerOn(uiSetPageTitle, (state, { title }) => {
    state.title = title;
  }),

  immerOn(uiSetTheme, (state, { theme }) => {
    state.theme = theme;
  }),
);
