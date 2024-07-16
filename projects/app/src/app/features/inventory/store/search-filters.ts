import { INVENTORY_FILTER, InventoryFilter } from '../types';
import { InventoryStore } from './feature';

export class InventorySearchFiltersStoreSubfeature {

  constructor(
    private parent: InventoryStore,
  ) { }

  setCategory(category: string) {
    this.updateByName(INVENTORY_FILTER.CATEGORY, category);
  }

  clearCategory() {
    this.updateByName(INVENTORY_FILTER.CATEGORY, null);
  }

  setSearchQuery(searchQuery: string) {
    this.updateByName(INVENTORY_FILTER.SEARCH_QUERY, searchQuery);
  }

  clearSearchQuery() {
    this.updateByName(INVENTORY_FILTER.SEARCH_QUERY, null);
  }

  clearByName(filterName: InventoryFilter) {
    this.updateByName(filterName, null);
  }

  clearAll() {
    this.parent.filters.set({
      [INVENTORY_FILTER.CATEGORY]: null,
      [INVENTORY_FILTER.SEARCH_QUERY]: null,
    });
  }

  private updateByName<T = any>(filterName: InventoryFilter, value: T) {
    this.parent.filters.update(prev => ({
      ...prev,
      [filterName]: value,
    }));
  }
}
