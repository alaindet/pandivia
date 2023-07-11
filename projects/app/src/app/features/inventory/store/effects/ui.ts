import { Injectable, inject } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { TranslocoService } from '@ngneat/transloco';

import { createUiController } from '@app/core/store/ui';
import { inventoryCreateItem, inventoryEditItem, inventoryFetchItems, inventoryRemoveItem, inventoryRemoveItems, inventoryRemoveItemsByCategory } from '../actions';

@Injectable()
export class InventoryUiEffects {

  private actions = inject(Actions);
  private transloco = inject(TranslocoService);
  private ui = createUiController(this.actions, this.transloco);

  startLoader$ = this.ui.startLoaderOn(
    inventoryFetchItems.do,
    inventoryFetchItems.force,
    inventoryRemoveItems.do,
    inventoryRemoveItemsByCategory.do,
    inventoryCreateItem.do,
    inventoryEditItem.do,
    inventoryRemoveItem.do,
  );

  stopLoader$ = this.ui.stopLoaderOn(
    inventoryFetchItems.ok,
    inventoryFetchItems.ko,
    inventoryFetchItems.cached,
    inventoryRemoveItems.ko,
    inventoryRemoveItems.ko,
    inventoryRemoveItemsByCategory.ok,
    inventoryRemoveItemsByCategory.ko,
    inventoryCreateItem.ok,
    inventoryCreateItem.ko,
    inventoryEditItem.ok,
    inventoryEditItem.ko,
    inventoryRemoveItem.ok,
    inventoryRemoveItem.ko,
  );

  showSuccess$ = this.ui.showSuccessOn(
    // inventoryFetchItems.ok,
    inventoryRemoveItems.ok,
    inventoryRemoveItemsByCategory.ok,
    inventoryCreateItem.ok,
    inventoryEditItem.ok,
    inventoryRemoveItem.ok,
  );

  showError$ = this.ui.showErrorOn(
    inventoryFetchItems.ko,
    inventoryRemoveItems.ko,
    inventoryRemoveItemsByCategory.ko,
    inventoryCreateItem.ko,
    inventoryEditItem.ko,
    inventoryRemoveItem.ko,
  );
}
