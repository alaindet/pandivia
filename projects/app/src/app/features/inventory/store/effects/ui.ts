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
import { TranslocoService } from '@ngneat/transloco';

@Injectable()
export class InventoryUiEffects {

  private actions = inject(Actions);
  private transloco = inject(TranslocoService);
  private ui = createUiController(this.actions, this.transloco);

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
