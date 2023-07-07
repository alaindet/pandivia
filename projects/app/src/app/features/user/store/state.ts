import { User } from '@angular/fire/auth';
import { LOADING_STATUS, LoadingStatus } from '@app/common/types';
import { DEFAULT_LANGUAGE, Language } from '@app/core/language';

export type UserFeatureState = {
  user: User | null;
  status: LoadingStatus;
  language: Language;
};

export const USER_FEATURE_NAME = 'user';

export const USER_FEATURE_INITIAL_STATE: UserFeatureState = {
  user: null,
  status: LOADING_STATUS.PRISTINE,
  language: DEFAULT_LANGUAGE,
};
