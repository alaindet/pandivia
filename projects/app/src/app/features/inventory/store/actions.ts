import { createAction, props } from '@ngrx/store';

import { CreateInventoryItemDto, InventoryFilter, InventoryItem } from '../types';

export const inventoryFetchItems = {
  do: createAction(
    '[Inventory/Items] Fetch items',
  ),
  ok: createAction(
    '[Inventory/Items] Fetch items success',
    props<{ items: InventoryItem[], message: string }>(),
  ),
  ko: createAction(
    '[Inventory/Items] Fetch items error',
    props<{ message: string }>(),
  ),
  force: createAction(
    '[Inventory/Items] Force fetch items',
  ),
  cached: createAction(
    '[Inventory/Items] Fetch cached items',
  ),
};

export const inventoryRemoveItems = {
  do: createAction(
    '[Inventory/Items] Remove all items',
  ),
  ok: createAction(
    '[Inventory/Items] Remove all items success',
    props<{ message: string }>(),
  ),
  ko: createAction(
    '[Inventory/Items] Remove all items error',
    props<{ message: string }>(),
  ),
};

export const inventoryRemoveItemsByCategory = {
  do: createAction(
    '[Inventory/Category] Remove items by category',
    props<{ category: string }>(),
  ),
  ok: createAction(
    '[Inventory/Category] Remove items by category success',
    props<{ category: string, message: string }>(),
  ),
  ko: createAction(
    '[Inventory/Category] Remove items by category error',
    props<{ message: string }>(),
  ),
};

export const inventoryCreateItem = {
  do: createAction(
    '[Inventory/Item] Create item',
    props<{ dto: CreateInventoryItemDto }>(),
  ),
  ok: createAction(
    '[Inventory/Item] Create item success',
    props<{ item: InventoryItem, message: string }>(),
  ),
  ko: createAction(
    '[Inventory/Item] Create item error',
    props<{ message: string }>(),
  ),
};

export const inventoryEditItem = {
  do: createAction(
    '[Inventory/Item] Edit item',
    props<{ item: InventoryItem }>(),
  ),
  ok: createAction(
    '[Inventory/Item] Edit item success',
    props<{ item: InventoryItem, message: string }>(),
  ),
  ko: createAction(
    '[Inventory/Item] Edit item error',
    props<{ message: string }>(),
  ),
};

export const inventoryRemoveItem = {
  do: createAction(
    '[Inventory/Item] Remove item',
    props<{ itemId: string }>(),
  ),
  ok: createAction(
    '[Inventory/Item] Remove item success',
    props<{ itemId: string, message: string }>(),
  ),
  ko: createAction(
    '[Inventory/Item] Remove item error',
    props<{ message: string }>(),
  ),
};

export const inventoryFilters = {
  setCategory: createAction(
    '[Inventory/Filters] Set category filter',
    props<{ category: string }>(),
  ),
  clearCategory: createAction(
    '[Inventory/Filters] Clear category filter'
  ),
  clearByName: createAction(
    '[Inventory/Filters] Clear filter by name',
    props<{ name: InventoryFilter }>(),
  ),
  clearAll: createAction(
    '[Inventory/Filters] Clear all filters',
  ),
};
