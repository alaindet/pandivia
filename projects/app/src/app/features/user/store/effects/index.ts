import { UserSignInEffects } from './sign-in';
import { UserSignOutEffects } from './sign-out';
import { UserUiEffects } from './ui';

export const USER_FEATURE_EFFECTS = [
  UserUiEffects,
  UserSignInEffects,
  UserSignOutEffects,
];
