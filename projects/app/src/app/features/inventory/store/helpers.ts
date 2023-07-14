import { catchError, map, of } from 'rxjs';

import { InventoryService } from '../services';
import { inventoryFetchItems } from './actions';

export function fetchInventoryItemsHelper(inventoryService: InventoryService) {
  return inventoryService.getItems().pipe(
    map(items => {
      const message = 'common.async.fetchItemsSuccess';
      return inventoryFetchItems.ok({ items, message });
    }),
    catchError(() => {
      const message = 'common.async.fetchItemsError';
      return of(inventoryFetchItems.err({ message }));
    })
  );
}
