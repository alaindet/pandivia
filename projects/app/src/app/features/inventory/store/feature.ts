import {
  computed,
  effect,
  inject,
  Injectable,
  Signal,
  signal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';
import {
  FormOption,
  LOADING_STATUS,
  LoadingStatus,
  UnixTimestamp,
} from '@common/types';

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
  shouldFetchCollection,
  sortItemsByName,
} from '@app/common/store';
import { provideFeedback } from '@app/common/store';
import { UserStore } from '@app/features/user/store';
import { UiStore } from '@app/core/ui/store';
import { InventoryService } from '../services';
import {
  INVENTORY_FILTER,
  InventoryFilters,
  InventoryFilterToken,
  InventoryItem,
} from '../types';
import { InventoryAllItemsSubstore } from './all';
import { InventoryCategoryItemsSubstore } from './category';
import { InventorySearchFiltersSubstore } from './search-filters';
import { InventoryItemSubstore } from './item';
import { DEFAULT_CATEGORY } from '@app/core/constants';

@Injectable({
  providedIn: 'root',
})
export class InventoryStore {
  public api = inject(InventoryService);
  public ui = inject(UiStore);
  private user = inject(UserStore);
  private transloco = inject(TranslocoService);

  // Substores --------------------------------------------------------------
  allItems = new InventoryAllItemsSubstore(this);
  categoryItems = new InventoryCategoryItemsSubstore(this);
  searchFilters = new InventorySearchFiltersSubstore(this);
  item = new InventoryItemSubstore(this, this.transloco);

  // State --------------------------------------------------------------------
  items = signal<InventoryItem[]>([]);
  status = signal<LoadingStatus>(LOADING_STATUS.PRISTINE);
  lastUpdated = signal<UnixTimestamp | null>(null);
  itemModalSuccessCounter = signal(0); // TODO
  filters = signal<InventoryFilters>({
    [INVENTORY_FILTER.CATEGORY]: null,
    [INVENTORY_FILTER.SEARCH_QUERY]: null,
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
  categoryFilter = computed(() => this.filters()[INVENTORY_FILTER.CATEGORY]);
  counters = computed(() => countDoneItems(this.items()));
  itemModalSuccessCounter$ = toObservable(this.itemModalSuccessCounter);

  // Effects ------------------------------------------------------------------
  constructor() {
    effect(() => this.effectOnGuest());
  }

  // Derived state factories --------------------------------------------------
  getItemById(itemId: string): Signal<InventoryItem | null> {
    return computed(() => getItemByExactId(this.items(), itemId));
  }

  filterItemsByCategory(category: string): InventoryItem[] {
    return filterItems(
      this.items(),
      createFilters((f) => [f.exact('category', category)])
    );
  }

  itemExistsWithExactName(name: string): Signal<InventoryItem | null> {
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

  filterItemsByName(name: string): Signal<InventoryItem[]> {
    return computed(() => filterItemsByName(this.items(), name));
  }

  getCategorizedFilteredItems(): Signal<CategorizedItems<InventoryItem>[]> {
    return computed(() => {
      const filters = this.filters();

      return groupItemsByCategory(
        sortItemsByName(
          filterItems(
            this.items(),
            createFilters((f) => [
              f.exact('category', filters[INVENTORY_FILTER.CATEGORY]),
              f.like('name', filters[INVENTORY_FILTER.SEARCH_QUERY]),
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
  reset(): void {
    this.items.set([]);
    this.status.set(LOADING_STATUS.PRISTINE);
    this.lastUpdated.set(null);
    this.itemModalSuccessCounter.set(0);
    this.filters.set({
      [INVENTORY_FILTER.CATEGORY]: null,
      [INVENTORY_FILTER.SEARCH_QUERY]: null,
    });
  }

  effectOnGuest(): void {
    if (this.user.isGuest()) {
      this.reset();
    }
  }
}
