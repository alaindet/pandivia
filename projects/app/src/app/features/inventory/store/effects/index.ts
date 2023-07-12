import { InventoryUiEffects } from './ui';
import { InventoryAllItemsEffects } from './all-items';
import { InventoryCategoryItemsEffects } from './category';
import { InventoryItemEffects } from './item';

export const INVENTORY_FEATURE_EFFECTS = [
  InventoryUiEffects,
  InventoryAllItemsEffects,
  InventoryCategoryItemsEffects,
  InventoryItemEffects,
];
