import { Subscription } from 'rxjs';

import { DEFAULT_CATEGORY } from '@app/core/constants';
import { updateStore } from '@common/store';
import { InventoryItem } from '@app/features/inventory';
import { ListStore } from './feature';
import { CreateListItemDto } from '../types';

export class ListCategoryItemsSubstore {
  constructor(private parent: ListStore) {}

  cloneFromInventory(inventoryItems: InventoryItem[]): Subscription {
    const itemNamesSet = new Set<string>();
    this.parent
      .items()
      .forEach((item) => itemNamesSet.add(item.name.toLowerCase()));

    // Pick only the inventory items that do not yet exist in the List
    // Map the inventory items to a list of CreateListItemDto types
    const listItems: CreateListItemDto[] = inventoryItems
      .filter((item) => !itemNamesSet.has(item.name.toLowerCase()))
      .map((inventoryItem) => ({
        category: inventoryItem?.category ?? '',
        name: inventoryItem.name,
        amount: 1,
        description: inventoryItem.description,
      }));

    return this.createMany(listItems);
  }

  createMany(listItems: CreateListItemDto[]): Subscription {
    const category = listItems.length
      ? listItems[0].category
      : DEFAULT_CATEGORY;

    return updateStore(this.parent.api.categoryItems.createMany(listItems))
      .withFeedback(this.parent.feedback)
      .withNotifications(
        ['inventory.cloneCategoryToList.success', { categoryName: category }],
        ['inventory.cloneCategoryToList.error', { categoryName: category }]
      )
      .onSuccess((newItemsInCategory) => {
        this.parent.items.update((items) => [...items, ...newItemsInCategory]);
      })
      .update();
  }

  complete(category: string): Subscription {
    return updateStore(this.parent.api.categoryItems.complete(category))
      .withFeedback(this.parent.feedback)
      .withNotifications(
        'common.async.editItemsSuccess',
        'common.async.editItemsError'
      )
      .onSuccess(() => {
        this.parent.items.update((prev) =>
          prev.map((item) => {
            if (item.category !== category) return item;
            return { ...item, isDone: true };
          })
        );
      })
      .update();
  }

  undo(category: string): Subscription {
    return updateStore(this.parent.api.categoryItems.undo(category))
      .withFeedback(this.parent.feedback)
      .withNotifications(
        'common.async.editItemsSuccess',
        'common.async.editItemsError'
      )
      .onSuccess(() => {
        this.parent.items.update((prev) =>
          prev.map((item) => {
            if (item.category !== category) return item;
            return { ...item, isDone: false };
          })
        );
      })
      .update();
  }

  remove(category: string): Subscription {
    return updateStore(this.parent.api.categoryItems.remove(category))
      .withFeedback(this.parent.feedback)
      .withNotifications(
        'common.async.removeItemsSuccess',
        'common.async.removeItemsError'
      )
      .onSuccess(() => {
        this.parent.items.update((prev) =>
          prev.filter((item) => {
            if (item.category !== category) return true;
            return false;
          })
        );
      })
      .update();
  }

  removeCompleted(category: string): Subscription {
    return updateStore(this.parent.api.categoryItems.removeCompleted(category))
      .withFeedback(this.parent.feedback)
      .withNotifications(
        'common.async.removeItemsSuccess',
        'common.async.removeItemsError'
      )
      .onSuccess(() => {
        this.parent.items.update((prev) =>
          prev.filter((item) => {
            if (item.category !== category) return true;
            return !item.isDone;
          })
        );
      })
      .update();
  }
}
