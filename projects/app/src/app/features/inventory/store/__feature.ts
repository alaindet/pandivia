import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';

import { UiStoreFeatureService } from '@app/core/ui/store/__feature';
import { extractCategories, filterItems, filterItemsByName, getItemByExactId, getItemByName, shouldFetchCollection } from '@app/common/store';
import { LOADING_STATUS, LoadingStatus, UnixTimestamp } from '@app/common/types';
import { groupItemsByCategory, sortItemsByName } from '../../../core';
import { CategorizedListItems } from '../../list';
import { INVENTORY_FILTER, InventoryFilters, InventoryFilterToken, InventoryItem } from '../types';
import { InventoryService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class InventoryStoreFeatureService {

  private api = inject(InventoryService);
  private ui = inject(UiStoreFeatureService);

  // State
  items = signal<InventoryItem[]>([]);
  status = signal<LoadingStatus>(LOADING_STATUS.PRISTINE);
  lastUpdated = signal<UnixTimestamp | null>(null);
  itemModalSuccessCounter = signal(0); // TODO
  filters = signal<InventoryFilters>({
    [INVENTORY_FILTER.CATEGORY]: null,
    [INVENTORY_FILTER.SEARCH_QUERY]: null,
  });

  // Derived state
  isLoaded = computed(() => this.status() === LOADING_STATUS.IDLE);
  isLoading = computed(() => this.status() === LOADING_STATUS.LOADING);
  isError = computed(() => this.status() === LOADING_STATUS.ERROR);
  shouldFetch = computed(() => {
    return shouldFetchCollection(this.items(), this.status(), this.lastUpdated());
  });
  categories = computed(() => extractCategories(this.items()));
  filtersList = computed(() => this.computeFiltersList());
  categoryFilter = computed(() => this.filters()[INVENTORY_FILTER.CATEGORY]);
  counters = computed(() => ({ completed: null, total: this.items().length }));

  // TODO: Return a computed()
  getItemById(itemId: string): InventoryItem | null {
    return getItemByExactId(this.items(), itemId);
  }

  // TODO: Add to filtering section
  // TODO: Return a computed()
  itemExistsWithExactName(name: string): InventoryItem | null {
    return getItemByName(this.items(), name);
  }

  // TODO: Add to filtering section
  // TODO: Return a computed()
  filterCategoriesByName(name: string): string[] {
    return filterItems(this.categories(), name);
  }

  // TODO: Add to filtering section
  // TODO: Return a computed()
  filterItemsByName(name: string): InventoryItem[] {
    return filterItemsByName(this.items(), name);
  }

  // TODO: Add to filtering section
  // TODO: Return a computed()
  getCategorizedFilteredItems(): CategorizedListItems[] {
    const filters = this.filters();

    const categoryFilter = filters[INVENTORY_FILTER.CATEGORY];
    const searchQueryFilter = (filters[INVENTORY_FILTER.SEARCH_QUERY] ?? '').toLowerCase();

    const filteredItems: InventoryItem[] = this.items().filter(item => {

      if (categoryFilter !== null) {
        if (item.category !== categoryFilter) {
          return false;
        }
      }

      if (searchQueryFilter !== '') {
        if (!item.name.toLowerCase().includes(searchQueryFilter)) {
          return false;
        }
      }

      return true;
    });

    const sortedItems = sortItemsByName(filteredItems);
    return groupItemsByCategory(sortedItems);
  }

  fetchItems() {
    if (!this.shouldFetch()) {
      this.status.set(LOADING_STATUS.IDLE);
      return;
    }

    this.ui.loading.start();
    this.status.set(LOADING_STATUS.LOADING);

    this.api.getItems()
      .pipe(finalize(() => this.ui.loading.stop()))
      .subscribe({
        error: err => {
          console.error(err);
          this.status.set(LOADING_STATUS.ERROR);
        },
        next: items => {
          this.status.set(LOADING_STATUS.IDLE);
          this.lastUpdated.set(Date.now());
          this.items.set(items);
        },
      });
  }

  private computeFiltersList(): InventoryFilterToken[] | null {
    const filters: InventoryFilterToken[] = [];
    const filtersHash = this.filters();

    if (filtersHash[INVENTORY_FILTER.CATEGORY]) {
      const key = INVENTORY_FILTER.CATEGORY;
      const value = filtersHash[key];
      const label = value ?? undefined;
      filters.push({ key, value, label });
    }

    if (filtersHash[INVENTORY_FILTER.SEARCH_QUERY] !== null) {
      const key = INVENTORY_FILTER.SEARCH_QUERY;
      const value = filtersHash[key];
      const label = `"${value}"`;
      filters.push({ key, value, label });
    }

    return filters.length ? filters : null;
  }
}
