import { LOADING_STATUS, LoadingStatus } from '@app/common/types';

import { List } from '../types';
import { MOCK_LISTS_FEATURE_INITIAL_STATE } from '@app/mocks';

export type ListsFeatureState = {
  status: LoadingStatus;
  lists: List[];
};

export const LISTS_FEATURE_NAME = 'lists';

export const LISTS_FEATURE_INITIAL_STATE = MOCK_LISTS_FEATURE_INITIAL_STATE;

// TODO
// export const LISTS_FEATURE_INITIAL_STATE: ListsFeatureState = {
//   status: LOADING_STATUS.PRISTINE,
//   lists: [],
// };
