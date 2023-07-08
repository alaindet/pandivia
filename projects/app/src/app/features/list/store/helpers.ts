import { catchError, map, of } from 'rxjs';

import { ListService } from '../services/list.service';
import { listItemsAsyncReadActions } from './actions';
import { ListFeatureState } from './state';
import { LOADING_STATUS } from '@app/common/types';

export function fetchListItemsHelper(listService: ListService) {
  return listService.getItems().pipe(
    map(items => listItemsAsyncReadActions.fetchItemsSuccess({ items })),
    catchError(() => {
      const message = 'common.async.fetchItemsError';
      return of(listItemsAsyncReadActions.fetchItemsError({ message }));
    })
  )
}

export function setSuccessState(state: ListFeatureState): void {
  state.status = LOADING_STATUS.IDLE;
  state.lastUpdated = Date.now();
}
