import { ListAllItemsEffects } from './all-items';
import { ListCategoryItemsEffects } from './category';
import { ListItemEffects } from './item';
import { ListSignOutEffects } from './sign-out';
import { ListUiEffects } from './ui';

export const LIST_FEATURE_EFFECTS = [
  ListUiEffects,
  ListAllItemsEffects,
  ListCategoryItemsEffects,
  ListItemEffects,
  ListSignOutEffects,
];
