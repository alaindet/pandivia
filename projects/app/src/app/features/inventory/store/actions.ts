import { createAction, props } from '@ngrx/store';

import { CreateInventoryItemDto, InventoryFilter, InventoryItem } from '../types';

export const inventoryFeatureReset = createAction(
  '[Inventory] Reset Inventory feature',
);

export const inventoryFetchItems = {
  try: createAction(
    '[Inventory] Fetch items',
  ),
  ok: createAction(
    '[Inventory] Fetch items success',
    props<{ items: InventoryItem[], message: string }>(),
  ),
  err: createAction(
    '[Inventory] Fetch items error',
    props<{ message: string }>(),
  ),
  force: createAction(
    '[Inventory] Force fetch items',
  ),
  cached: createAction(
    '[Inventory] Fetch cached items',
  ),
};

export const inventoryRemoveItems = {
  try: createAction(
    '[Inventory] Remove all items',
  ),
  ok: createAction(
    '[Inventory] Remove all items success',
    props<{ message: string }>(),
  ),
  err: createAction(
    '[Inventory] Remove all items error',
    props<{ message: string }>(),
  ),
};

export const inventoryRemoveItemsByCategory = {
  try: createAction(
    '[Inventory] Remove items by category',
    props<{ category: string }>(),
  ),
  ok: createAction(
    '[Inventory] Remove items by category success',
    props<{ category: string, message: string }>(),
  ),
  err: createAction(
    '[Inventory] Remove items by category error',
    props<{ message: string }>(),
  ),
};

export const inventoryCreateItem = {
  try: createAction(
    '[Inventory] Create item',
    props<{ dto: CreateInventoryItemDto }>(),
  ),
  ok: createAction(
    '[Inventory] Create item success',
    props<{ item: InventoryItem, message: string }>(),
  ),
  err: createAction(
    '[Inventory] Create item error',
    props<{ message: string }>(),
  ),
};

export const inventoryCloneItemFromList = {
  try: createAction(
    '[Inventory] Clone item from List',
    props<{ dto: CreateInventoryItemDto }>(),
  ),
  ok: createAction(
    '[Inventory] Clone item from List success',
    props<{ item: InventoryItem, message: string }>(),
  ),
  errDuplicate: createAction(
    '[Inventory] Clone item from List duplicate error',
    props<{ message: string }>(),
  ),
  err: createAction(
    '[Inventory] Clone item from List error',
    props<{ message: string }>(),
  ),
};

export const inventoryEditItem = {
  try: createAction(
    '[Inventory] Edit item',
    props<{ item: InventoryItem }>(),
  ),
  ok: createAction(
    '[Inventory] Edit item success',
    props<{ item: InventoryItem, message: string }>(),
  ),
  err: createAction(
    '[Inventory] Edit item error',
    props<{ message: string }>(),
  ),
};

export const inventoryRemoveItem = {
  try: createAction(
    '[Inventory] Remove item',
    props<{ itemId: string }>(),
  ),
  ok: createAction(
    '[Inventory] Remove item success',
    props<{ itemId: string, message: string }>(),
  ),
  err: createAction(
    '[Inventory] Remove item error',
    props<{ message: string }>(),
  ),
};

// WARNING: Potentially too generic name
export const inventoryFilters = {
  setCategory: createAction(
    '[Inventory] Set category filter',
    props<{ category: string }>(),
  ),
  clearCategory: createAction(
    '[Inventory] Clear category filter'
  ),
  setSearchQuery: createAction(
    '[Inventory] Set search query filter',
    props<{ searchQuery: string }>(),
  ),
  clearSearchQuery: createAction(
    '[Inventory] Clear search query filter',
  ),
  clearByName: createAction(
    '[Inventory] Clear filter by name',
    props<{ name: InventoryFilter }>(),
  ),
  clearAll: createAction(
    '[Inventory] Clear all filters',
  ),
};
