import { ObjectValues } from '@app/common/types';

export const INVENTORY_FILTER = {
  CATEGORY: 'category',
} as const;

export type InventoryFilter = ObjectValues<typeof INVENTORY_FILTER>;

export type InventoryFilters = {
  [INVENTORY_FILTER.CATEGORY]: string | null;
};

export type InventoryFilterToken = {
  key: InventoryFilter;
  value: any; // TODO: Add type
};
