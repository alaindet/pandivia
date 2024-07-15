import { removeItem, updateCollection, updateItem } from '@app/common/store';
import { CreateInventoryItemDto, InventoryItem } from '../types';
import { InventoryStoreFeatureService } from './__feature';

export class InventoryItemStoreSubfeature {

  constructor(
    private parent: InventoryStoreFeatureService,
  ) { }

  create(dto: CreateInventoryItemDto) {
    return updateCollection(this.parent.api.createItem(dto))
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
    return updateCollection(this.parent.api.editItem(editedItem))
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
    return updateCollection(this.parent.api.removeItem(itemId))
      .withFeedback(this.parent.feedback)
      .onSuccess(removed => {
        removeItem(this.parent.items, removed.id);
      })
      .update();
  }

  // TODO
  cloneFromListItem(dto: CreateInventoryItemDto) {
    const exists = this.parent.itemExistsWithExactName(dto.name);
    // if (exists()) {

    // }
  }
}
