import { Subscription } from 'rxjs';

import { LOADING_STATUS } from '@app/common/types';
import { ListStoreFeatureService } from './__feature';
import { updateStoreItemsAsync, getStoreFeedback } from './__functions';

export class ListCategoryItemsStoreSubfeature {

  constructor(
    private parent: ListStoreFeatureService,
  ) {}

  // fetch(force = false): Subscription | undefined {

  //   if (!force && !this.parent.shouldFetch()) {
  //     this.parent.status.set(LOADING_STATUS.IDLE);
  //     this.parent.ui.loading.stop();
  //     return;
  //   }

  //   return updateStoreItemsAsync({
  //     source: this.parent.api.allItems.fetch(),
  //     feedback: getStoreFeedback(this.parent.ui, this.parent.status),
  //     messages: ['common.async.fetchItemsSuccess', 'common.async.fetchItemsError'],
  //     onSuccess: items => {
  //       this.parent.lastUpdated.set(Date.now());
  //       this.parent.items.set(items);
  //     },
  //   });
  // }

  // complete(): Subscription {
  //   return updateStoreItemsAsync({
  //     source: this.parent.api.allItems.complete(),
  //     feedback: getStoreFeedback(this.parent.ui, this.parent.status),
  //     messages: ['common.async.editItemsSuccess', 'common.async.editItemsError'],
  //     onSuccess: () => {
  //       this.parent.items.update(prev => prev.map(item => ({ ...item, isDone: true })));
  //     },
  //   });
  // }

  // undo(): Subscription {
  //   return updateStoreItemsAsync({
  //     source: this.parent.api.allItems.undo(),
  //     feedback: getStoreFeedback(this.parent.ui, this.parent.status),
  //     messages: ['common.async.editItemsSuccess', 'common.async.editItemsError'],
  //     onSuccess: () => {
  //       this.parent.items.update(prev => prev.map(item => ({ ...item, isDone: false })));
  //     },
  //   });
  // }

  // remove(): Subscription {
  //   return updateStoreItemsAsync({
  //     source: this.parent.api.allItems.remove(),
  //     feedback: getStoreFeedback(this.parent.ui, this.parent.status),
  //     messages: ['common.async.removeItemsSuccess', 'common.async.removeItemsError'],
  //     onSuccess: () => {
  //       this.parent.lastUpdated.set(Date.now());
  //       this.parent.items.set([]);
  //     },
  //   });
  // }

  // removeCompleted(): Subscription {
  //   return updateStoreItemsAsync({
  //     source: this.parent.api.allItems.removeCompleted(),
  //     feedback: getStoreFeedback(this.parent.ui, this.parent.status),
  //     messages: ['common.async.removeItemsSuccess', 'common.async.removeItemsError'],
  //     onSuccess: () => {
  //       this.parent.items.update(prev => prev.filter(item => !item.isDone));
  //     },
  //   });
  // }
}
