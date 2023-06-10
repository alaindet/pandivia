import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { CreateInventoryItemDto, InventoryItem } from '@app/core';

export const inventoryFetchItemsActions = createActionGroup({
  source: 'Inventory',
  events: {
    'Fetch items': emptyProps(),
    'Fetch items cached': emptyProps(),
    'Force fetch items': emptyProps(),
    'Fetch items success': props<{ items: InventoryItem[] }>(),
    'Fetch items error': props<{ error: string }>(),
  },
});

export const inventoryItemActions = createActionGroup({
  source: 'Inventory/Item',
  events: {
    'Create': props<{ dto: CreateInventoryItemDto }>(),
  },
});