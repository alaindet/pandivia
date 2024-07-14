import { computed, inject, Injectable, signal } from '@angular/core';

import { ListService } from '../services';
import { UiStoreFeatureService } from '../../../core/ui/store/__feature';
import { LIST_FILTER, ListFilters, ListFilterToken, ListItem } from '../types';
import { LOADING_STATUS, LoadingStatus, UnixTimestamp } from '../../../common/types';
import { CACHE_MAX_AGE } from '../../../core';

@Injectable({
  providedIn: 'root',
})
export class ListStoreFeatureService {

  private api = inject(ListService);
  private ui = inject(UiStoreFeatureService);

  // State
  items = signal<ListItem[]>([]);
  status = signal<LoadingStatus>(LOADING_STATUS.PRISTINE);
  lastUpdated = signal<UnixTimestamp | null>(null);
  itemModalSuccessCounter = signal(0); // TODO
  filters = signal<ListFilters>({
    [LIST_FILTER.CATEGORY]: null,
    [LIST_FILTER.IS_DONE]: null,
    [LIST_FILTER.SEARCH_QUERY]: null,
  });

  // Derived state
  isLoaded = computed(() => this.status() === LOADING_STATUS.IDLE);
  isLoading = computed(() => this.status() === LOADING_STATUS.LOADING);
  isError = computed(() => this.status() === LOADING_STATUS.ERROR);
  shouldFetch = computed(() => this.computeShouldFetch());
  categories = computed(() => this.computeCategories());
  filtersList = computed(() => this.computeFiltersList());

  // TODO: Add to filtering section
  itemExistsWithName(name: string): ListItem | null {
    const query = name.toLowerCase();
    const item = this.items().find(item => item.name.toLowerCase() === query);
    return item ?? null;
  }

  // TODO: Add to filtering section
  filterCategoriesByName(name: string): string[] {
    const query = name.toLowerCase();

    const searchByCategory = (item: ListItem) => {
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
  filterItemsByName(name: string): ListItem[] {
    const query = name.toLowerCase();

    const searchName = (item: ListItem) => {
      return item.name?.toLowerCase()?.includes(query);
    };

    return this.items().filter(searchName);
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

  private computeFiltersList(): ListFilterToken[] | null {
    const filters: ListFilterToken[] = [];
    const filtersHash = this.filters();

    if (filtersHash[LIST_FILTER.CATEGORY] !== null) {
      const key = LIST_FILTER.CATEGORY;
      const value = filtersHash[key];
      const label = value ?? undefined;
      filters.push({ key, value, label });
    }

    if (filtersHash[LIST_FILTER.IS_DONE] !== null) {
      const key = LIST_FILTER.IS_DONE;
      const value = filtersHash[key];
      const label = value
        ? 'list.filter.onlyToDo'
        : 'list.filter.onlyCompleted';
      filters.push({ key, value, label });
    }

    if (filtersHash[LIST_FILTER.SEARCH_QUERY] !== null) {
      const key = LIST_FILTER.SEARCH_QUERY;
      const value = filtersHash[key];
      const label = `"${value}"`;
      filters.push({ key, value, label });
    }

    if (!filters.length) {
      return null;
    }

    return filters;
  }
}
