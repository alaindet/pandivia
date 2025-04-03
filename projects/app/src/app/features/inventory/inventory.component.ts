import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  computed,
  effect,
  inject,
} from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { matClear, matAdd } from '@ng-icons/material-icons/baseline';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import {
  Observable,
  Subject,
  catchError,
  filter,
  of,
  take,
  takeUntil,
} from 'rxjs';
import { MediaQueryService } from '@fruit/services';
import { ButtonComponent } from '@fruit/components';
import { IconButtonComponent } from '@fruit/components';
import { CardListComponent, CardListItemActionOutput } from '@fruit/components';
import { ModalService } from '@fruit/components';
import { ActionsMenuItem } from '@fruit/components';
import {
  ConfirmPromptModalComponent,
  ConfirmPromptModalInput,
  ConfirmPromptModalOutput,
} from '@fruit/components';
import { ChangeCategoryModalComponent } from '@app/common/components/change-category-modal';

import { StackedLayoutService } from '@app/common/layouts';
import { DEFAULT_CATEGORY } from '@app/core';
import { NAVIGATION_ITEM_INVENTORY, UiStore } from '@app/core/ui';
import { environment } from '@app/environment';
import { CreateListItemDto } from '@app/features/list';
import { ListStore } from '../list/store';
import {
  InventoryItemFormModalComponent,
  InventoryItemFormModalInput,
} from './components/item-form-modal';
import { CATEGORY_REMOVE_PROMPT, ITEM_REMOVE_PROMPT } from './constants';
import * as categoryMenu from './contextual-menus/category';
import * as itemMenu from './contextual-menus/item';
import * as listMenu from './contextual-menus/list';
import { InventoryStore } from './store';
import { InventoryFilterToken, InventoryItem } from './types';

