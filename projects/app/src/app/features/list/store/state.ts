import { ListItem } from '@app/core';
import { LOADING_STATUS, LoadingStatus } from '@app/common/types';
import { LIST_FILTER, ListFilters } from '../types';

export type ListFeatureState = {
  items: ListItem[];
  status: LoadingStatus;
  filters: ListFilters;
};

export const LIST_FEATURE_NAME = 'list';

export const LIST_FEATURE_INITIAL_STATE: ListFeatureState = {
  items: [],
  status: LOADING_STATUS.PRISTINE,
  filters: {
    [LIST_FILTER.CATEGORY]: null,
    [LIST_FILTER.IS_DONE]: null,
  },
};
