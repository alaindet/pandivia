import { Subscription } from 'rxjs';
import { inject } from '@angular/core';

import { createFilters, filterItems, updateStore } from '@app/common/store';
import { ListStore } from '@app/features/list/store';
import { InventoryStore } from './feature';

export class InventoryCategoryItemsSubstore {

  private listStore = inject(ListStore);

  constructor(
    private parent: InventoryStore,
  ) {}

  cloneToList(category: string): Subscription {
    return this.listStore.categoryItems.cloneFromInventory(
      filterItems(this.parent.items(), createFilters(f => [
        f.exact('category', category),
      ])),
    );
  }

  remove(category: string): Subscription {
    return updateStore(this.parent.api.removeByCategory(category))
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
}
