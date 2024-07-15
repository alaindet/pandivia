import { Subscription } from 'rxjs';

import { ListStoreFeatureService } from './__feature';
import { getStoreFeedback, updateStoreItemsAsync } from './__functions';

export class ListCategoryItemsStoreSubfeature {

  constructor(
    private parent: ListStoreFeatureService,
  ) {}

  complete(category: string): Subscription {
    return updateStoreItemsAsync({
      source: this.parent.api.categoryItems.complete(category),
      feedback: getStoreFeedback(this.parent.ui, this.parent.status),
      messages: ['common.async.editItemsSuccess', 'common.async.editItemsError'],
      onSuccess: () => {
        this.parent.items.update(prev => prev.map(item => {
          if (item.category !== category) {
            return item;
          }
          return { ...item, isDone: true };
        }));
      },
    });
  }

  undo(category: string): Subscription {
    return updateStoreItemsAsync({
      source: this.parent.api.categoryItems.undo(category),
      feedback: getStoreFeedback(this.parent.ui, this.parent.status),
      messages: ['common.async.editItemsSuccess', 'common.async.editItemsError'],
      onSuccess: () => {
        this.parent.items.update(prev => prev.map(item => {
          if (item.category !== category) {
            return item;
          }
          return { ...item, isDone: false };
        }));
      },
    });
  }

  remove(category: string): Subscription {
    return updateStoreItemsAsync({
      source: this.parent.api.categoryItems.remove(category),
      feedback: getStoreFeedback(this.parent.ui, this.parent.status),
      messages: ['common.async.removeItemsSuccess', 'common.async.removeItemsError'],
      onSuccess: () => {
        this.parent.items.update(prev => prev.filter(item => {
          if (item.category !== category) return true;
          return false;
        }));
      },
    });
  }

  removeCompleted(category: string): Subscription {
    return updateStoreItemsAsync({
      source: this.parent.api.categoryItems.removeCompleted(category),
      feedback: getStoreFeedback(this.parent.ui, this.parent.status),
      messages: ['common.async.removeItemsSuccess', 'common.async.removeItemsError'],
      onSuccess: () => {
        this.parent.items.update(prev => prev.filter(item => {
          if (item.category !== category) return true;
          return !item.isDone;
        }));
      },
    });
  }
}
