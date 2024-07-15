import { computed, effect, inject, Injectable, Signal, signal } from '@angular/core';

import { CategorizedItems, countDoneItems, createFilters, extractCategories, filterItems, filterItemsByName, filterItemsByQuery, getItemByExactId, getItemByName, groupItemsByCategory, provideFeedback, shouldFetchCollection, sortItemsByName } from '@app/common/store';
import { LOADING_STATUS, LoadingStatus, UnixTimestamp } from '@app/common/types';
import { UiStoreFeatureService } from '@app/core/ui/store/__feature';
import { UserStoreFeatureService } from '@app/features/user/store/__feature';
import { InventoryItem } from '../../inventory';
import { InventoryStoreFeatureService } from '@app/features/inventory/store/__feature';
import { ListService } from '../services';
import { LIST_FILTER, ListFilters, ListFilterToken, ListItem } from '../types';
import { ListAllItemsStoreSubfeature } from './__all';
import { ListCategoryItemsStoreSubfeature } from './__category';
import { ListSearchFiltersStoreSubfeature } from './__search-filters';
import { ListItemStoreSubfeature } from './__item';

@Injectable({
  providedIn: 'root',
})
export class ListStoreFeatureService {

  public api = inject(ListService);
  public ui = inject(UiStoreFeatureService);
  private user = inject(UserStoreFeatureService);
  public inventory = inject(InventoryStoreFeatureService);

  // Subfeatures --------------------------------------------------------------
  allItems = new ListAllItemsStoreSubfeature(this);
  categoryItems = new ListCategoryItemsStoreSubfeature(this);
  searchFilters = new ListSearchFiltersStoreSubfeature(this);
  item = new ListItemStoreSubfeature(this);

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

  // Feedback -----------------------------------------------------------------
  feedback = provideFeedback(this.ui, this.status);

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

  // Effects ------------------------------------------------------------------
  constructor() {
    effect(() => this.effectOnGuest(), { allowSignalWrites: true });
  }

  // Derived state factories --------------------------------------------------
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

  // Mutations ----------------------------------------------------------------
  reset(): void {
    this.items.set([]);
    this.status.set(LOADING_STATUS.PRISTINE);
    this.lastUpdated.set(null);
    this.itemModalSuccessCounter.set(0);
    this.filters.set({
      [LIST_FILTER.CATEGORY]: null,
      [LIST_FILTER.IS_DONE]: null,
      [LIST_FILTER.SEARCH_QUERY]: null,
    });
  }

  effectOnGuest(): void {
    if (this.user.isGuest()) {
      this.reset();
    }
  }
}
