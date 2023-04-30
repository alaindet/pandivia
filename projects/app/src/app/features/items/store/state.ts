import { LoadingStatus } from '@app/common/types';

import { List } from '@app/features/lists/types';
import { ListItem } from '../types';

export type ListPartialFeatureState = {
  status: LoadingStatus;
  items: ListItem[];
};

export type ListItemsFeatureState = {
  [listId: List['id']]: ListPartialFeatureState;
};

export const LIST_ITEMS_FEATURE_NAME = 'list-items';

export const LIST_ITEMS_FEATURE_INITIAL_STATE: ListItemsFeatureState = {
  // ...
};
