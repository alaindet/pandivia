import { computed, inject, Injectable, Signal, signal } from '@angular/core';

import { CategorizedItems, countDoneItems, createFilters, extractCategories, filterItems, filterItemsByName, filterItemsByQuery, getItemByExactId, getItemByName, groupItemsByCategory, shouldFetchCollection, sortItemsByName } from '@app/common/store';
import { LOADING_STATUS, LoadingStatus, UnixTimestamp } from '@app/common/types';
import { UiStoreFeatureService } from '@app/core/ui/store/__feature';
import { InventoryItem } from '../../inventory';
import { InventoryStoreFeatureService } from '../../inventory/store/__feature';
import { ListService } from '../services';
import { LIST_FILTER, ListFilters, ListFilterToken, ListItem } from '../types';

@Injectable({
  providedIn: 'root',
})
export class ListStoreFeatureService {

  private api = inject(ListService);
  private ui = inject(UiStoreFeatureService);
  private inventory = inject(InventoryStoreFeatureService);

  // State --------------------------------------------------------------------
  items = signal<ListItem[]>([]);
  status = signal<LoadingStatus>(LOADING_STATUS.PRISTINE);
  lastUpdated = signal<UnixTimestamp | null>(null);
  itemModalSuccessCounter = signal(0); // TODO
  filters = signal<ListFilters>({
    [LIST_FILTER.CATEGORY]: null,
    [LIST_FILTER.IS_DONE]: null,
    [LIST_FILTER.SEARCH_QUERY]: null,
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
  categoryFilter = computed(() => this.filters()[LIST_FILTER.CATEGORY]);
  isDoneFilter = computed(() => !!this.filters()[LIST_FILTER.IS_DONE]);
  counters = computed(() => countDoneItems(this.items()));

  getItemById(itemId: string): Signal<ListItem | null> {
    return computed(() => getItemByExactId(this.items(), itemId));
  }

  itemExistsWithExactName(name: string): Signal<ListItem | null> {
    return computed(() => getItemByName(this.items(), name));
  }

  filterCategoriesByName(name: string): Signal<string[]> {
    return computed(() => filterItemsByQuery(this.categories(), name));
  }

  filterItemsByName(name: string): Signal<ListItem[]> {
    return computed(() => filterItemsByName(this.items(), name));
  }

  getCategorizedFilteredItems(): Signal<CategorizedItems<ListItem>[]> {
    return computed(() => {
      const filters = this.filters();

      return groupItemsByCategory(
        sortItemsByName(
          filterItems(this.items(), createFilters(f => [
            f.exact('isDone', filters[LIST_FILTER.IS_DONE]),
            f.exact('category', filters[LIST_FILTER.CATEGORY]),
            f.like('name', filters[LIST_FILTER.SEARCH_QUERY]?.toLowerCase()),
          ])),
        )
      );
    });
  }

  private getItemNamesSet(): Signal<Set<string>> {
    return computed(() => {
      const itemsSet = new Set<string>();
      this.items().forEach(item => itemsSet.add(item.name.toLowerCase()));
      return itemsSet;
    });
  }

  getAutocompleteItems(query: string): Signal<InventoryItem[]> {
    return computed(() => {
      const itemNamesSet = this.getItemNamesSet()();
      const inventoryItems = this.inventory.filterItemsByName(query)();
      return inventoryItems.filter(inventoryItem => {
        const key = inventoryItem.name.toLowerCase();
        return !itemNamesSet.has(key);
      });
    });
  }

  private computeFiltersList(): ListFilterToken[] | null {

    const filters: ListFilterToken[] = [];
    const filtersHash = this.filters();

    if (filtersHash[LIST_FILTER.CATEGORY]) {
      const key = LIST_FILTER.CATEGORY;
      const value = filtersHash[key];
      const label = value ?? undefined;
      filters.push({ key, value, label });
    }

    if (filtersHash[LIST_FILTER.IS_DONE] !== null) {
      const key = LIST_FILTER.IS_DONE;
      const value = filtersHash[key];
      const label = value ? 'list.filter.onlyToDo' : 'list.filter.onlyCompleted';
      filters.push({ key, value, label });
    }

    if (filtersHash[LIST_FILTER.SEARCH_QUERY] !== null) {
      const key = LIST_FILTER.SEARCH_QUERY;
      const value = filtersHash[key];
      const label = `"${value}"`;
      filters.push({ key, value, label });
    }

    return filters.length ? filters : null;
  }

  // // Mutations ----------------------------------------------------------------
  // fetchItems() {
  //   if (!this.shouldFetch()) {
  //     this.status.set(LOADING_STATUS.IDLE);
  //     return;
  //   }

  //   this.ui.loading.start();
  //   this.status.set(LOADING_STATUS.LOADING);

  //   this.api.getItems()
  //     .pipe(finalize(() => this.ui.loading.stop()))
  //     .subscribe({
  //       error: err => {
  //         console.error(err);
  //         this.status.set(LOADING_STATUS.ERROR);
  //       },
  //       next: items => {
  //         this.status.set(LOADING_STATUS.IDLE);
  //         this.lastUpdated.set(Date.now());
  //         this.items.set(items);
  //       },
  //     });
  // }
}
