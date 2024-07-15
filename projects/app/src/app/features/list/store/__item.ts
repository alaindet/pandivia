import { CreateListItemDto, ListItem } from '../types';
import { ListStoreFeatureService } from './__feature';
import { getStoreFeedback, updateItem, updateStoreItemsAsync } from './__functions';

export class ListItemStoreSubfeature {

  constructor(
    private parent: ListStoreFeatureService,
  ) {}

  create(dto: CreateListItemDto) {
    return updateStoreItemsAsync({
      source: this.parent.api.item.create(dto),
      feedback: getStoreFeedback(this.parent.ui, this.parent.status),
      messages: ['common.async.createItemSuccess', 'common.async.createItemError'],
      onSuccess: (item: ListItem) => {
        this.parent.itemModalSuccessCounter.update(prev => prev + 1);
        this.parent.items.update(prev => [...prev, item]);
      },
    });
  }

  edit(editedItem: ListItem) {
    return updateStoreItemsAsync({
      source: this.parent.api.item.edit(editedItem),
      feedback: getStoreFeedback(this.parent.ui, this.parent.status),
      messages: ['common.async.editItemSuccess', 'common.async.editItemError'],
      onSuccess: (updated: ListItem) => {
        this.parent.itemModalSuccessCounter.update(prev => prev + 1);
        updateItem(this.parent.items, updated.id, updated);
      },
    });
  }

  complete(itemId: ListItem['id']) {
    return updateStoreItemsAsync({
      source: this.parent.api.item.complete(itemId),
      feedback: getStoreFeedback(this.parent.ui, this.parent.status),
      onSuccess: (updated: ListItem) => {
        updateItem(this.parent.items, updated.id, updated);
      },
    });
  }

  undo(itemId: ListItem['id']) {
    return updateStoreItemsAsync({
      source: this.parent.api.item.undo(itemId),
      feedback: getStoreFeedback(this.parent.ui, this.parent.status),
      onSuccess: (updated: ListItem) => {
        updateItem(this.parent.items, updated.id, updated);
      },
    });
  }

  toggle(itemId: ListItem['id']) {
    return updateStoreItemsAsync({
      source: this.parent.api.item.toggle(itemId),
      feedback: getStoreFeedback(this.parent.ui, this.parent.status),
      onSuccess: (updated: ListItem) => {
        updateItem(this.parent.items, updated.id, updated);
      },
    });
  }

  increment(itemId: ListItem['id']) {
    return updateStoreItemsAsync({
      source: this.parent.api.item.increment(itemId),
      feedback: getStoreFeedback(this.parent.ui, this.parent.status),
      onSuccess: (updated: ListItem) => {
        updateItem(this.parent.items, updated.id, updated);
      },
    });
  }

  decrement(itemId: ListItem['id']) {
    return updateStoreItemsAsync({
      source: this.parent.api.item.decrement(itemId),
      feedback: getStoreFeedback(this.parent.ui, this.parent.status),
      onSuccess: (updated: ListItem) => {
        updateItem(this.parent.items, updated.id, updated);
      },
    });
  }

  remove(itemId: ListItem['id']) {
    return updateStoreItemsAsync({
      source: this.parent.api.item.remove(itemId),
      feedback: getStoreFeedback(this.parent.ui, this.parent.status),
      onSuccess: (removed: ListItem) => {
        this.parent.items.update(prev => {
          return prev.filter(item => item.id !== removed.id);
        });
      },
    });
  }
}
