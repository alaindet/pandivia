import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { InventoryFilter, CreateInventoryItemDto, InventoryItem } from '../types';

export const inventoryFilterActions = createActionGroup({
  source: 'Inventory/Filters',
  events: {
    setCategoryFilter: props<{ category: string }>(),
    clearCategoryFilter: emptyProps(),
    clearFilterByName: props<{ name: InventoryFilter }>(),
    clearAllFilters: emptyProps(),
  },
});

export const inventoryAllItemsActions = createActionGroup({
  source: 'Inventory/Items',
  events: {
    remove: emptyProps(),
  },
});

export const inventoryCategoryActions = createActionGroup({
  source: 'Inventory/Category',
  events: {
    remove: props<{ category: string }>(),
  },
});

export const inventoryItemActions = createActionGroup({
  source: 'Inventory/Item',
  events: {
    create: props<{ dto: CreateInventoryItemDto }>(),
    edit: props<{ item: InventoryItem }>(),
    remove: props<{ itemId: string }>(),
  },
});

export const inventoryItemsAsyncReadActions = createActionGroup({
  source: 'Inventory/Items/AsyncRead',
  events: {
    fetchItems: emptyProps(),
    fetchItemsCached: emptyProps(),
    forceFetchItems: emptyProps(),
    fetchItemsSuccess: props<{ items: InventoryItem[] }>(),
    fetchItemsError: props<{ message: string }>(),
  },
});

// TODO: https://firebase.google.com/docs/firestore/manage-data/transactions
export const inventoryItemsAsyncWriteActions = createActionGroup({
  source: 'Inventory/Items/AsyncWrite',
  events: {
    editSuccess: props<{ message: string, items: InventoryItem[] }>(),
    editError: props<{ message: string }>(),

    removeSuccess: props<{ message: string, items: InventoryItem[] }>(),
    removeError: props<{ message: string }>(),
  },
});

export const inventoryItemAsyncWriteActions = createActionGroup({
  source: 'Inventory/Item/AsyncWrite',
  events: {
    createSuccess: props<{ message: string, item: InventoryItem }>(),
    createError: props<{ message: string }>(),

    editSuccess: props<{ message: string, item: InventoryItem }>(),
    editError: props<{ message: string }>(),

    removeSuccess: props<{ message: string, item: InventoryItem }>(),
    removeError: props<{ message: string }>(),
  },
});
