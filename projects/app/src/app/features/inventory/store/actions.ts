import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { InventoryItem } from '@app/core';

export const fetchInventoryItemsActions = createActionGroup({
  source: 'Inventory',
  events: {
    'Fetch items': emptyProps(),
    'Force fetch items': emptyProps(),
    'Fetch items success': props<{ items: InventoryItem[] }>(),
    'Fetch items error': props<{ error: string }>(),
  },
});
