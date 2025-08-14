import { Subscription } from 'rxjs';
import { LOADING_STATUS } from '@common/types';

import { updateStore } from '@app/common/store';
import { InventoryStore } from './feature';

export class InventoryAllItemsSubstore {
  constructor(private parent: InventoryStore) {}

  fetch({ force, withNotifications }: {
    force: boolean;
    withNotifications: boolean;
  }): Subscription | undefined {

    if (!force && !this.parent.shouldFetch()) {
      this.parent.status.set(LOADING_STATUS.IDLE);
      this.parent.ui.loader.stop();
      return;
    }

    const storeUpdater = updateStore(this.parent.api.fetchItems())
      .withFeedback(this.parent.feedback);

    if (withNotifications) {
      storeUpdater.withNotifications(
        'common.async.fetchItemsSuccess',
        'common.async.fetchItemsError'
      );
    }

    storeUpdater.onSuccess((items) => {
      this.parent.lastUpdated.set(Date.now());
      this.parent.items.set(items);
    });

    return storeUpdater.update();
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
