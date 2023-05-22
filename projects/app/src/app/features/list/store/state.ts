import { ListItem } from '@app/core';
import { LOADING_STATUS, LoadingStatus } from '@app/common/types';

export type ListFeatureState = {
  items: ListItem[];
  status: LoadingStatus;
};

export const LIST_FEATURE_NAME = 'list';

export const LIST_FEATURE_INITIAL_STATE: ListFeatureState = {
  items: [],
  status: LOADING_STATUS.PRISTINE,
};
