import { InventoryUiEffects } from './ui';
import { InventoryItemAsyncWriteEffects } from './item-async-write';
import { InventoryItemsAsyncReadEffects } from './items-async-read';
import { InventoryItemsAsyncWriteEffects } from './items-async-write';

export const INVENTORY_FEATURE_EFFECTS = [
  InventoryUiEffects,
  InventoryItemAsyncWriteEffects,
  InventoryItemsAsyncReadEffects,
  InventoryItemsAsyncWriteEffects,
];