@Component({
  selector: 'app-inventory-page',
  imports: [
    NgTemplateOutlet,
    NgIcon,
    ButtonComponent,
    IconButtonComponent,
    CardListComponent,
    TranslocoModule,
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css',
})
export class InventoryPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private inventoryStore = inject(InventoryStore);
  private uiStore = inject(UiStore);
  private listStore = inject(ListStore);
  private layout = inject(StackedLayoutService);
  private modal = inject(ModalService);
  private transloco = inject(TranslocoService);

  isMobile = inject(MediaQueryService).getFromMobileDown();
  DEFAULT_CATEGORY = DEFAULT_CATEGORY;
  categoryContextualMenu!: ActionsMenuItem[];
  itemGroups = this.inventoryStore.getCategorizedFilteredItems();
  loaded = this.inventoryStore.isLoaded;
  inErrorStatus = this.inventoryStore.isError;
  themeConfig = this.uiStore.theme.config;
  getItemContextualMenu = this.getTranslatedItemContextualMenuFn();
  filters = computed(() => this.computeTranslatedFilters());
  pinnedCategory = this.inventoryStore.categoryFilter;
  counters = this.inventoryStore.counters;
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
    this.inventoryStore.allItems.fetch();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onListAction(action: string) {
    switch (action) {
      case listMenu.LIST_ACTION_REFRESH.id: {
        this.inventoryStore.allItems.fetch(true);
        break;
      }
    }
  }

  onCategoryAction(category: string, action: string) {
    switch (action) {
      case categoryMenu.CATEGORY_ACTION_CREATE_ITEM.id: {
        this.showCreateItemByCategoryModal(category);
        break;
      }

      case categoryMenu.CATEGORY_ACTION_ADD_TO_LIST.id: {
        this.listStore.categoryItems.cloneFromInventory(
          this.inventoryStore.filterItemsByCategory(category)
        );
        break;
      }

      case categoryMenu.CATEGORY_ACTION_REMOVE.id: {
        const config = CATEGORY_REMOVE_PROMPT;
        const params = { categoryName: category };
        const title = this.transloco.translate(config.title, params);
        const message = this.transloco.translate(config.message, params);
        const prompt = { ...CATEGORY_REMOVE_PROMPT, title, message };

        this.confirmPrompt(prompt).subscribe({
          error: () => console.log('Canceled'),
          next: () => this.inventoryStore.categoryItems.remove(category),
        });
        break;
      }
    }
  }

  onItemAction({ itemId, action }: CardListItemActionOutput) {
    switch (action) {
      case itemMenu.ITEM_ACTION_ADD_TO_LIST.id:
        this.cloneItemToList(itemId);
        break;

      case itemMenu.ITEM_ACTION_MOVE_TO_CATEGORY.id:
        this.showMoveToCategoryModal(itemId);
        break;

      case itemMenu.ITEM_ACTION_EDIT.id:
        this.showEditItemModal(itemId);
        break;

      case itemMenu.ITEM_ACTION_REMOVE.id:
        const item = this.inventoryStore.getItemById(itemId)()!;
        const config = ITEM_REMOVE_PROMPT;
        const params = { itemName: item.name };
        const title = this.transloco.translate(config.title, params);
        const message = this.transloco.translate(config.message, params);
        const prompt = { ...ITEM_REMOVE_PROMPT, title, message };
        this.confirmPrompt(prompt).subscribe(() => {
          this.inventoryStore.item.remove(item.id);
        });
        break;
    }
  }

  onShowCreateItemModal(): void {
    const title = this.transloco.translate('common.itemModal.createTitle');
    const modalInput: InventoryItemFormModalInput = { title };
    this.modal.open(InventoryItemFormModalComponent, modalInput, {
      fullPage: this.isMobile(),
    });
  }

  onPinCategory(category: string, isPinned: boolean) {
    if (isPinned) {
      this.inventoryStore.searchFilters.setCategory(category);
    } else {
      this.inventoryStore.searchFilters.clearCategory();
    }
  }

  onRemoveFilter(filter: InventoryFilterToken) {
    this.inventoryStore.searchFilters.clearByName(filter.key);
  }

  private getTranslatedItemContextualMenuFn(): (
    item: InventoryItem
  ) => ActionsMenuItem[] {
    return (item: InventoryItem) => {
      return itemMenu.getItemContextualMenu(item).map((action) => {
        const label = this.transloco.translate(action.label);
        return { ...action, label };
      });
    };
  }

  private computeTranslatedFilters(): InventoryFilterToken[] | null {
    const filtersList = this.inventoryStore.filtersList();

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

  private initPageMetadata(): void {
    const headerTitle = this.transloco.translate('inventory.title');
    this.layout.title.set(headerTitle);
    const title = `${headerTitle} - ${environment.appName}`;
    this.uiStore.title.set(title);
    const currentRoute = NAVIGATION_ITEM_INVENTORY.id;
    this.uiStore.navigation.setCurrent(currentRoute);
  }

  private initListContextualMenu(): void {
    const actions = listMenu.LIST_CONTEXTUAL_MENU.map((action) => {
      const label = this.transloco.translate(action.label);
      return { ...action, label };
    });
    this.layout.headerActions.set(actions);
    this.layout.headerActions.confirmed
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.onListAction.bind(this));
  }

  private initCategoryContextualMenu(): void {
    const actions = categoryMenu.CATEGORY_CONTEXTUAL_MENU.map((action) => {
      const label = this.transloco.translate(action.label);
      return { ...action, label };
    });
    this.categoryContextualMenu = actions;
  }

  private initSearchFeature(): void {
    this.layout.search.enable();

    this.layout.search.searched.subscribe((searchQuery) => {
      if (!searchQuery) {
        this.inventoryStore.searchFilters.clearSearchQuery();
        return;
      }

      this.inventoryStore.searchFilters.setSearchQuery(searchQuery);
    });

    this.layout.search.cleared.subscribe(() => {
      this.inventoryStore.searchFilters.clearSearchQuery();
    });
  }

  private confirmPrompt(
    input: ConfirmPromptModalInput
  ): Observable<ConfirmPromptModalOutput> {
    const modal$ = this.modal.open(ConfirmPromptModalComponent, input);
    return modal$.closed().pipe(take(1));
  }

  private showEditItemModal(itemId: string): void {
    const item = this.inventoryStore.getItemById(itemId)()!;
    const title = this.transloco.translate('common.itemModal.editTitle');
    const modalInput: InventoryItemFormModalInput = { title, item };
    this.modal.open(InventoryItemFormModalComponent, modalInput, {
      fullPage: this.isMobile(),
    });
  }

  private showCreateItemByCategoryModal(category: string): void {
    const title = this.transloco.translate('common.itemModal.createTitle');
    const modalInput: InventoryItemFormModalInput = { title, category };
    this.modal.open(InventoryItemFormModalComponent, modalInput, {
      fullPage: this.isMobile(),
    });
  }

  private cloneItemToList(itemId: string): void {
    const inventoryItem = this.inventoryStore.getItemById(itemId)()!;
    const listItem = this.listStore.itemExistsWithExactName(
      inventoryItem.name
    )();

    if (listItem !== null) {
      const name = inventoryItem.name;
      this.uiStore.notifications.error('list.error.itemUnique', { name });
      return;
    }

    const dto: CreateListItemDto = {
      category: inventoryItem?.category ?? '',
      name: inventoryItem.name,
      amount: 1,
      description: inventoryItem.description,
    };

    this.listStore.item.create(dto);
  }

  private showMoveToCategoryModal(itemId: string): void {
    const translatedUncategorized = this.transloco.translate(
      'common.uncategorized'
    );

    const translateCategory = (category: string): string => {
      if (category !== DEFAULT_CATEGORY) return category;
      return translatedUncategorized;
    };

    const item = this.inventoryStore.getItemById(itemId)()!;
    const title = this.transloco.translate('common.menu.moveToCategory');
    const categories = this.inventoryStore
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
        filter((val) => !!val)
      );

    selectedCategory$.subscribe((payload) => {
      const category =
        payload.category === translatedUncategorized
          ? DEFAULT_CATEGORY
          : payload.category;

      this.inventoryStore.item.edit({ ...item, category });
    });
  }
}
