import { Injectable, OnDestroy, signal } from '@angular/core';

import { EventSource, OnceSource } from '@app/common/sources';

@Injectable()
export class ShoppingListService implements OnDestroy {

  private once = new OnceSource();
  selectionChange = new EventSource<any>(this.once.event$);

  isSelectable = signal(false);
  // createSignalEvent

  ngOnDestroy() {
    this.once.trigger();
  }

  enableSelectability() {
    this.isSelectable.set(true);
  }

  disableSelectability() {
    this.isSelectable.set(false);
  }

  selectItem(itemId: string, isSelected: boolean) {
    console.log(itemId, isSelected); // TODO: Remove
  }
}
