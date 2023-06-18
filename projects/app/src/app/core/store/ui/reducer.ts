import { createReducer } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';

import { NOTIFICATION_TYPE } from '@app/common/types';
import { DEFAULT_THEME } from '@app/core/theme';
import { UI_FEATURE_INITIAL_STATE } from './state';
import {
  uiNotificationsActions,
  uiLoaderActions,
  uiNavigationActions,
  uiSetPageTitle,
  uiThemeActions,
} from './actions';

export const uiReducer = createReducer(
  UI_FEATURE_INITIAL_STATE,

  immerOn(uiNotificationsActions.addSuccess, (state, { message }) => {
    const id = Date.now() + Math.random();
    state.notifications.push({ id, type: NOTIFICATION_TYPE.SUCCESS, message });
  }),

  immerOn(uiNotificationsActions.addError, (state, { message }) => {
    const id = Date.now() + Math.random();
    state.notifications.push({ id, type: NOTIFICATION_TYPE.ERROR, message });
  }),

  immerOn(uiNotificationsActions.dismiss, state => {
    state.notifications.pop();
  }),

  immerOn(uiLoaderActions.start, state => {
    state.loading = true;
  }),

  immerOn(uiLoaderActions.stop, state => {
    state.loading = false;
  }),

  immerOn(uiNavigationActions.setCurrent, (state, { current }) => {
    state.navigation.current = current;
  }),

  immerOn(uiSetPageTitle, (state, { title }) => {
    state.title = title;
  }),

  immerOn(uiThemeActions.setTheme, (state, { theme }) => {
    state.theme = theme;
  }),

  immerOn(uiThemeActions.setDefaultTheme, state => {
    state.theme = DEFAULT_THEME;
  }),
);
