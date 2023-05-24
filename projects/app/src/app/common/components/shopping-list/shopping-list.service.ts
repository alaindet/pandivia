import { Injectable, OnDestroy, signal } from '@angular/core';

import { EventSource, OnceSource } from '@app/common/sources';
import { effectOnChange } from '@app/common/utils';

@Injectable()
export class ShoppingListService implements OnDestroy {

  private once = new OnceSource();
  selectionChange = new EventSource<any>(this.once.event$);

  isSelectable = signal(false);
  selectionMap = signal<{ [key: string]: boolean }>({});
  selectionChanged = effectOnChange(this.selectionMap, selectionMap => {
    this.selectionChange.next(this.selectionMapToList(selectionMap));
  });

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

    console.log('itemId', itemId, 'isSelected', isSelected); // TODO: Remove

    this.selectionMap.update(selectionMap => {
      const newMap = { ...selectionMap, [itemId]: isSelected };

      console.log('selectionMap', selectionMap); // TODO: Remove
      return { ...selectionMap, [itemId]: isSelected };
    });
  }

  private selectionMapToList(selection: { [key: string]: boolean }): string[] {
    const result: string[] = [];

    for (const itemId of Object.keys(selection)) {
      if (selection[itemId]) {
        result.push(itemId);
      }
    }

    return result;
  }
}
