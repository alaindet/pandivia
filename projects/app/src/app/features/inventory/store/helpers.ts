import { InventoryFeatureState } from '@app/features/inventory/store';
import { catchError, map, of } from 'rxjs';

import { LOADING_STATUS } from '@app/common/types';
import { InventoryService } from '../services/inventory.service';
import { inventoryItemsAsyncReadActions } from './actions';

export function fetchItemsHelper(inventoryService: InventoryService) {

  const onSuccess = inventoryItemsAsyncReadActions.fetchItemsSuccess;
  const onError = inventoryItemsAsyncReadActions.fetchItemsError;

  return inventoryService.getItems().pipe(
    map(items => onSuccess({ items })),
    catchError(() => {
      const message = 'Could not fetch inventory items'; // TODO: Translate
      return of(onError({ message }));
    })
  )
}

export function setSuccessState(state: InventoryFeatureState, message: string): void {
  console.log(message); // TODO: Remove?
  state.status = LOADING_STATUS.IDLE;
  state.lastUpdated = Date.now();
}
