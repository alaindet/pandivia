import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  computed,
  effect,
  inject,
} from '@angular/core';
import { HashMap, TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { Subject, catchError, of, take, takeUntil } from 'rxjs';
import { NgIcon } from '@ng-icons/core';
import { matAdd, matClear } from '@ng-icons/material-icons/baseline';
import { filterNull } from '@common/rxjs';

import {
  ActionsMenuItem,
  ButtonComponent,
  IconButtonComponent,
  CardListComponent,
  ChangeCategoryModalComponent,
  ConfirmPromptModalComponent,
  ConfirmPromptModalInput,
  ItemActionOutput,
  ItemToggledOutput,
  ModalService,
} from '@app/common/components';
import { StackedLayoutService } from '@app/common/layouts';
import { MediaQueryService } from '@app/common/services';
import { DEFAULT_CATEGORY } from '@app/core';
import { NAVIGATION_ITEM_LIST, UiStore } from '@app/core/ui';
import { environment } from '@app/environment';
import {
  ListItemFormModalComponent,
  ListItemFormModalInput,
} from './components/item-form-modal';
import {
  CATEGORY_REMOVE_COMPLETED_PROMPT,
  CATEGORY_REMOVE_PROMPT,
  ITEM_REMOVE_PROMPT,
  LIST_REMOVE_COMPLETED_PROMPT,
} from './constants';
import * as categoryMenu from './contextual-menus/category';
import * as itemMenu from './contextual-menus/item';
import * as listMenu from './contextual-menus/list';
import { ListStore } from './store';
import { LIST_FILTER, ListFilterToken, ListItem } from './types';

@Component({
  selector: 'app-list-page',
  imports: [
    NgTemplateOutlet,
    CardListComponent,
    ButtonComponent,
    IconButtonComponent,
    TranslocoModule,
    NgIcon,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
})
export class ListPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private uiStore = inject(UiStore);
  private listStore = inject(ListStore);
  private layout = inject(StackedLayoutService);
  private modal = inject(ModalService);
  private transloco = inject(TranslocoService);
  isMobile = inject(MediaQueryService).getFromMobileDown();

  DEFAULT_CATEGORY = DEFAULT_CATEGORY;
  categoryContextualMenu!: ActionsMenuItem[];
  itemGroups = this.listStore.getCategorizedFilteredItems();
  loaded = this.listStore.isLoaded;
  inErrorStatus = this.listStore.isError;
  themeConfig = this.uiStore.theme.config;
  pinnedCategory = this.listStore.categoryFilter;
  filters = computed(() => this.computeTranslatedFilters());
  getItemContextualMenu = this.getTranslatedItemContextualMenuFn();
  counters = this.listStore.counters;
  pageCountersEffect = effect(() =>
    this.layout.headerCounters.set(this.counters())
  );

  matClear = matClear;
  matAdd = matAdd;

  ngOnInit() {
    this.initPageMetadata();
    this.initListContextualMenu();
    this.initCategoryContextualMenu();
    this.initSearchFeature();
    this.listStore.allItems.fetch();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onListAction(action: string) {
    switch (action) {
      case listMenu.LIST_ACTION_REFRESH.id:
        this.listStore.allItems.fetch(true);
        break;

      case listMenu.LIST_ACTION_COMPLETE.id:
        this.listStore.allItems.complete();
        break;

      case listMenu.LIST_ACTION_HIDE_COMPLETED.id:
        this.listStore.searchFilters.setCompleted(false);
        break;

      case listMenu.LIST_ACTION_SHOW_COMPLETED.id:
        this.listStore.searchFilters.clearCompleted();
        break;

      case listMenu.LIST_ACTION_UNDO.id:
        this.listStore.allItems.undo();
        break;

      case listMenu.LIST_ACTION_REMOVE_COMPLETED.id: {
        this.confirmPrompt(LIST_REMOVE_COMPLETED_PROMPT).subscribe({
          error: () => console.log('Canceled'),
          next: () => this.listStore.allItems.removeCompleted(),
        });
        break;
      }
    }
  }

  onCategoryAction(category: string, action: string) {
    const categoryName = category;

    switch (action) {
      case categoryMenu.CATEGORY_ACTION_CREATE_ITEM.id:
        this.showCreateItemByCategoryModal(category);
        break;

      case categoryMenu.CATEGORY_ACTION_COMPLETE.id:
        this.listStore.categoryItems.complete(category);
        break;

      case categoryMenu.CATEGORY_ACTION_UNDO.id:
        this.listStore.categoryItems.undo(category);
        break;

      case categoryMenu.CATEGORY_ACTION_REMOVE_COMPLETED.id: {
        this.confirmPrompt(CATEGORY_REMOVE_COMPLETED_PROMPT, {
          categoryName,
        }).subscribe({
          error: () => console.log('Canceled'),
          next: () => this.listStore.categoryItems.removeCompleted(category),
        });
        break;
      }

      case categoryMenu.CATEGORY_ACTION_REMOVE.id: {
        this.confirmPrompt(CATEGORY_REMOVE_PROMPT, { categoryName }).subscribe({
          error: () => console.log('Canceled'),
          next: () => this.listStore.categoryItems.remove(category),
        });
        break;
      }
    }
  }

  onItemAction({ itemId, action }: ItemActionOutput) {
    switch (action) {
      case itemMenu.ITEM_ACTION_COMPLETE.id:
        this.listStore.item.complete(itemId);
        break;

      case itemMenu.ITEM_ACTION_UNDO.id:
        this.listStore.item.undo(itemId);
        break;

      case itemMenu.ITEM_ACTION_EDIT.id:
        this.showEditItemModal(itemId);
        break;

      case itemMenu.ITEM_ACTION_MOVE_TO_CATEGORY.id:
        this.showMoveToCategoryModal(itemId);
        break;

      case itemMenu.ITEM_ACTION_INCREMENT.id:
        this.listStore.item.increment(itemId);
        break;

      case itemMenu.ITEM_ACTION_DECREMENT.id:
        this.decrementOrRemove(itemId);
        break;

      case itemMenu.ITEM_ACTION_REMOVE.id: {
        const item = this.listStore.getItemById(itemId)()!;
        this.confirmPrompt(ITEM_REMOVE_PROMPT, {
          itemName: item.name,
        }).subscribe({
          error: () => console.log('Canceled'),
          next: () => this.listStore.item.remove(itemId),
        });
        break;
      }
    }
  }

  onShowCreateItemModal(): void {
    const title = this.transloco.translate('common.itemModal.createTitle');
    const modalInput: ListItemFormModalInput = { title };
    this.modal.open(ListItemFormModalComponent, modalInput, {
      fullPage: this.isMobile(),
    });
  }

  onItemToggle({ itemId, isDone }: ItemToggledOutput) {
    this.listStore.item.toggle(itemId);
  }

  onPinCategory(category: string, isPinned: boolean) {
    if (isPinned) {
      this.listStore.searchFilters.setCategory(category);
    } else {
      this.listStore.searchFilters.clearCategory();
    }
  }

  onRemoveFilter(filter: ListFilterToken) {
    const name = filter.key;
    this.listStore.searchFilters.clearByName(name);

    if (name === LIST_FILTER.SEARCH_QUERY) {
      this.layout.search.clear(false);
      this.layout.search.hide();
    }
  }

  private computeTranslatedFilters(): ListFilterToken[] | null {
    const filtersList = this.listStore.filtersList();

    if (filtersList === null) {
      return null;
    }

    return filtersList.map((filter) => {
      if (filter.label === DEFAULT_CATEGORY) {
        return { ...filter, label: 'common.uncategorized' };
      }
      return filter;
    });
  }

  private getTranslatedItemContextualMenuFn(): (
    item: ListItem
  ) => ActionsMenuItem[] {
    return (item: ListItem) => {
      return itemMenu.getItemContextualMenu(item).map((action) => {
        const label = this.transloco.translate(action.label);
        return { ...action, label };
      });
    };
  }

  private initPageMetadata(): void {
    const headerTitle = this.transloco.translate('list.title');
    this.layout.title.set(headerTitle);
    const title = `${headerTitle} - ${environment.appName}`;
    this.uiStore.title.set(title);
    const current = NAVIGATION_ITEM_LIST.id;
    this.uiStore.navigation.setCurrent(current);
  }

  private confirmPrompt(
    prompt: ConfirmPromptModalInput,
    messageParams?: HashMap
  ) {
    const title = this.transloco.translate(prompt.title);
    const message = this.transloco.translate(prompt.message, messageParams);
    const translatedPrompt = { ...prompt, title, message };
    const modal$ = this.modal.open(
      ConfirmPromptModalComponent,
      translatedPrompt
    );
    return modal$.closed().pipe(take(1));
  }

  private showCreateItemByCategoryModal(category: string): void {
    const title = this.transloco.translate('common.itemModal.createTitle');
    const modalInput: ListItemFormModalInput = { title, category };
    this.modal.open(ListItemFormModalComponent, modalInput, {
      fullPage: this.isMobile(),
    });
  }

  private showEditItemModal(itemId: string): void {
    const item = this.listStore.getItemById(itemId)()!;
    const title = this.transloco.translate('common.itemModal.editTitle');
    const modalInput: ListItemFormModalInput = { item, title };
    this.modal.open(ListItemFormModalComponent, modalInput, {
      fullPage: this.isMobile(),
    });
  }

  private decrementOrRemove(itemId: string): void {
    const item = this.listStore.getItemById(itemId)()!;
    if (item.amount > 1) {
      this.listStore.item.decrement(itemId);
      return;
    }

    this.confirmPrompt(ITEM_REMOVE_PROMPT, { itemName: item.name }).subscribe({
      error: () => console.log('Canceled'),
      next: () => this.listStore.item.remove(itemId),
    });
  }

  private initListContextualMenu(): void {
    const isDoneFilter = this.listStore.isDoneFilter();
    const actions = listMenu
      .getListContextualMenu(isDoneFilter)
      .map((action) => {
        const label = this.transloco.translate(action.label);
        return { ...action, label };
      });
    this.layout.headerActions.set(actions);

    this.layout.headerActions.confirmed
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.onListAction.bind(this));
  }

  private initCategoryContextualMenu(): void {
    this.categoryContextualMenu = categoryMenu.CATEGORY_CONTEXTUAL_MENU.map(
      (item) => {
        const label = this.transloco.translate(item.label);
        return { ...item, label };
      }
    );
  }

  private initSearchFeature(): void {
    this.layout.search.enable();

    this.layout.search.searched.subscribe((searchQuery) => {
      if (!searchQuery) {
        this.listStore.searchFilters.clearSearchQuery();
        return;
      }

      this.listStore.searchFilters.setSearchQuery(searchQuery);
    });

    this.layout.search.cleared.subscribe(() => {
      this.listStore.searchFilters.clearSearchQuery();
    });
  }

  private showMoveToCategoryModal(itemId: string): void {
    const translatedUncategorized = this.transloco.translate(
      'common.uncategorized'
    );

    const translateCategory = (category: string): string => {
      if (category !== DEFAULT_CATEGORY) return category;
      return translatedUncategorized;
    };

    const item = this.listStore.getItemById(itemId)()!;
    const title = this.transloco.translate('common.menu.moveToCategory');
    const categories = this.listStore
      .categories()
      .filter((category) => category !== item.category)
      .map((category) => translateCategory(category));

    if (!categories.length) {
      this.uiStore.notifications.error('common.error.onlyOneCategory');
      return;
    }

    const selectedCategory$ = this.modal
      .open(ChangeCategoryModalComponent, { title, categories })
      .closed()
      .pipe(
        catchError(() => of(null)),
        take(1),
        filterNull()
      );

    selectedCategory$.subscribe((payload) => {
      const category =
        payload.category === translatedUncategorized
          ? DEFAULT_CATEGORY
          : payload.category;

      this.listStore.item.edit({ ...item, category });
    });
  }
}
