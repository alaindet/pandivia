import { ObjectValues } from '@app/common/types';

export const INVENTORY_FILTER = {
  CATEGORY: 'category',
  SEARCH_QUERY: 'searchQuery',
} as const;

export type InventoryFilter = ObjectValues<typeof INVENTORY_FILTER>;

export type InventoryFilters = {
  [INVENTORY_FILTER.CATEGORY]: string | null;
  [INVENTORY_FILTER.SEARCH_QUERY]: string | null;
};

export type InventoryFilterToken = {
  key: InventoryFilter;
  value: any; // TODO: Add type
  label?: string;
};
