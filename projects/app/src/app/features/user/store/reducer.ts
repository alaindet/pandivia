import { createReducer } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';

import { DEFAULT_LANGUAGE } from '@app/core';
import { LOADING_STATUS } from '@app/common/types';
import { USER_FEATURE_INITIAL_STATE } from './state';
import { userSignInActions, userLanguageActions, userSignOutActions } from './actions';

export const userReducer = createReducer(USER_FEATURE_INITIAL_STATE,

  immerOn(
    userSignInActions.signIn,
    userSignOutActions.signOut,
    state => {
      state.status = LOADING_STATUS.LOADING;
    },
  ),

  immerOn(
    userSignInActions.signInError,
    userSignOutActions.signOutError,
    state => {
      state.status = LOADING_STATUS.ERROR;
    },
  ),

  immerOn(userSignInActions.signInSuccess, (state, { user }) => {
    state.status = LOADING_STATUS.IDLE;
    state.data = user;
  }),

  immerOn(userSignInActions.autoSignIn, (state, { user }) => {
    state.status = LOADING_STATUS.IDLE;
    state.data = user;
  }),

  immerOn(userSignOutActions.signOutSuccess, state => {
    state.status = LOADING_STATUS.IDLE;
    state.data = null;
  }),

  immerOn(userLanguageActions.setLanguage, (state, { language }) => {
    state.language = language;
  }),

  immerOn(userLanguageActions.setDefaultLanguage, state => {
    state.language = DEFAULT_LANGUAGE;
  }),
);
