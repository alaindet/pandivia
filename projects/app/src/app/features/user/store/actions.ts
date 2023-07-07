import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '@angular/fire/auth';

import { UserCredentials } from '../types';
import { Language } from '@app/core';

export const userSignInActions = createActionGroup({
  source: 'User/SignIn',
  events: {
    signIn: props<{ credentials: UserCredentials }>(),
    signInSuccess: props<{ user: User, message: string }>(),
    signInError: props<{ message: string }>(),
    autoSignIn: props<{ user: User }>(),
  },
});

export const userSignOutActions = createActionGroup({
  source: 'User/SignOut',
  events: {
    signOut: emptyProps(),
    signOutSuccess: props<{ message: string }>(),
    signOutError: props<{ message: string }>(),
  },
});

export const userLanguageActions = createActionGroup({
  source: 'User/Language',
  events: {
    setLanguage: props<{ language: Language }>(),
    setDefaultLanguage: emptyProps(),
  },
});
