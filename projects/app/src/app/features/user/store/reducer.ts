import { createReducer } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';

import { LOADING_STATUS } from '@app/common/types';
import { USER_FEATURE_INITIAL_STATE } from './state';
import { loginActions, setLanguage } from './actions';

export const userReducer = createReducer(USER_FEATURE_INITIAL_STATE,

  immerOn(loginActions.login, state => {
    state.status = LOADING_STATUS.LOADING;
  }),

  immerOn(loginActions.loginSuccess, state => {
    // TODO: Save other user data
    state.status = LOADING_STATUS.IDLE;
    state.logged = true;
  }),

  immerOn(loginActions.loginError, state => {
    state.status = LOADING_STATUS.ERROR;
    state.logged = false;
    state.email = null;
  }),

  immerOn(loginActions.logout, state => {
    state.status = LOADING_STATUS.IDLE;
    state.email = null;
    state.logged = false;
  }),

  immerOn(setLanguage, (state, { language }) => {
    state.language = language;
  }),
);
