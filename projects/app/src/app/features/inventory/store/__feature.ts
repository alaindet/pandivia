import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { finalize } from 'rxjs';

import { CategorizedItems, createFilters, extractCategories, filterItems, filterItemsByName, filterItemsByQuery, getItemByExactId, getItemByName, groupItemsByCategory, shouldFetchCollection, sortItemsByName } from '@app/common/store';
import { LOADING_STATUS, LoadingStatus, UnixTimestamp } from '@app/common/types';
import { UiStoreFeatureService } from '@app/core/ui/store/__feature';
import { InventoryService } from '../services';
import { INVENTORY_FILTER, InventoryFilters, InventoryFilterToken, InventoryItem } from '../types';

@Injectable({
  providedIn: 'root',
})
export class InventoryStoreFeatureService {

  private api = inject(InventoryService);
  private ui = inject(UiStoreFeatureService);

  // State --------------------------------------------------------------------
  items = signal<InventoryItem[]>([]);
  status = signal<LoadingStatus>(LOADING_STATUS.PRISTINE);
  lastUpdated = signal<UnixTimestamp | null>(null);
  itemModalSuccessCounter = signal(0); // TODO
  filters = signal<InventoryFilters>({
    [INVENTORY_FILTER.CATEGORY]: null,
    [INVENTORY_FILTER.SEARCH_QUERY]: null,
  });

  // Derived state ------------------------------------------------------------
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

  getItemById(itemId: string): Signal<InventoryItem | null> {
    return computed(() => getItemByExactId(this.items(), itemId));
  }

  itemExistsWithExactName(name: string): Signal<InventoryItem | null> {
    return computed(() => getItemByName(this.items(), name));
  }

  filterCategoriesByName(name: string): Signal<string[]> {
    return computed(() => filterItemsByQuery(this.categories(), name));
  }

  filterItemsByName(name: string): Signal<InventoryItem[]> {
    return computed(() => filterItemsByName(this.items(), name));
  }

  getCategorizedFilteredItems(): Signal<CategorizedItems<InventoryItem>[]> {
    return computed(() => {
      const filters = this.filters();
      const category= filters[INVENTORY_FILTER.CATEGORY] ?? '';
      const query = (filters[INVENTORY_FILTER.SEARCH_QUERY] ?? '').toLowerCase();

      return groupItemsByCategory(
        sortItemsByName(
          filterItems(this.items(), createFilters(f => [
            f.exact('category', category),
            f.like('name', query),
          ])),
        )
      );
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

  // Mutations ----------------------------------------------------------------
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
}
