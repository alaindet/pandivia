import { Injectable, inject } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { TranslocoService } from '@ngneat/transloco';

import { createUiController } from '@app/core/ui';
import { inventoryCreateItem, inventoryEditItem, inventoryFetchItems, inventoryRemoveItem, inventoryRemoveItems, inventoryRemoveItemsByCategory } from '../actions';

@Injectable()
export class InventoryUiEffects {

  private actions = inject(Actions);
  private transloco = inject(TranslocoService);
  private ui = createUiController(this.actions, this.transloco);

  startLoader$ = this.ui.startLoaderOn(
    inventoryFetchItems.try,
    inventoryFetchItems.force,
    inventoryRemoveItems.try,
    inventoryRemoveItemsByCategory.try,
    inventoryCreateItem.try,
    inventoryEditItem.try,
    inventoryRemoveItem.try,
  );

  stopLoader$ = this.ui.stopLoaderOn(
    inventoryFetchItems.ok,
    inventoryFetchItems.err,
    inventoryFetchItems.cached,
    inventoryRemoveItems.err,
    inventoryRemoveItems.err,
    inventoryRemoveItemsByCategory.ok,
    inventoryRemoveItemsByCategory.err,
    inventoryCreateItem.ok,
    inventoryCreateItem.err,
    inventoryEditItem.ok,
    inventoryEditItem.err,
    inventoryRemoveItem.ok,
    inventoryRemoveItem.err,
  );

  showSuccess$ = this.ui.showSuccessOn(
    inventoryRemoveItems.ok,
    inventoryRemoveItemsByCategory.ok,
    inventoryCreateItem.ok,
    inventoryEditItem.ok,
    inventoryRemoveItem.ok,
  );

  showError$ = this.ui.showErrorOn(
    inventoryFetchItems.err,
    inventoryRemoveItems.err,
    inventoryRemoveItemsByCategory.err,
    inventoryCreateItem.err,
    inventoryEditItem.err,
    inventoryRemoveItem.err,
  );
}
