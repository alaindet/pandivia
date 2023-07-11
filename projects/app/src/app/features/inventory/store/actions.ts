import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { InventoryFilter, CreateInventoryItemDto, InventoryItem } from '../types';

export const inventoryReadItemsActions = createActionGroup({
  source: 'Inventory/ReadItems',
  events: {
    fetch: emptyProps(),
    fetchCached: emptyProps(),
    forceFetch: emptyProps(),
    fetchSuccess: props<{ items: InventoryItem[] }>(),
    fetchError: props<{ message: string }>(),
  },
});

export const inventoryWriteItemsActions = createActionGroup({
  source: 'Inventory/WriteItems',
  events: {
    remove: emptyProps(),
    removeSuccess: emptyProps(),
    removeError: emptyProps(),
  },
});

export const inventoryFilterActions = createActionGroup({
  source: 'Inventory/Filters',
  events: {
    setCategoryFilter: props<{ category: string }>(),
    clearCategoryFilter: emptyProps(),
    clearFilterByName: props<{ name: InventoryFilter }>(),
    clearAllFilters: emptyProps(),
  },
});

export const inventoryCategoryActions = createActionGroup({
  source: 'Inventory/Category',
  events: {
    remove: props<{ category: string }>(),
    removeSuccess: props<{ category: string }>(),
    removeError: emptyProps(),
  },
});

export const inventoryItemActions = createActionGroup({
  source: 'Inventory/Item',
  events: {
    create: props<{ dto: CreateInventoryItemDto }>(),
    createSuccess: props<{ item: InventoryItem }>(),
    createError: emptyProps(),
    edit: props<{ item: InventoryItem }>(),
    editSuccess: emptyProps(),
    editError: emptyProps(),
    remove: props<{ itemId: string }>(),
    removeSuccess: props<{ itemId: string }>(),
    removeError: emptyProps(),
  },
});
