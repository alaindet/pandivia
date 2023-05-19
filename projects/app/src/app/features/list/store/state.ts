import { ListItem } from '../types';

export type ListFeatureState = {
  items: ListItem[];
};

export const LIST_FEATURE_NAME = 'list';

export const LIST_FEATURE_INITIAL_STATE: ListFeatureState = {
  items: [],
};
