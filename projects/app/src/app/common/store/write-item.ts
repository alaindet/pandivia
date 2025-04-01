import { WritableSignal } from '@angular/core';

export function updateItem<T extends { id: string }>(
  items$: WritableSignal<T[]>,
  itemId: T['id'],
  updater: T | ((oldItem: T) => Partial<T>),
): void {
  items$.update(items => items.map(anItem => {
    if (anItem.id !== itemId) {
      return anItem;
    }

    if (typeof updater === 'function') {
      return { ...anItem, ...updater(anItem) };
    }

    return updater;
  }));
}

export function removeItem<T extends { id: string }>(
  items$: WritableSignal<T[]>,
  itemId: T['id'],
): void {
  items$.update(items => items.filter(anItem => anItem.id !== itemId));
}
