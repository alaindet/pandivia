import { ListUiEffects } from './ui';
import { ListItemAsyncWriteEffects } from './item-async-write';
import { ListItemsAsyncReadEffects } from './items-async-read';
import { ListItemsAsyncWriteEffects } from './items-async-write';

export const LIST_FEATURE_EFFECTS = [
  ListUiEffects,
  ListItemAsyncWriteEffects,
  ListItemsAsyncReadEffects,
  ListItemsAsyncWriteEffects,
];
