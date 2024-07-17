import { Subscription } from 'rxjs';

import { updateStore } from '@app/common/store';
import { InventoryStore } from './feature';

export class InventoryCategoryItemsSubstore {

  constructor(
    private parent: InventoryStore,
  ) { }

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
