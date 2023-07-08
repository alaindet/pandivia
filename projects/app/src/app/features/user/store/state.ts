import { LOADING_STATUS, LoadingStatus } from '@app/common/types';
import { DEFAULT_LANGUAGE, Language } from '@app/core/language';
import { UserData } from '../types';

export type UserFeatureState = {
  data: UserData | null;
  status: LoadingStatus;
  language: Language;
};

export const USER_FEATURE_NAME = 'user';

export const USER_FEATURE_INITIAL_STATE: UserFeatureState = {
  data: null,
  status: LOADING_STATUS.PRISTINE,
  language: DEFAULT_LANGUAGE,
};
