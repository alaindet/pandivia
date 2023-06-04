import { createReducer } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';

import * as fromActions from './actions';
import { USER_FEATURE_INITIAL_STATE } from './state';
import { LOADING_STATUS } from '@app/common/types';

export const userReducer = createReducer(USER_FEATURE_INITIAL_STATE,

  immerOn(fromActions.loginActions.login, state => {
    state.status = LOADING_STATUS.LOADING;
  }),

  immerOn(fromActions.loginActions.loginSuccess, state => {
    // TODO: Save other user data
    state.status = LOADING_STATUS.IDLE;
    state.logged = true;
  }),

  immerOn(fromActions.loginActions.loginError, state => {
    state.status = LOADING_STATUS.ERROR;
    state.logged = false;
    state.email = null;
  }),

  immerOn(fromActions.loginActions.logout, state => {
    state.status = LOADING_STATUS.IDLE;
    state.email = null;
    state.logged = false;
  }),

  immerOn(fromActions.setLanguage, (state, { language }) => {
    state.language = language;
  }),
);
