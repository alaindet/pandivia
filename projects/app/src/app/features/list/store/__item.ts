import { removeItem, updateCollection, updateItem } from '@app/common/store';
import { CreateListItemDto, ListItem } from '../types';
import { ListStoreFeatureService } from './__feature';

export class ListItemStoreSubfeature {

  constructor(
    private parent: ListStoreFeatureService,
  ) {}

  create(dto: CreateListItemDto) {
    return updateCollection(this.parent.api.item.create(dto))
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

  edit(editedItem: ListItem) {
    return updateCollection(this.parent.api.item.edit(editedItem))
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

  complete(itemId: ListItem['id']) {
    return updateCollection(this.parent.api.item.complete(itemId))
      .withFeedback(this.parent.feedback)
      .onSuccess(updated => {
        updateItem(this.parent.items, updated.id, updated);
      })
      .update();
  }

  undo(itemId: ListItem['id']) {
    return updateCollection(this.parent.api.item.undo(itemId))
      .withFeedback(this.parent.feedback)
      .onSuccess(updated => {
        updateItem(this.parent.items, updated.id, updated);
      })
      .update();
  }

  toggle(itemId: ListItem['id']) {
    return updateCollection(this.parent.api.item.toggle(itemId))
      .withFeedback(this.parent.feedback)
      .onSuccess(updated => {
        updateItem(this.parent.items, updated.id, updated);
      })
      .update();
  }

  increment(itemId: ListItem['id']) {
    return updateCollection(this.parent.api.item.increment(itemId))
      .withFeedback(this.parent.feedback)
      .onSuccess(updated => {
        updateItem(this.parent.items, updated.id, updated);
      })
      .update();
  }

  decrement(itemId: ListItem['id']) {
    return updateCollection(this.parent.api.item.decrement(itemId))
      .withFeedback(this.parent.feedback)
      .onSuccess(updated => {
        updateItem(this.parent.items, updated.id, updated);
      })
      .update();
  }

  remove(itemId: ListItem['id']) {
    return updateCollection(this.parent.api.item.remove(itemId))
      .withFeedback(this.parent.feedback)
      .onSuccess(removed => {
        removeItem(this.parent.items, removed.id);
      })
      .update();
  }
}
