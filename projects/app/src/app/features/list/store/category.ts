import { Subscription } from 'rxjs';

import { updateStore } from '@app/common/store';
import { InventoryItem } from '@app/features/inventory';
import { ListStore } from './feature';
import { CreateListItemDto } from '../types';

export class ListCategoryItemsSubstore {

  constructor(
    private parent: ListStore,
  ) {}

  cloneFromInventory(inventoryItems: InventoryItem[]): Subscription {
    const listItems: CreateListItemDto[] = [];
    const itemNamesSet = new Set<string>();
    this.parent.items().forEach(item => itemNamesSet.add(item.name.toLowerCase()));

    for (const inventoryItem of inventoryItems) {

      if (itemNamesSet.has(inventoryItem.name.toLowerCase())) {
        continue;
      }

      const listItem: CreateListItemDto = {
        category: inventoryItem?.category ?? '',
        name: inventoryItem.name,
        amount: 1,
        description: inventoryItem.description,
      };

      listItems.push(listItem);
    }

    return updateStore(this.parent.api.categoryItems.createItemsInBatch(listItems))
      .withFeedback(this.parent.feedback)
        .withNotifications(
          'inventory.cloneCategoryToList.success',
          'inventory.cloneCategoryToList.error',
        )
        .onSuccess(newItemsInCategory => {
          this.parent.items.update(items => [...items, ...newItemsInCategory]);
        })
        .update();
  }

  complete(category: string): Subscription {
    return updateStore(this.parent.api.categoryItems.complete(category))
      .withFeedback(this.parent.feedback)
      .withNotifications(
        'common.async.editItemsSuccess',
        'common.async.editItemsError',
      )
      .onSuccess(() => {
        this.parent.items.update(prev => prev.map(item => {
          if (item.category !== category) return item;
          return { ...item, isDone: true };
        }));
      })
      .update();
  }

  undo(category: string): Subscription {
    return updateStore(this.parent.api.categoryItems.undo(category))
      .withFeedback(this.parent.feedback)
      .withNotifications(
        'common.async.editItemsSuccess',
        'common.async.editItemsError',
      )
      .onSuccess(() => {
        this.parent.items.update(prev => prev.map(item => {
          if (item.category !== category) return item;
          return { ...item, isDone: false };
        }));
      })
      .update();
  }

  remove(category: string): Subscription {
    return updateStore(this.parent.api.categoryItems.remove(category))
      .withFeedback(this.parent.feedback)
      .withNotifications(
        'common.async.removeItemsSuccess',
        'common.async.removeItemsError',
      )
      .onSuccess(() => {
        this.parent.items.update(prev => prev.filter(item => {
          if (item.category !== category) return true;
          return false;
        }));
      })
      .update();
  }

  removeCompleted(category: string): Subscription {
    return updateStore(this.parent.api.categoryItems.removeCompleted(category))
      .withFeedback(this.parent.feedback)
      .withNotifications(
        'common.async.removeItemsSuccess',
        'common.async.removeItemsError',
      )
      .onSuccess(() => {
        this.parent.items.update(prev => prev.filter(item => {
          if (item.category !== category) return true;
          return !item.isDone;
        }));
      })
      .update();
  }
}
