import { createReducer } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';

import { NOTIFICATION_TYPE } from '@app/common/types';
import { DEFAULT_THEME } from '@app/core/theme';
import { UI_FEATURE_INITIAL_STATE } from './state';
import {
  notificationsActions,
  loaderActions,
  setCurrentNavigation,
  setCurrentTitle,
  uiThemeActions,
} from './actions';

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

  immerOn(notificationsActions.dismiss, state => {
    state.notifications.pop();
  }),

  immerOn(loaderActions.start, state => {
    state.loading = true;
  }),

  immerOn(loaderActions.stop, state => {
    state.loading = false;
  }),

  immerOn(setCurrentNavigation, (state, { current }) => {
    state.navigation.current = current;
  }),

  immerOn(setCurrentTitle, (state, { title }) => {
    state.title = title;
  }),

  immerOn(uiThemeActions.setTheme, (state, { theme }) => {
    state.theme = theme;
  }),

  immerOn(uiThemeActions.setDefaultTheme, state => {
    state.theme = DEFAULT_THEME;
  }),
);
