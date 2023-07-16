import { InventoryItem } from '@app/features/inventory';
import { ListItem } from '@app/features/list';

export function sortItemsByName<T extends InventoryItem | ListItem>(items: T[]): T[] {
  const newItems = [...items];
  newItems.sort(compareByAscendingName<T>());
  return newItems;
}

type SortingFn<T = any> = (a: T, b: T) => -1 | 0 | 1;

function compareByAscendingName<T extends { name: string }>(): SortingFn<T> {
  return (a: T, b: T): -1 | 0 | 1 => {
    const aa = a.name;
    const bb = b.name;

    if (aa == bb) {
      return 0;
    }

    return aa < bb ? -1 : 1;
  }
}
