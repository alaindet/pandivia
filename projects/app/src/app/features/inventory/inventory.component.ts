import { Component, OnDestroy, OnInit, Signal, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { Observable, Subject, catchError, combineLatest, map, of, switchMap, take, takeUntil, throwError } from 'rxjs';
import { NgTemplateOutlet } from '@angular/common';

import { ACTIONS_MENU_EXPORTS, ActionsMenuItem, ButtonComponent, CardListComponent, ConfirmPromptModalComponent, ConfirmPromptModalInput, ConfirmPromptModalOutput, ItemActionOutput, ModalService, PageHeaderComponent } from '@app/common/components';
import { StackedLayoutService } from '@app/common/layouts';
import { errorI18n, readErrorI18n } from '@app/common/utils';
import { DEFAULT_CATEGORY } from '@app/core';
import { NAVIGATION_ITEM_INVENTORY, UiService, UiStoreFeatureService } from '@app/core/ui';
import { environment } from '@app/environment';
import { CreateListItemDto, ListItem } from '@app/features/list';
import { ChangeCategoryModalComponent, ChangeCategoryModalInput } from '@app/common/components/change-category-modal';
import { MediaQueryService } from '@app/common/services';
import { InventoryItemFormModalComponent, InventoryItemFormModalInput } from './components/item-form-modal';
import { CATEGORY_REMOVE_PROMPT, ITEM_REMOVE_PROMPT, LIST_REMOVE_PROMPT } from './constants';
import * as categoryMenu from './contextual-menus/category';
import * as itemMenu from './contextual-menus/item';
import * as listMenu from './contextual-menus/list';
import { InventoryFilterToken, InventoryItem } from './types';
import { InventoryStoreFeatureService } from './store';
import { ListStoreFeatureService } from '../list/store';

const imports = [
  NgTemplateOutlet,
  PageHeaderComponent,
  ...ACTIONS_MENU_EXPORTS,
  MatIconModule,
  ButtonComponent,
  CardListComponent,
  TranslocoModule,
];

@Component({
  selector: 'app-inventory-page',
  standalone: true,
  imports,
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss',
})
export class InventoryPageComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();
  private store = inject(InventoryStoreFeatureService);
  private uiStore = inject(UiStoreFeatureService);
  private listStore = inject(ListStoreFeatureService);
  private layout = inject(StackedLayoutService);
  private ui = inject(UiService);
  private modal = inject(ModalService);
  private transloco = inject(TranslocoService);

  isMobile = inject(MediaQueryService).getFromMobileDown();
  DEFAULT_CATEGORY = DEFAULT_CATEGORY;
  categoryContextualMenu!: ActionsMenuItem[];
  itemGroups = this.store.getCategorizedFilteredItems();
  loaded = this.store.isLoaded;
  inErrorStatus = this.store.isError;
  themeConfig = this.ui.theme.config;
  getItemContextualMenu = this.getTranslatedItemContextualMenuFn();
  filters = computed(() => this.computeTranslatedFilters());
  pinnedCategory = this.store.categoryFilter;
  counters = this.store.counters;
  pageCountersEffect = effect(() => this.layout.headerCounters.set(this.counters()), {
    allowSignalWrites: true
  });

  ngOnInit() {
    this.initPageMetadata();
    this.initListContextualMenu();
    this.initCategoryContextualMenu();
    this.initSearchFeature();
    this.store.allItems.fetch();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onListAction(action: string) {
    switch (action) {

      case listMenu.LIST_ACTION_REFRESH.id: {
        this.store.allItems.fetch(true);
        break;
      }

      case listMenu.LIST_ACTION_REMOVE.id: {
        const title = this.transloco.translate(LIST_REMOVE_PROMPT.title);
        const message = this.transloco.translate(LIST_REMOVE_PROMPT.message);
        const prompt = { ...LIST_REMOVE_PROMPT, title, message };

        this.confirmPrompt(prompt).subscribe({
          error: () => console.log('Canceled'),
          next: () => this.store.allItems.remove(),
        });
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

      case categoryMenu.CATEGORY_ACTION_REMOVE.id: {
        const config = CATEGORY_REMOVE_PROMPT;
        const params = { categoryName: category };
        const title = this.transloco.translate(config.title, params);
        const message = this.transloco.translate(config.message, params);
        const prompt = { ...CATEGORY_REMOVE_PROMPT, title, message };

        this.confirmPrompt(prompt).subscribe({
          error: () => console.log('Canceled'),
          next: () => this.store.categoryItems.remove(category),
        });
        break;
      }
    }
  }

  onItemAction({ itemId, action }: ItemActionOutput) {
    switch(action) {

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
        const item = this.store.getItemById(itemId)()!;
        const config = ITEM_REMOVE_PROMPT;
        const params = { itemName: item.name };
        const title = this.transloco.translate(config.title, params);
        const message = this.transloco.translate(config.message, params);
        const prompt = { ...ITEM_REMOVE_PROMPT, title, message };
        this.confirmPrompt(prompt).subscribe(() => this.store.item.remove(item.id));
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
      this.store.searchFilters.setCategory(category);
    } else {
      this.store.searchFilters.clearCategory();
    }
  }

  onRemoveFilter(filter: InventoryFilterToken) {
    this.store.searchFilters.clearByName(filter.key);
  }

  private getTranslatedItemContextualMenuFn(): (item: InventoryItem) => ActionsMenuItem[] {
    return (item: InventoryItem) => {
      return itemMenu.getItemContextualMenu(item).map(action => {
        const label = this.transloco.translate(action.label);
        return { ...action, label };
      });
    };
  }

  private computeTranslatedFilters(): InventoryFilterToken[] | null {
    const filtersList = this.store.filtersList();

    if (filtersList === null) {
      return null;
    }

    return filtersList.map(filter => {
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
    const actions = listMenu.LIST_CONTEXTUAL_MENU.map(action => {
      const label = this.transloco.translate(action.label);
      return { ...action, label };
    });
    this.layout.headerActions.set(actions);
    this.layout.headerActions.confirmed
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.onListAction.bind(this));
  }

  private initCategoryContextualMenu(): void {
    const actions = categoryMenu.CATEGORY_CONTEXTUAL_MENU.map(action => {
      const label = this.transloco.translate(action.label);
      return { ...action, label };
    });
    this.categoryContextualMenu = actions;
  }

  private initSearchFeature(): void {
    this.layout.search.enable();

    this.layout.search.searched.subscribe(searchQuery => {
      if (!searchQuery) {
        this.store.searchFilters.clearSearchQuery();
        return;
      }

      this.store.searchFilters.setSearchQuery(searchQuery);
    });

    this.layout.search.cleared.subscribe(() => {
      this.store.searchFilters.clearSearchQuery();
    });
  }

  private confirmPrompt(
    input: ConfirmPromptModalInput,
  ): Observable<ConfirmPromptModalOutput> {
    const modal$ = this.modal.open(ConfirmPromptModalComponent, input);
    return modal$.closed().pipe(take(1));
  }

  private showEditItemModal(itemId: string): void {
    const item = this.store.getItemById(itemId)()!;
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

    const inventoryItem = this.store.getItemById(itemId)()!;
    const listItem = this.listStore.itemExistsWithExactName(inventoryItem.name);

    const inventoryItemName = inventoryItem?.name?.toLowerCase();
    const listItemName = listItem?.name?.toLowerCase();

    // TODO...

    const checkUniqueNameContraint = (payload: {
      inventoryItem: InventoryItem;
      listItem: ListItem | null;
    }) => {
      const { inventoryItem, listItem } = payload;
      const inventoryItemName = inventoryItem?.name?.toLowerCase();
      const listItemName = listItem?.name?.toLowerCase();
      const name = inventoryItemName;
      return (inventoryItemName === listItemName)
        ? throwError(() => errorI18n('list.error.itemUnique', { name }))
        : of(inventoryItem);
    };

    combineLatest({ inventoryItem, listItem })
      .pipe(take(1), switchMap(checkUniqueNameContraint))
      .subscribe({
        error: err => this.ui.notification.err(...readErrorI18n(err)),
        next: inventoryItem => {

          const dto: CreateListItemDto = {
            category: inventoryItem?.category ?? '',
            name: inventoryItem.name,
            amount: 1,
          };

          if (inventoryItem.description) {
            dto.description = inventoryItem.description;
          }

          this.store.dispatch(listCreateItem.try({ dto }));
        },
      });
  }

  private showMoveToCategoryModal(itemId: string): void {

    let theItem!: InventoryItem;
    const translatedUncategorized = this.transloco.translate('common.uncategorized');

    const translateCategory = (category: string): string => {
      if (category !== DEFAULT_CATEGORY) return category;
      return translatedUncategorized;
    };

    findInventoryItemById(this.store, itemId).pipe(
      switchMap(item => {
        theItem = item;
        const title = this.transloco.translate('common.menu.moveToCategory');
        const allCategories = this.store.selectSignal(selectInventoryCategories);
        const categories = allCategories()
          .filter(category => category !== item.category)
          .map(category => translateCategory(category));

        if (!categories.length) {
          return throwError(() => Error(JSON.stringify({
            message: 'common.error.onlyOneCategory',
          })));
        }

        const modalInput: ChangeCategoryModalInput = { title, categories };
        const modal$ = this.modal.open(ChangeCategoryModalComponent, modalInput);

        return modal$.closed().pipe(
          // Emit canceled modal as a silent error
          catchError(() => of(null)),
          take(1),
        );
      }),
    ).subscribe({
      error: err => this.ui.notification.err(...readErrorI18n(err)),
      next: modalPayload => {
        if (modalPayload === null) return; // Modal was canceled
        let { category } = modalPayload;
        if (category === translatedUncategorized) category = DEFAULT_CATEGORY;
        const item = { ...theItem, category };
        // TODO: Please add a specific "Move to category" action
        this.store.dispatch(inventoryEditItem.try({ item }));
      },
    });
  }
}
