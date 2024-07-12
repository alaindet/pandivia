import { computed, inject, Injectable, signal } from '@angular/core';

import { LOADING_STATUS, LoadingStatus, UnixTimestamp } from '@app/common/types';
import { CACHE_MAX_AGE, groupItemsByCategory, sortItemsByName } from '../../../core';
import { CategorizedListItems } from '../../list';
import { INVENTORY_FILTER, InventoryFilters, InventoryFilterToken, InventoryItem } from '../types';
import { InventoryService } from '../services';
import { UiStoreFeatureService } from '../../../core/ui/store/__feature';
import { finalize } from 'rxjs';

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
  shouldFetch = computed(() => this.computeShouldFetch());
  categories = computed(() => this.computeCategories());
  filtersList = computed(() => this.computeFiltersList());
  categoryFilter = computed(() => this.filters()[INVENTORY_FILTER.CATEGORY]);
  counters = computed(() => ({ completed: null, total: this.items().length }));

  getItemById(itemId: string): InventoryItem | null {
    const item = this.items().find(item => item.id === itemId);
    return item ?? null;
  }

  // TODO: Add to filtering section
  itemExistsWithName(name: string): InventoryItem | null {
    const query = name.toLowerCase();
    const item = this.items().find(item => item.name.toLowerCase() === query);
    return item ?? null;
  }

  // TODO: Add to filtering section
  getCategoriesByName(name: string): string[] {
    const query = name.toLowerCase();

    const searchByCategory = (item: InventoryItem) => {
      return item.category?.toLowerCase()?.includes(query);
    };

    const categories = new Set<string>();

    this.items().forEach(item => {
      if (searchByCategory(item)) {
        categories.add(item.category!);
      }
    });

    return [...categories.values()];
  }

  // TODO: Add to filtering section
  getItemsByName(name: string): InventoryItem[] {
    const query = name.toLowerCase();

    const searchName = (item: InventoryItem) => {
      return item.name?.toLowerCase()?.includes(query);
    };

    return this.items().filter(searchName);
  }

  // TODO: Add to filtering section
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
    if (!this.computeShouldFetch()) {
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

  private computeShouldFetch(): boolean {

    if (this.status() === LOADING_STATUS.PRISTINE) {
      return true;
    }

    if (this.lastUpdated() === null) {
      return true;
    }

    if (Date.now() - this.lastUpdated()! > CACHE_MAX_AGE) {
      return true;
    }

    if (!this.items().length) {
      return true;
    }

    return false;
  }

  private computeCategories(): string[] {
    const categories = new Set<string>();

    this.items().forEach(item => {
      if (item.category && !categories.has(item.category)) {
        categories.add(item.category);
      }
    });

    return Object.keys(categories);
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
