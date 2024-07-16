import { Subscription } from 'rxjs';

import { updateStore } from '@app/common/store';
import { LOADING_STATUS } from '@app/common/types';
import { ListStoreFeatureService } from './feature';

export class ListAllItemsStoreSubfeature {

  constructor(
    private parent: ListStoreFeatureService,
  ) {}

  fetch(force = false): Subscription | undefined {

    if (!force && !this.parent.shouldFetch()) {
      this.parent.status.set(LOADING_STATUS.IDLE);
      this.parent.ui.loading.stop();
      return;
    }

    return updateStore(this.parent.api.allItems.fetch())
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

  complete(): Subscription {
    return updateStore(this.parent.api.allItems.complete())
      .withFeedback(this.parent.feedback)
      .withNotifications(
        'common.async.editItemsSuccess',
        'common.async.editItemsError',
      )
      .onSuccess(() => {
        this.parent.items.update(items => {
          return items.map(item => ({ ...item, isDone: true }));
        });
      })
      .update();
  }

  undo(): Subscription {
    return updateStore(this.parent.api.allItems.undo())
      .withFeedback(this.parent.feedback)
      .withNotifications(
        'common.async.editItemsSuccess',
        'common.async.editItemsError',
      )
      .onSuccess(() => {
        this.parent.items.update(items => {
          return items.map(item => ({ ...item, isDone: false }));
        });
      })
      .update();
  }

  remove(): Subscription {
    return updateStore(this.parent.api.allItems.remove())
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

  removeCompleted(): Subscription {
    return updateStore(this.parent.api.allItems.removeCompleted())
      .withFeedback(this.parent.feedback)
      .withNotifications(
        'common.async.removeItemsSuccess',
        'common.async.removeItemsError',
      )
      .onSuccess(() => {
        this.parent.items.update(items => {
          return items.filter(item => !item.isDone);
        });
      })
      .update();
  }
}
