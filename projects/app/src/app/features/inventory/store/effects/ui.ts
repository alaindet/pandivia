import { Injectable, inject } from '@angular/core';
import { Actions } from '@ngrx/effects';

import { createUiController } from '@app/core/store/ui';
import {
  inventoryItemsAsyncReadActions,
  inventoryAllItemsActions,
  inventoryCategoryActions,
  inventoryItemActions,
  inventoryItemsAsyncWriteActions,
  inventoryItemAsyncWriteActions,
} from '../actions';

@Injectable()
export class InventoryUiEffects {

  private actions = inject(Actions);
  private ui = createUiController(this.actions);

  startLoader$ = this.ui.startLoaderOn(
    inventoryItemsAsyncReadActions.fetchItems,
    inventoryItemsAsyncReadActions.forceFetchItems,

    inventoryAllItemsActions.remove,

    inventoryCategoryActions.remove,

    inventoryItemActions.create,
    inventoryItemActions.edit,
    inventoryItemActions.remove,
  );

  stopLoader$ = this.ui.stopLoaderOn(
    inventoryItemsAsyncReadActions.fetchItemsSuccess,
    inventoryItemsAsyncReadActions.fetchItemsError,
    inventoryItemsAsyncReadActions.fetchItemsCached,

    inventoryItemsAsyncWriteActions.editSuccess,
    inventoryItemsAsyncWriteActions.editError,
    inventoryItemsAsyncWriteActions.removeSuccess,
    inventoryItemsAsyncWriteActions.removeError,

    inventoryItemAsyncWriteActions.createSuccess,
    inventoryItemAsyncWriteActions.createError,
    inventoryItemAsyncWriteActions.editSuccess,
    inventoryItemAsyncWriteActions.editError,
    inventoryItemAsyncWriteActions.removeSuccess,
    inventoryItemAsyncWriteActions.removeError,
  );

  showError$ = this.ui.showErrorOn(
    inventoryItemsAsyncReadActions.fetchItemsError,

    inventoryItemsAsyncWriteActions.editError,
    inventoryItemsAsyncWriteActions.removeError,

    inventoryItemAsyncWriteActions.createError,
    inventoryItemAsyncWriteActions.editError,
    inventoryItemAsyncWriteActions.removeError,
  );
}
