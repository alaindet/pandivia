import { Subscription } from 'rxjs';
import { InventoryStoreFeatureService } from './__feature';
import { updateStore } from '../../../common/store';

export class InventoryCategoryItemsStoreSubfeature {

  constructor(
    private parent: InventoryStoreFeatureService,
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
