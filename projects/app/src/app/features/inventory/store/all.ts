import { Subscription } from 'rxjs';
import { LOADING_STATUS } from '@fixcommon/types';

import { updateStore } from '@app/common/store';
import { InventoryStore } from './feature';

export class InventoryAllItemsSubstore {
  constructor(private parent: InventoryStore) {}

  fetch(force = false): Subscription | undefined {
    if (!force && !this.parent.shouldFetch()) {
      this.parent.status.set(LOADING_STATUS.IDLE);
      this.parent.ui.loader.stop();
      return;
    }

    return updateStore(this.parent.api.fetchItems())
      .withFeedback(this.parent.feedback)
      .withNotifications(
        'common.async.fetchItemsSuccess',
        'common.async.fetchItemsError'
      )
      .onSuccess((items) => {
        this.parent.lastUpdated.set(Date.now());
        this.parent.items.set(items);
      })
      .update();
  }

  remove(): Subscription {
    return updateStore(this.parent.api.removeAll())
      .withFeedback(this.parent.feedback)
      .withNotifications(
        'common.async.removeItemsSuccess',
        'common.async.removeItemsError'
      )
      .onSuccess(() => {
        this.parent.lastUpdated.set(Date.now());
        this.parent.items.set([]);
      })
      .update();
  }
}
