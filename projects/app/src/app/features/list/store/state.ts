import { ListItem } from '@app/core';
import { LOADING_STATUS, LoadingStatus, UnixTimestamp } from '@app/common/types';
import { LIST_FILTER, ListFilters } from '../types';

export type ListFeatureState = {
  items: ListItem[];
  status: LoadingStatus;
  lastUpdated: UnixTimestamp | null;
  itemModalSuccessCounter: number;
  filters: ListFilters;
};

export const LIST_FEATURE_NAME = 'list';

export const LIST_FEATURE_INITIAL_STATE: ListFeatureState = {
  items: [],
  status: LOADING_STATUS.PRISTINE,
  lastUpdated: null,
  itemModalSuccessCounter: 0,
  filters: {
    [LIST_FILTER.CATEGORY]: null,
    [LIST_FILTER.IS_DONE]: null,
  },
};
