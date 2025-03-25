import {
  computed,
  effect,
  inject,
  Injectable,
  Signal,
  signal,
} from '@angular/core';
import { Observable, of } from 'rxjs';

import {
  CategorizedItems,
  countDoneItems,
  createFilters,
  extractCategories,
  filterItems,
  filterItemsByName,
  filterItemsByQuery,
  getItemByExactId,
  getItemByName,
  groupItemsByCategory,
  provideFeedback,
  shouldFetchCollection,
  sortItemsByName,
} from '@app/common/store';
import {
  FormOption,
  LOADING_STATUS,
  LoadingStatus,
  UnixTimestamp,
} from '@app/common/types';
import { UiStore } from '@app/core/ui/store';
import { DEFAULT_CATEGORY } from '@app/core/constants';
import { UserStore } from '@app/features/user/store';
import { InventoryStore } from '@app/features/inventory/store';
import { ListService } from '../services';
import { LIST_FILTER, ListFilters, ListFilterToken, ListItem } from '../types';
import { ListAllItemsSubstore } from './all';
import { ListCategoryItemsSubstore } from './category';
import { ListSearchFiltersSubstore } from './search-filters';
import { ListItemSubstore } from './item';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class ListStore {
  public api = inject(ListService);
  public ui = inject(UiStore);
  private user = inject(UserStore);
  public inventory = inject(InventoryStore);

  // Substores --------------------------------------------------------------
  allItems = new ListAllItemsSubstore(this);
  categoryItems = new ListCategoryItemsSubstore(this);
  searchFilters = new ListSearchFiltersSubstore(this);
  item = new ListItemSubstore(this);

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
    return shouldFetchCollection(
      this.items(),
      this.status(),
      this.lastUpdated()
    );
  });
  categories = computed(() => extractCategories(this.items()));
  categoryOptions = computed(() => this.computeCategoryOptions());
  filtersList = computed(() => this.computeFiltersList());
  categoryFilter = computed(() => this.filters()[LIST_FILTER.CATEGORY]);
  isDoneFilter = computed(() => !!this.filters()[LIST_FILTER.IS_DONE]);
  counters = computed(() => countDoneItems(this.items()));
  itemModalSuccessCounter$ = toObservable(this.itemModalSuccessCounter);

  // Effects ------------------------------------------------------------------
  constructor() {
    effect(() => this.effectOnGuest());
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

  filterCategoryOptions(name: string): Observable<FormOption[]> {
    const query = name.toLowerCase();
    return of(
      this.categoryOptions().filter((option) => {
        return option.value.toLowerCase().includes(query);
      })
    );
  }

  filterItemsByName(name: string): Signal<ListItem[]> {
    return computed(() => filterItemsByName(this.items(), name));
  }

  getCategorizedFilteredItems(): Signal<CategorizedItems<ListItem>[]> {
    return computed(() => {
      const filters = this.filters();

      return groupItemsByCategory(
        sortItemsByName(
          filterItems(
            this.items(),
            createFilters((f) => [
              f.exact('isDone', filters[LIST_FILTER.IS_DONE]),
              f.exact('category', filters[LIST_FILTER.CATEGORY]),
              f.like('name', filters[LIST_FILTER.SEARCH_QUERY]?.toLowerCase()),
            ])
          )
        )
      );
    });
  }

  private computeCategoryOptions(): FormOption[] {
    const result: FormOption[] = [];
    for (const category of this.categories()) {
      if (category !== DEFAULT_CATEGORY) {
        result.push({ value: category, label: category });
      }
    }
    return result;
  }

  filterItemNameOptions(name: string): Observable<FormOption[]> {
    const query = name.toLowerCase();
    const itemNamesSet = new Set<string>();
    this.items().forEach((item) => itemNamesSet.add(item.name.toLowerCase()));
    const inventoryItems = this.inventory.filterItemsByName(query)();
    const result: FormOption[] = [];

    for (const inventoryItem of inventoryItems) {
      const key = inventoryItem.name.toLowerCase();
      if (!itemNamesSet.has(key)) {
        result.push({ label: inventoryItem.name, value: inventoryItem.id });
      }
    }

    return of(result);
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
