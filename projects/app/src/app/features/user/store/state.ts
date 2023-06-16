import { LOADING_STATUS, LoadingStatus } from '@app/common/types';
import { DEFAULT_LANGUAGE, Language } from '@app/core/language';

export type UserFeatureState = {
  email: string | null;
  logged: boolean;
  status: LoadingStatus;
  language: Language;
};

export const USER_FEATURE_NAME = 'user';

export const USER_FEATURE_INITIAL_STATE: UserFeatureState = {
  email: null,
  logged: false,
  status: LOADING_STATUS.PRISTINE,
  language: DEFAULT_LANGUAGE,
};
