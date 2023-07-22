import { createAction, props } from '@ngrx/store';

import { UserCredentials, UserData } from '../types';
import { Language } from '@app/core';

export const userSignIn = {
  try: createAction(
    '[User] Sign in',
    props<{ credentials: UserCredentials }>(),
  ),
  ok: createAction(
    '[User] Sign in success',
    props<{ user: UserData, message: string }>(),
  ),
  err: createAction(
    '[User] Sign in error',
    props<{ message: string }>(),
  ),
};

export const userAutoSignIn = {
  ok: createAction(
    '[User] Auto sign in',
    props<{ user: UserData }>(),
  ),
  err: createAction(
    '[User] Auto sign in failed',
  ),
};

export const userSignOut = {
  try: createAction(
    '[User] Sign out',
  ),
  ok: createAction(
    '[User] Sign out success',
    props<{ message: string }>(),
  ),
  err: createAction(
    '[User] Sign out error',
    props<{ message: string }>(),
  ),
};

export const userSetLanguage = createAction(
  '[User] Set language',
  props<{ language: Language }>(),
);
