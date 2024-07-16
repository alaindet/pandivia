import { computed, effect, inject, Injectable, Signal, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

import { CategorizedItems, countDoneItems, createFilters, extractCategories, filterItems, filterItemsByName, filterItemsByQuery, getItemByExactId, getItemByName, groupItemsByCategory, shouldFetchCollection, sortItemsByName } from '@app/common/store';
import { provideFeedback } from '@app/common/store';
import { LOADING_STATUS, LoadingStatus, UnixTimestamp } from '@app/common/types';
import { UiStoreFeatureService } from '@app/core/ui/store/__feature';
import { InventoryService } from '../services';
import { INVENTORY_FILTER, InventoryFilters, InventoryFilterToken, InventoryItem } from '../types';
import { InventoryAllItemsStoreSubfeature } from './__all';
import { InventoryCategoryItemsStoreSubfeature } from './__category';
import { InventorySearchFiltersStoreSubfeature } from './__search-filters';
import { InventoryItemStoreSubfeature } from './__item';
import { UserStoreFeatureService } from '../../user/store/__feature';

@Injectable({
  providedIn: 'root',
})
export class InventoryStoreFeatureService {

  public api = inject(InventoryService);
  public ui = inject(UiStoreFeatureService);
  private user = inject(UserStoreFeatureService);
  private transloco = inject(TranslocoService);

  // Subfeatures --------------------------------------------------------------
  allItems = new InventoryAllItemsStoreSubfeature(this);
  categoryItems = new InventoryCategoryItemsStoreSubfeature(this);
  searchFilters = new InventorySearchFiltersStoreSubfeature(this);
  item = new InventoryItemStoreSubfeature(this, this.transloco);

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
    return shouldFetchCollection(this.items(), this.status(), this.lastUpdated());
  });
  categories = computed(() => extractCategories(this.items()));
  filtersList = computed(() => this.computeFiltersList());
  categoryFilter = computed(() => this.filters()[INVENTORY_FILTER.CATEGORY]);
  counters = computed(() => countDoneItems(this.items()));

  // Effects ------------------------------------------------------------------
  constructor() {
    effect(() => this.effectOnGuest(), { allowSignalWrites: true });
  }

  // Derived state factories --------------------------------------------------
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
