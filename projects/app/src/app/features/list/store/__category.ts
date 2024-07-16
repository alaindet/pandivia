import { Subscription } from 'rxjs';

import { updateStore } from '@app/common/store';
import { ListStoreFeatureService } from './__feature';

export class ListCategoryItemsStoreSubfeature {

  constructor(
    private parent: ListStoreFeatureService,
  ) {}

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
