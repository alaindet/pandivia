import { Subscription } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';

import { removeItem, updateStore, updateItem } from '@app/common/store';
import { CreateInventoryItemDto, InventoryItem } from '../types';
import { InventoryStore } from './feature';

export class InventoryItemSubstore {

  constructor(
    private parent: InventoryStore,
    private transloco: TranslocoService,
  ) {}

  create(dto: CreateInventoryItemDto) {
    return updateStore(this.parent.api.createItem(dto))
      .withFeedback(this.parent.feedback)
      .withNotifications(
        'common.async.createItemSuccess',
        'common.async.createItemError',
      )
      .onSuccess(item => {
        this.parent.itemModalSuccessCounter.update(counter => counter + 1);
        this.parent.items.update(items => [...items, item]);
      })
      .update();
  }

  edit(editedItem: InventoryItem) {
    return updateStore(this.parent.api.editItem(editedItem))
      .withFeedback(this.parent.feedback)
      .withNotifications(
        'common.async.editItemSuccess',
        'common.async.editItemError',
      )
      .onSuccess(updated => {
        this.parent.itemModalSuccessCounter.update(counter => counter + 1);
        updateItem(this.parent.items, updated.id, updated);
      })
      .update();
  }

  remove(itemId: InventoryItem['id']) {
    return updateStore(this.parent.api.removeItem(itemId))
      .withFeedback(this.parent.feedback)
      .onSuccess(removed => {
        removeItem(this.parent.items, removed.id);
      })
      .update();
  }

  cloneFromListItem(dto: CreateInventoryItemDto): Subscription | undefined {

    // Check for duplicates
    if (this.parent.itemExistsWithExactName(dto.name)()) {
      this.parent.ui.notifications.error(this.transloco.translate(
        'inventory.cloneFromList.duplicateError',
        { item: dto.name },
      ));
      return;
    }

    return updateStore(this.parent.api.createItem(dto))
      .withFeedback(this.parent.feedback)
      .withNotifications(
        'inventory.cloneFromList.success',
        'inventory.cloneFromList.error',
      )
      .onSuccess(item => {
        this.parent.items.update(items => [...items, item]);
      })
      .update();
  }
}
