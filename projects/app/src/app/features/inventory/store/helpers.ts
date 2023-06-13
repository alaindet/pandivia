import { catchError, map, of } from 'rxjs';

import { InventoryService } from '../services/inventory.service';
import * as fromActions from './actions';

export function fetchItemsHelper(inventoryService: InventoryService) {

  const onSuccess = fromActions.inventoryFetchItemsActions.fetchItemsSuccess;
  const onError = fromActions.inventoryFetchItemsActions.fetchItemsError;

  return inventoryService.getItems().pipe(
    map(items => onSuccess({ items })),
    catchError(() => {
      const error = 'Could not fetch inventory items'; // TODO: Translate
      return of(onError({ error }));
    })
  )
}
