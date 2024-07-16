import { Subscription } from 'rxjs';

import { updateStore } from '@app/common/store';
import { LOADING_STATUS } from '@app/common/types';
import { InventoryStoreFeatureService } from './__feature';

export class InventoryAllItemsStoreSubfeature {

  constructor(
    private parent: InventoryStoreFeatureService,
  ) {}

  fetch(force = false): Subscription | undefined {

    if (!force && !this.parent.shouldFetch()) {
      this.parent.status.set(LOADING_STATUS.IDLE);
      this.parent.ui.loading.stop();
      return;
    }

    return updateStore(this.parent.api.fetchItems())
      .withFeedback(this.parent.feedback)
      .withNotifications(
        'common.async.fetchItemsSuccess',
        'common.async.fetchItemsError',
      )
      .onSuccess(items => {
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
        'common.async.removeItemsError',
      )
      .onSuccess(() => {
        this.parent.lastUpdated.set(Date.now());
        this.parent.items.set([]);
      })
      .update();
  }
}
