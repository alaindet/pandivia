import { catchError, map, of } from 'rxjs';

import { InventoryService } from '../inventory.service';
import * as fromActions from './actions';

export function fetchItemsHelper(inventoryService: InventoryService) {

  const onSuccess = fromActions.fetchInventoryItemsActions.fetchItemsSuccess;
  const onError = fromActions.fetchInventoryItemsActions.fetchItemsError;

  return inventoryService.getItems().pipe(
    map(items => onSuccess({ items })),
    catchError(() => {
      const error = 'Could not fetch items'; // TODO: Translate
      return of(onError({ error }));
    })
  )
}
