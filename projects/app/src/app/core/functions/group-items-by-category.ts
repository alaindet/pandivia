import { InventoryItem } from '@app/features/inventory';
import { CategorizedListItems, ListItem } from '@app/features/list';

export function groupItemsByCategory(items: (InventoryItem | ListItem)[]): CategorizedListItems[] {
  const grouped: { [category: string]: any[] } = {};

  for (const item of items) {
    const category = item.category ?? 'no-category';

    if (!grouped[category]) {
      grouped[category] = [];
    }

    grouped[category].push(item);
  };

  return Object.entries(grouped).map(([category, items]) => {
    return { category, items };
  });
}
