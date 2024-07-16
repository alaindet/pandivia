import { LIST_FILTER, ListFilter } from '../types';
import { ListStore } from './feature';

export class ListSearchFiltersStoreSubfeature {
  constructor(
    private parent: ListStore,
  ) {}

  setCategory(category: string) {
    this.updateByName(LIST_FILTER.CATEGORY, category);
  }

  clearCategory() {
    this.updateByName(LIST_FILTER.CATEGORY, null);
  }

  setCompleted(isDone: boolean) {
    this.updateByName(LIST_FILTER.IS_DONE, isDone);
  }

  clearCompleted() {
    this.updateByName(LIST_FILTER.IS_DONE, null);
  }

  setSearchQuery(searchQuery: string) {
    this.updateByName(LIST_FILTER.SEARCH_QUERY, searchQuery);
  }

  clearSearchQuery() {
    this.updateByName(LIST_FILTER.SEARCH_QUERY, null);
  }

  clearByName(filterName: ListFilter) {
    this.updateByName(filterName, null);
  }

  clearAll() {
    this.parent.filters.set({
      [LIST_FILTER.CATEGORY]: null,
      [LIST_FILTER.IS_DONE]: null,
      [LIST_FILTER.SEARCH_QUERY]: null,
    });
  }

  private updateByName<T = any>(filterName: ListFilter, value: T) {
    this.parent.filters.update(prev => ({
      ...prev,
      [filterName]: value,
    }));
  }
}
