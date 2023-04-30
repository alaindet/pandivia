import { LOADING_STATUS } from '@app/common/types';
import { ListsFeatureState } from '@app/features/lists/store';
import { List } from '@app/features/lists/types';

export const MOCK_LISTS: List[] = [
  { id: 'supermarket1', name: 'Supermarket 1' },
  { id: 'supermarket2', name: 'Supermarket 2' },
  { id: 'supermarket3', name: 'Supermarket 3' },
];

export const MOCK_LISTS_FEATURE_INITIAL_STATE: ListsFeatureState = {
  status: LOADING_STATUS.IDLE,
  lists: MOCK_LISTS,
};
