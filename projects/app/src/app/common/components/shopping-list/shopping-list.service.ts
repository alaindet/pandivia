import { Injectable, OnDestroy, signal } from '@angular/core';

import { DataSource, EventSource, OnceSource } from '@app/common/sources';

@Injectable()
export class ShoppingListService implements OnDestroy {

  private once = new OnceSource();

  isSelectable = signal(false);

  private _selectionMap$ = new DataSource<{ [key: string]: boolean }>({}, this.once.event$);
  selectionMap$ = this._selectionMap$.data$;

  private _selectionChanged$ = new EventSource<string[]>(this.once.event$);
  selectionChanged$ = this._selectionChanged$.event$;

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
    const selectionMap = this._selectionMap$.getCurrent();
    console.log('selectionMap before', selectionMap); // TODO: Remove
    const newMap = { ...selectionMap, [itemId]: isSelected };
    console.log('selectionMap after', newMap); // TODO: Remove
    this._selectionMap$.next(newMap);
    this._selectionChanged$.next(this.selectionMapToList(selectionMap));
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
